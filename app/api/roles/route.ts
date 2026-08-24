import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { roles, user as authUsers } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";
import { roleSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const items = await db.select().from(roles).orderBy(desc(roles.createdAt));

    const itemsWithCounts = await Promise.all(
      items.map(async (role) => {
        const [userCount] = await db
          .select({ count: count() })
          .from(authUsers)
          .where(eq(authUsers.roleId, role.id));

        return {
          ...role,
          userCount: userCount?.count || 0,
        };
      })
    );

    return NextResponse.json(itemsWithCounts);
  } catch (error) {
    console.error("GET /api/roles error:", error);
    return NextResponse.json({ message: "Gagal mengambil data roles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = roleSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, description } = parsed.data;

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
  } catch (error) {
    console.error("POST /api/roles error:", error);
    return NextResponse.json({ message: "Gagal membuat role" }, { status: 500 });
  }
}
