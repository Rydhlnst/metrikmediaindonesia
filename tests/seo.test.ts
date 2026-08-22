import { describe, it, expect } from "vitest";
import {
  generateMetadata,
  generateNewsArticleSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from "@/lib/seo";

describe("generateMetadata", () => {
  it("returns default title when no title provided", () => {
    const meta = generateMetadata({});
    expect(meta.title).toContain("Metrik Media Indonesia");
  });

  it("prepends title to site name", () => {
    const meta = generateMetadata({ title: "Test Article" });
    expect(meta.title).toBe("Test Article - Metrik Media Indonesia");
  });

  it("uses provided description", () => {
    const meta = generateMetadata({ description: "Custom desc" });
    expect(meta.description).toBe("Custom desc");
  });

  it("sets noindex robots when flagged", () => {
    const meta = generateMetadata({ noindex: true });
    expect(meta.robots?.index).toBe(false);
    expect(meta.robots?.follow).toBe(false);
  });

  it("sets article OG type with timestamps", () => {
    const meta = generateMetadata({
      ogType: "article",
      publishedTime: "2026-01-01",
      modifiedTime: "2026-01-02",
      authors: ["Author Name"],
    });
    expect(meta.openGraph?.type).toBe("article");
  });
});

describe("generateNewsArticleSchema", () => {
  it("returns valid NewsArticle schema", () => {
    const schema = generateNewsArticleSchema({
      headline: "Test Headline",
      description: "Test desc",
      url: "https://example.com/article",
      datePublished: "2026-01-01",
      authorName: "Budi",
    });
    expect(schema["@type"]).toBe("NewsArticle");
    expect(schema.headline).toBe("Test Headline");
    expect(schema.author.name).toBe("Budi");
    expect(schema.publisher["@type"]).toBe("NewsMediaOrganization");
  });

  it("uses default image when none provided", () => {
    const schema = generateNewsArticleSchema({
      headline: "Test",
      description: "Desc",
      url: "https://example.com",
      datePublished: "2026-01-01",
      authorName: "Author",
    });
    expect(schema.image).toBeDefined();
  });
});

describe("generateBreadcrumbSchema", () => {
  it("returns BreadcrumbList with correct positions", () => {
    const schema = generateBreadcrumbSchema([
      { name: "Home", url: "https://example.com" },
      { name: "Category", url: "https://example.com/cat" },
    ]);
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
  });
});

describe("generateOrganizationSchema", () => {
  it("returns NewsMediaOrganization schema", () => {
    const schema = generateOrganizationSchema();
    expect(schema["@type"]).toBe("NewsMediaOrganization");
    expect(schema.name).toBe("Metrik Media Indonesia");
    expect(schema.sameAs).toBeInstanceOf(Array);
    expect(schema.sameAs.length).toBeGreaterThan(0);
  });
});
