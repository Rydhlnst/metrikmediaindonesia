import { NextRequest, NextResponse } from "next/server";
import { uploadToMinio, ensureBucketExists } from "@/lib/minio";
import { convertToWebp, getImageMetadata, generateUploadPath } from "@/lib/image-utils";
import { getDb } from "@/db/index";
import { media } from "@/db/schema/index";
import { desc, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "Ukuran file terlalu besar. Maksimal 5MB" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Read optional optimization parameters
    const maxWidth = formData.get("maxWidth") ? parseInt(formData.get("maxWidth") as string) : 1920;
    const maxHeight = formData.get("maxHeight") ? parseInt(formData.get("maxHeight") as string) : 1080;
    const quality = formData.get("quality") ? parseInt(formData.get("quality") as string) : 80;

    // Convert to webp with dimension & quality optimization
    const webpBuffer = await convertToWebp(buffer, { quality, maxWidth, maxHeight });
    const metadata = await getImageMetadata(webpBuffer);

    // Generate upload path
    const uploadPath = generateUploadPath(file.name);

    // Upload to MinIO
    const bucket = process.env.MINIO_BUCKET || "metrikmedia";
    const url = await uploadToMinio(bucket, uploadPath, webpBuffer, "image/webp");

    // Save to database
    const [mediaRecord] = await db
      .insert(media)
      .values({
        url,
        type: "image",
        mimeType: "image/webp",
        size: webpBuffer.length,
        width: metadata.width,
        height: metadata.height,
        alt: file.name,
      })
      .returning();

    return NextResponse.json(
      {
        message: "File berhasil diunggah",
        data: {
          id: mediaRecord.id,
          url,
          width: metadata.width,
          height: metadata.height,
          size: webpBuffer.length,
          mimeType: "image/webp",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { message: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const mediaList = await db
      .select()
      .from(media)
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db.select({ count: sql<number>`count(*)::int` }).from(media);

    return NextResponse.json({
      data: mediaList,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/upload error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data media" },
      { status: 500 }
    );
  }
}
