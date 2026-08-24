import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { advertisements } from "@/db/schema/index";
import { desc, eq } from "drizzle-orm";
import { advertisementSchema } from "@/lib/validators/public";
import { zodError } from "@/lib/api-response";
import { invalidateRedisPattern } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
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
  } catch (error) {
    console.error("GET /api/advertisements error:", error);
    return NextResponse.json({ message: "Gagal mengambil data iklan" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = advertisementSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { title, image, desktopImage, mobileImage, link, position, status, startDate, endDate, advertiserName } = parsed.data;

    const [newAd] = await db
      .insert(advertisements)
      .values({
        title,
        advertiserName,
        image: image || null,
        desktopImage: desktopImage || image || null,
        mobileImage: mobileImage || image || null,
        link: link || null,
        position,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      })
      .returning();
    await invalidateRedisPattern("advertisements:*");

    return NextResponse.json(
      { message: "Iklan berhasil ditambahkan", data: newAd },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/advertisements error:", error);
    return NextResponse.json({ message: "Gagal menambahkan iklan" }, { status: 500 });
  }
}
