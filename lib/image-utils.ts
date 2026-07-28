import sharp from "sharp";

export async function convertToWebp(
  buffer: Buffer,
  quality: number = 80
): Promise<Buffer> {
  return sharp(buffer).webp({ quality }).toBuffer();
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
