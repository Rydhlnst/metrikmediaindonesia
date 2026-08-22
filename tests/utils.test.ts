import { describe, it, expect } from "vitest";
import { cn, getInitials, getImageUrl } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("px-2", "py-1");
    expect(result).toContain("px-2");
    expect(result).toContain("py-1");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("resolves tailwind conflicts", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });
});

describe("getInitials", () => {
  it("returns first two chars for single word", () => {
    expect(getInitials("Budi")).toBe("BU");
  });

  it("returns first+last initials for multi-word", () => {
    expect(getInitials("Budi Santoso")).toBe("BS");
  });

  it("handles empty string", () => {
    expect(getInitials("")).toBe("?");
  });

  it("trims whitespace", () => {
    expect(getInitials("  Budi  Santoso  ")).toBe("BS");
  });

  it("handles single char", () => {
    expect(getInitials("A")).toBe("A");
  });
});

describe("getImageUrl", () => {
  it("returns placeholder for null/undefined", () => {
    expect(getImageUrl(null)).toBe("/placeholder.png");
    expect(getImageUrl(undefined)).toBe("/placeholder.png");
  });

  it("returns string image directly", () => {
    expect(getImageUrl("https://example.com/img.jpg")).toBe("https://example.com/img.jpg");
  });

  it("returns placeholder for empty string", () => {
    expect(getImageUrl("")).toBe("/placeholder.png");
  });

  it("extracts thumbnail from object", () => {
    const obj = { thumbnail: "https://example.com/thumb.jpg", featuredImage: "https://example.com/feat.jpg" };
    expect(getImageUrl(obj)).toBe("https://example.com/thumb.jpg");
  });

  it("extracts featuredImage if no thumbnail", () => {
    const obj = { featuredImage: "https://example.com/feat.jpg" };
    expect(getImageUrl(obj)).toBe("https://example.com/feat.jpg");
  });

  it("extracts url if no thumbnail or featuredImage", () => {
    const obj = { url: "https://example.com/url.jpg" };
    expect(getImageUrl(obj)).toBe("https://example.com/url.jpg");
  });

  it("returns placeholder for unknown object shape", () => {
    expect(getImageUrl({ foo: "bar" })).toBe("/placeholder.png");
  });
});
