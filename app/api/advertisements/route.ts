import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { advertisements } from "@/db/schema/index";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");

    const whereClause = position ? eq(advertisements.position, position) : undefined;

    const items = await db
      .select()
      .from(advertisements)
      .where(whereClause)
      .orderBy(desc(advertisements.createdAt));

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET /api/advertisements error:", error);
    return NextResponse.json({ message: "Gagal mengambil data iklan" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();

    const { title, image, link, position = "header", status = "active", startDate, endDate } = body;

    if (!title) {
      return NextResponse.json({ message: "Judul iklan wajib diisi" }, { status: 400 });
    }

    const [newAd] = await db
      .insert(advertisements)
      .values({
        title,
        image: image || null,
        link: link || null,
        position,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      })
      .returning();

    return NextResponse.json(
      { message: "Iklan berhasil ditambahkan", data: newAd },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/advertisements error:", error);
    return NextResponse.json({ message: "Gagal menambahkan iklan" }, { status: 500 });
  }
}
