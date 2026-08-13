import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { advertisements } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const adId = parseInt(id);

    const [ad] = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, adId))
      .limit(1);

    if (!ad) {
      return NextResponse.json({ message: "Iklan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error: any) {
    console.error("GET /api/advertisements/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data iklan" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const adId = parseInt(id);
    const body = await request.json();

    const { title, image, link, position, status, startDate, endDate } = body;

    const [existing] = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, adId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Iklan tidak ditemukan" }, { status: 404 });
    }

    const [updated] = await db
      .update(advertisements)
      .set({
        title: title ?? existing.title,
        image: image !== undefined ? image : existing.image,
        link: link !== undefined ? link : existing.link,
        position: position ?? existing.position,
        status: status ?? existing.status,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
        updatedAt: new Date(),
      })
      .where(eq(advertisements.id, adId))
      .returning();

    return NextResponse.json({ message: "Iklan berhasil diperbarui", data: updated });
  } catch (error: any) {
    console.error("PUT /api/advertisements/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui iklan" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const adId = parseInt(id);

    await db.delete(advertisements).where(eq(advertisements.id, adId));

    return NextResponse.json({ message: "Iklan berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE /api/advertisements/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus iklan" }, { status: 500 });
  }
}
