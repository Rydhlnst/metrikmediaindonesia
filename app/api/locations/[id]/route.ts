import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { locations } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { locationSchema, positiveIdSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const locationId = parsedId.data;

    const [loc] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, locationId))
      .limit(1);

    if (!loc) {
      return NextResponse.json({ message: "Wilayah tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(loc);
  } catch (error) {
    console.error("GET /api/locations/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data wilayah" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const locationId = parsedId.data;
    const parsed = locationSchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug, level, parentId, description, isActive } = parsed.data;

    const [existing] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, locationId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Wilayah tidak ditemukan" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(locations)
        .where(and(eq(locations.slug, slug), ne(locations.id, locationId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json({ message: "Slug wilayah sudah digunakan" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(locations)
      .set({
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        level: level ?? existing.level,
        parentId: parentId !== undefined ? parentId : existing.parentId,
        description: description !== undefined ? description : existing.description,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        updatedAt: new Date(),
      })
      .where(eq(locations.id, locationId))
      .returning();

    return NextResponse.json({ message: "Wilayah berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/locations/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui wilayah" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const locationId = parsedId.data;

    // Cegah hapus jika masih memiliki anak wilayah
    const [child] = await db
      .select({ id: locations.id })
      .from(locations)
      .where(eq(locations.parentId, locationId))
      .limit(1);

    if (child) {
      return NextResponse.json(
        { message: "Wilayah masih memiliki sub-wilayah. Hapus sub-wilayah terlebih dahulu." },
        { status: 400 }
      );
    }

    await db.delete(locations).where(eq(locations.id, locationId));

    return NextResponse.json({ message: "Wilayah berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/locations/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus wilayah" }, { status: 500 });
  }
}
