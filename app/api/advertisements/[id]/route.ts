import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { advertisements } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import { advertisementSchema } from "@/lib/validators/public";
import { zodError } from "@/lib/api-response";
import { invalidateRedisPattern } from "@/lib/redis";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const adId = Number(id);
    if (!Number.isInteger(adId) || adId <= 0) return NextResponse.json({ message: "Invalid advertisement id" }, { status: 422 });

    const [ad] = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, adId))
      .limit(1);

    if (!ad) {
      return NextResponse.json({ message: "Iklan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error("GET /api/advertisements/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data iklan" }, { status: 500 });
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
    const adId = Number(id);
    if (!Number.isInteger(adId) || adId <= 0) return NextResponse.json({ message: "Invalid advertisement id" }, { status: 422 });
    const parsed = advertisementSchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { title, image, desktopImage, mobileImage, link, position, status, startDate, endDate, advertiserName } = parsed.data;

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
        advertiserName: advertiserName ?? existing.advertiserName,
        image: image !== undefined ? image : existing.image,
        desktopImage: desktopImage !== undefined ? desktopImage : existing.desktopImage,
        mobileImage: mobileImage !== undefined ? mobileImage : existing.mobileImage,
        link: link !== undefined ? link : existing.link,
        position: position ?? existing.position,
        status: status ?? existing.status,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
        updatedAt: new Date(),
      })
      .where(eq(advertisements.id, adId))
      .returning();
    await invalidateRedisPattern("advertisements:*");

    return NextResponse.json({ message: "Iklan berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/advertisements/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui iklan" }, { status: 500 });
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
    const adId = Number(id);
    if (!Number.isInteger(adId) || adId <= 0) return NextResponse.json({ message: "Invalid advertisement id" }, { status: 422 });

    await db.delete(advertisements).where(eq(advertisements.id, adId));
    await invalidateRedisPattern("advertisements:*");

    return NextResponse.json({ message: "Iklan berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/advertisements/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus iklan" }, { status: 500 });
  }
}
