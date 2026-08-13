import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { roles, users } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const items = await db.select().from(roles).orderBy(desc(roles.createdAt));

    const itemsWithCounts = await Promise.all(
      items.map(async (role) => {
        const [userCount] = await db
          .select({ count: count() })
          .from(users)
          .where(eq(users.roleId, role.id));

        return {
          ...role,
          userCount: userCount?.count || 0,
        };
      })
    );

    return NextResponse.json(itemsWithCounts);
  } catch (error: any) {
    console.error("GET /api/roles error:", error);
    return NextResponse.json({ message: "Gagal mengambil data roles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();

    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ message: "Nama role wajib diisi" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, name))
      .limit(1);

    if (existing) {
      return NextResponse.json({ message: "Nama role sudah digunakan" }, { status: 400 });
    }

    const [newRole] = await db
      .insert(roles)
      .values({ name, description: description || null })
      .returning();

    return NextResponse.json(
      { message: "Role berhasil dibuat", data: newRole },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/roles error:", error);
    return NextResponse.json({ message: "Gagal membuat role" }, { status: 500 });
  }
}
