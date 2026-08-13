import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { roles } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const roleId = parseInt(id);

    const [role] = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (!role) {
      return NextResponse.json({ message: "Role tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error: any) {
    console.error("GET /api/roles/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data role" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const roleId = parseInt(id);
    const body = await request.json();

    const { name, description } = body;

    const [existing] = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Role tidak ditemukan" }, { status: 404 });
    }

    if (name && name !== existing.name) {
      const [duplicate] = await db
        .select()
        .from(roles)
        .where(and(eq(roles.name, name), ne(roles.id, roleId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json({ message: "Nama role sudah digunakan" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(roles)
      .set({
        name: name ?? existing.name,
        description: description !== undefined ? description : existing.description,
        updatedAt: new Date(),
      })
      .where(eq(roles.id, roleId))
      .returning();

    return NextResponse.json({ message: "Role berhasil diperbarui", data: updated });
  } catch (error: any) {
    console.error("PUT /api/roles/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui role" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const roleId = parseInt(id);

    await db.delete(roles).where(eq(roles.id, roleId));

    return NextResponse.json({ message: "Role berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE /api/roles/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus role" }, { status: 500 });
  }
}
