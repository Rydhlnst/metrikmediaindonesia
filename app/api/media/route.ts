import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { media } from "@/db/schema/index";
import { sql, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type") || "image";
    const offset = (page - 1) * limit;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(media)
      .where(sql`${media.type} = ${type}`);

    const mediaList = await db
      .select()
      .from(media)
      .where(sql`${media.type} = ${type}`)
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      data: mediaList,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/media error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data media" },
      { status: 500 }
    );
  }
}
