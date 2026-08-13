import sharp from "sharp";

export interface OptimizeImageOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  effort?: number;
}

export async function convertToWebp(
  buffer: Buffer,
  options: OptimizeImageOptions = {}
): Promise<Buffer> {
  const {
    quality = 80,
    maxWidth = 1920,
    maxHeight = 1080,
    effort = 6,
  } = options;

  let pipeline = sharp(buffer);

  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  return pipeline
    .webp({
      quality,
      effort,
    })
    .toBuffer();
}

export async function getImageMetadata(
  buffer: Buffer
): Promise<{ width: number; height: number; mimeType: string }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    mimeType: metadata.format || "unknown",
  };
}

export function getWebpMimeType(): string {
  return "image/webp";
}

export function generateUploadPath(originalName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ext = "webp";
  const baseName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const nameWithoutExt = baseName.replace(/\.[^.]+$/, "");
  return `uploads/${year}/${month}/${nameWithoutExt}-${uniqueSuffix}.${ext}`;
}
