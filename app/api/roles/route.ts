import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { roles } from "@/db/schema/index";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const db = await getDb();

    const roleList = await db
      .select()
      .from(roles)
      .orderBy(desc(roles.id));

    return NextResponse.json({ data: roleList });
  } catch (error: any) {
    console.error("GET /api/roles error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data role" },
      { status: 500 }
    );
  }
}
