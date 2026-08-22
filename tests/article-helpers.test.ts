import { describe, it, expect } from "vitest";
import {
  getCategorySlug,
  getCategoryName,
  getAuthorName,
  getTimeAgo,
  formatViews,
} from "@/lib/article-helpers";

describe("getCategorySlug", () => {
  it("extracts slug from category object", () => {
    expect(getCategorySlug({ category: { slug: "nasional" } })).toBe("nasional");
  });

  it("returns fallback when category is missing", () => {
    expect(getCategorySlug({})).toBe("berita");
  });

  it("uses custom fallback", () => {
    expect(getCategorySlug({}, "custom")).toBe("custom");
  });
});

describe("getCategoryName", () => {
  it("extracts name from category object", () => {
    expect(getCategoryName({ category: { name: "Nasional" } })).toBe("Nasional");
  });

  it("returns fallback when category is missing", () => {
    expect(getCategoryName({})).toBe("");
  });
});

describe("getAuthorName", () => {
  it("extracts name from author object", () => {
    expect(getAuthorName({ author: { name: "Budi" } })).toBe("Budi");
  });

  it("returns fallback when author is missing", () => {
    expect(getAuthorName({})).toBe("");
  });
});

describe("getTimeAgo", () => {
  it("returns 'baru saja' for very recent dates", () => {
    const now = new Date();
    expect(getTimeAgo(now)).toBe("baru saja");
  });

  it("returns minutes ago", () => {
    const d = new Date(Date.now() - 5 * 60 * 1000);
    expect(getTimeAgo(d)).toBe("5 menit lalu");
  });

  it("returns hours ago", () => {
    const d = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(getTimeAgo(d)).toBe("3 jam lalu");
  });

  it("returns days ago", () => {
    const d = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(getTimeAgo(d)).toBe("2 hari lalu");
  });

  it("handles string input", () => {
    const d = new Date(Date.now() - 60 * 60 * 1000);
    expect(getTimeAgo(d.toISOString())).toBe("1 jam lalu");
  });
});

describe("formatViews", () => {
  it("formats millions", () => {
    expect(formatViews(1500000)).toBe("1.5jt");
  });

  it("formats thousands", () => {
    expect(formatViews(2500)).toBe("2.5k");
  });

  it("returns raw number below 1000", () => {
    expect(formatViews(999)).toBe("999");
  });

  it("handles zero", () => {
    expect(formatViews(0)).toBe("0");
  });
});
