import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/db/index";
import { users } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, avatar } = body;

    const db = await getDb();
    const updates: Record<string, any> = {};

    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data yang diperbarui" },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set(updates)
      .where(eq(users.id, Number(session.user.id)));

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      data: { ...session.user, ...updates },
    });
  } catch (error: any) {
    console.error("POST /api/auth/update-user error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
