import { NextRequest, NextResponse } from "next/server";
import { canManageEditorial, requireAuth, requirePermission } from "@/lib/server-session";
import { PERMISSIONS } from "@/lib/permissions";
import { uploadToMinio } from "@/lib/minio";
import { convertToWebp, getImageMetadata, generateUploadPath, validateUploadedImage } from "@/lib/image-utils";
import { getDb } from "@/db/index";
import { media } from "@/db/schema/index";
import { desc, eq, sql } from "drizzle-orm";
import { imageUploadOptionsSchema, paginationQuerySchema } from "@/lib/validators/public";
import { apiError, zodError } from "@/lib/api-response";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitError = await enforceRateLimit(request, "uploads", 20, 60 * 60);
  if (rateLimitError) return rateLimitError;
  const authGuard = await requirePermission(request, PERMISSIONS.MEDIA_UPLOAD, "Media upload permission required");
  if (authGuard.error) return authGuard.error;
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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return apiError(413, "VALIDATION_ERROR", "Image size must not exceed 5MB");
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    try {
      await validateUploadedImage(buffer, file.name, file.type);
    } catch {
      return apiError(422, "VALIDATION_ERROR", "The uploaded file is not a supported image");
    }

    // Read optional optimization parameters
    const options = imageUploadOptionsSchema.safeParse({
      maxWidth: formData.get("maxWidth") ?? undefined,
      maxHeight: formData.get("maxHeight") ?? undefined,
    });
    if (!options.success) return zodError(options.error);
    const { maxWidth, maxHeight } = options.data;
    // Convert to webp with dimension & quality optimization (Targeting fastest LCP & tiny payload)
    const webpBuffer = await convertToWebp(buffer, { quality: 82, maxWidth, maxHeight, effort: 5 });
    const metadata = await getImageMetadata(webpBuffer);

    // Generate upload path
    const uploadPath = generateUploadPath(file.name);

    const bucket = process.env.MINIO_BUCKET || "metrikmedia";
    let url: string;
    try { url = await uploadToMinio(bucket, uploadPath, webpBuffer, "image/webp"); }
    catch (error) { console.error("MinIO upload failed", error); return apiError(503, "STORAGE_UNAVAILABLE", "Media storage is unavailable"); }

    // Save to database
    let mediaRecordId: number;
    try {
      const [mediaRecord] = await db
        .insert(media)
        .values({
          url,
          type: "image",
          mimeType: "image/webp",
          size: webpBuffer.length,
          width: metadata.width,
          height: metadata.height,
          alt: file.name.replace(/\.[^/.]+$/, ""),
          authUserId: authGuard.user.id,
        })
        .returning();
      if (!mediaRecord) throw new Error("Media record was not created");
      mediaRecordId = mediaRecord.id;
    } catch (error) { console.error("Could not write media record", error); return apiError(500, "INTERNAL_ERROR", "Could not save media record"); }

    return NextResponse.json(
      {
        message: "File berhasil dikonversi ke WebP dan diunggah",
        data: {
          id: mediaRecordId,
          url,
          width: metadata.width,
          height: metadata.height,
          size: webpBuffer.length,
          mimeType: "image/webp",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return apiError(500, "INTERNAL_ERROR", "Could not upload the file");
  }
}

export async function GET(request: NextRequest) {
  const authGuard = await requireAuth(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const pagination = paginationQuerySchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    if (!pagination.success) return zodError(pagination.error);
    const { page, limit } = pagination.data;
    const offset = (page - 1) * limit;

    const mediaList = await db
      .select()
      .from(media)
      .where(canManageEditorial(authGuard.user) ? undefined : eq(media.authUserId, authGuard.user.id))
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(media)
      .where(canManageEditorial(authGuard.user) ? undefined : eq(media.authUserId, authGuard.user.id));

    return NextResponse.json({
      data: mediaList,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/upload error:", error);
    return apiError(500, "INTERNAL_ERROR", "Could not load media");
  }
}
