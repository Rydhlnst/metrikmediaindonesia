import { describe, it, expect } from "vitest";
import { SITE_CONFIG, NAVIGATION, CATEGORIES } from "@/lib/constants";

describe("SITE_CONFIG", () => {
  it("has required fields", () => {
    expect(SITE_CONFIG.name).toBe("Metrik Media Indonesia");
    expect(SITE_CONFIG.url).toBeDefined();
    expect(SITE_CONFIG.description).toBeDefined();
    expect(SITE_CONFIG.company).toBeDefined();
  });

  it("has twitter handle", () => {
    expect(SITE_CONFIG.twitterHandle).toMatch(/^@/);
  });
});

describe("NAVIGATION", () => {
  it("has main nav items", () => {
    expect(NAVIGATION.main.length).toBeGreaterThan(0);
    expect(NAVIGATION.main[0].href).toBe("/");
  });

  it("has footer sections", () => {
    expect(NAVIGATION.footer.berita.length).toBeGreaterThan(0);
    expect(NAVIGATION.footer.perusahaan.length).toBeGreaterThan(0);
    expect(NAVIGATION.footer.layanan.length).toBeGreaterThan(0);
  });

  it("has social links", () => {
    expect(NAVIGATION.social.length).toBeGreaterThan(0);
    NAVIGATION.social.forEach((s) => {
      expect(s.href).toMatch(/^https:\/\//);
    });
  });
});

describe("CATEGORIES", () => {
  it("has 9 default categories", () => {
    expect(CATEGORIES).toHaveLength(9);
    expect(CATEGORIES.some((category) => category.slug === "pendidikan")).toBe(true);
  });

  it("all have required fields", () => {
    CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
      expect(cat.slug).toBeDefined();
      expect(cat.color).toMatch(/^#/);
    });
  });
});
