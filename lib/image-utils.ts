import sharp from "sharp";
import { randomUUID } from "node:crypto";

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

const IMAGE_SIGNATURES = {
  jpeg: (buffer: Buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  png: (buffer: Buffer) => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  webp: (buffer: Buffer) => buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP",
} as const;

export async function validateUploadedImage(
  buffer: Buffer,
  originalName: string,
  declaredMimeType: string
) {
  const extension = originalName.split(".").pop()?.toLowerCase();
  const extensionToFormat = { jpg: "jpeg", jpeg: "jpeg", png: "png", webp: "webp" } as const;
  const expectedFormat = extension ? extensionToFormat[extension as keyof typeof extensionToFormat] : undefined;
  if (!expectedFormat || !IMAGE_SIGNATURES[expectedFormat](buffer)) {
    throw new Error("Invalid image signature or extension");
  }

  const expectedMime = expectedFormat === "jpeg" ? "image/jpeg" : `image/${expectedFormat}`;
  if (!declaredMimeType || declaredMimeType !== expectedMime) {
    throw new Error("Image MIME type does not match its extension");
  }

  const metadata = await sharp(buffer).metadata();
  if (metadata.format !== expectedFormat || !metadata.width || !metadata.height) {
    throw new Error("Invalid image metadata");
  }
  if (metadata.width > 12000 || metadata.height > 12000 || metadata.width * metadata.height > 40_000_000) {
    throw new Error("Image dimensions are too large");
  }
  return { width: metadata.width, height: metadata.height, format: metadata.format };
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
  const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
  const nameWithoutExt = baseName.replace(/\.[^.]+$/, "");
  return `uploads/${year}/${month}/${nameWithoutExt}-${uniqueSuffix}.${ext}`;
}
