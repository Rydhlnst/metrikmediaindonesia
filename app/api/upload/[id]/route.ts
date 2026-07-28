import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { media } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import { deleteFromMinio } from "@/lib/minio";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;

    // Find media record
    const [existing] = await db
      .select()
      .from(media)
      .where(eq(media.id, parseInt(id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { message: "Media tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete from MinIO
    try {
      const bucket = process.env.MINIO_BUCKET || "metrikmedia";
      // Extract key from URL
      const urlParts = new URL(existing.url);
      const key = urlParts.pathname.slice(1); // Remove leading slash
      await deleteFromMinio(bucket, key);
    } catch (minioError) {
      console.error("MinIO delete error:", minioError);
      // Continue even if MinIO delete fails
    }

    // Delete from database
    await db.delete(media).where(eq(media.id, parseInt(id)));

    return NextResponse.json({ message: "Media berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE /api/upload/[id] error:", error);
    return NextResponse.json(
      { message: "Gagal menghapus media" },
      { status: 500 }
    );
  }
}
