import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { permissions, rolePermissions, roles } from "@/db/schema/index";
import { eq, and, ne, inArray } from "drizzle-orm";
import { positiveIdSchema, roleSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const roleId = parsedId.data;

    const [role] = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (!role) {
      return NextResponse.json({ message: "Role tidak ditemukan" }, { status: 404 });
    }

    const rolePermissionRows = await db
      .select({ key: permissions.key })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));
    return NextResponse.json({ ...role, permissionKeys: rolePermissionRows.map((item) => item.key) });
  } catch (error) {
    console.error("GET /api/roles/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data role" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const roleId = parsedId.data;
    const parsed = roleSchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, description, permissionKeys } = parsed.data;

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

    if (permissionKeys !== undefined) {
      const permissionRows = await db
        .select({ id: permissions.id })
        .from(permissions)
        .where(inArray(permissions.key, permissionKeys));
      await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
      if (permissionRows.length) {
        await db.insert(rolePermissions).values(permissionRows.map((permission) => ({ roleId, permissionId: permission.id }))).onConflictDoNothing();
      }
    }

    return NextResponse.json({ message: "Role berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/roles/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui role" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const roleId = parsedId.data;

    await db.delete(roles).where(eq(roles.id, roleId));

    return NextResponse.json({ message: "Role berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/roles/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus role" }, { status: 500 });
  }
}
