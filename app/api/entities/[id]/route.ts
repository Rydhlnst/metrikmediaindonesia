import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { entities } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { entitySchema, positiveIdSchema } from "@/lib/validators/cms";
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
    const entityId = parsedId.data;

    const [entity] = await db
      .select()
      .from(entities)
      .where(eq(entities.id, entityId))
      .limit(1);

    if (!entity) {
      return NextResponse.json({ message: "Entitas tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(entity);
  } catch (error) {
    console.error("GET /api/entities/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data entitas" }, { status: 500 });
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
    const entityId = parsedId.data;
    const parsed = entitySchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { type, name, slug, avatarOrLogo, bioOrDesc, metadata, isActive } = parsed.data;

    const [existing] = await db
      .select()
      .from(entities)
      .where(eq(entities.id, entityId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Entitas tidak ditemukan" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(entities)
        .where(and(eq(entities.slug, slug), ne(entities.id, entityId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json({ message: "Slug entitas sudah digunakan" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(entities)
      .set({
        type: type ?? existing.type,
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        avatarOrLogo: avatarOrLogo !== undefined ? avatarOrLogo : existing.avatarOrLogo,
        bioOrDesc: bioOrDesc !== undefined ? bioOrDesc : existing.bioOrDesc,
        metadata: metadata !== undefined ? metadata : existing.metadata,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        updatedAt: new Date(),
      })
      .where(eq(entities.id, entityId))
      .returning();

    return NextResponse.json({ message: "Entitas berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/entities/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui entitas" }, { status: 500 });
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
    const entityId = parsedId.data;

    await db.delete(entities).where(eq(entities.id, entityId));

    return NextResponse.json({ message: "Entitas berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/entities/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus entitas" }, { status: 500 });
  }
}
