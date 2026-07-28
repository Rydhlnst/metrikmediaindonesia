import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { users, roles } from "@/db/schema/index";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        roleId: users.roleId,
        isActive: users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        roleName: roles.name,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error: any) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data pengguna" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const body = await request.json();

    const { name, email, password, roleId, avatar, isActive } = body;

    // Check if user exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check email uniqueness if changing email
    if (email) {
      const [emailTaken] = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`${users.email} = ${email} AND ${users.id} != ${parseInt(id)}`)
        .limit(1);

      if (emailTaken) {
        return NextResponse.json(
          { message: "Email sudah digunakan pengguna lain" },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (roleId !== undefined) updateData.roleId = roleId;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    if (password) {
      const bcrypt = await import("bcryptjs");
      updateData.password = await bcrypt.hash(password, 12);
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(id)))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        roleId: users.roleId,
        isActive: users.isActive,
        updatedAt: users.updatedAt,
      });

    return NextResponse.json({
      message: "Pengguna berhasil diperbarui",
      data: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/users/[id] error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui pengguna" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;

    // Check if user exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(users).where(eq(users.id, parseInt(id)));

    return NextResponse.json({ message: "Pengguna berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { message: "Gagal menghapus pengguna" },
      { status: 500 }
    );
  }
}
