import { describe, it, expect } from "vitest";
import { convertToWebp, getImageMetadata, getWebpMimeType, generateUploadPath } from "@/lib/image-utils";

describe("getWebpMimeType", () => {
  it("returns image/webp", () => {
    expect(getWebpMimeType()).toBe("image/webp");
  });
});

describe("generateUploadPath", () => {
  it("generates path with uploads prefix", () => {
    const path = generateUploadPath("photo.jpg");
    expect(path).toMatch(/^uploads\/\d{4}\/\d{2}\//);
    expect(path).toContain(".webp");
  });

  it("sanitizes special characters in filename", () => {
    const path = generateUploadPath("My Photo (1).jpg");
    expect(path).not.toContain("(");
    expect(path).not.toContain(")");
    expect(path).not.toContain(" ");
  });

  it("generates unique paths", () => {
    const path1 = generateUploadPath("test.jpg");
    const path2 = generateUploadPath("test.jpg");
    expect(path1).not.toBe(path2);
  });
});
