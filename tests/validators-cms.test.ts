import { describe, it, expect } from "vitest";
import {
  categorySchema,
  tagSchema,
  topicSchema,
  locationSchema,
  entitySchema,
  authorSchema,
  pageSchema,
  roleSchema,
  commentCreateSchema,
  settingsSchema,
  slugSchema,
  positiveIdSchema,
  mediaCreateSchema,
  mediaUpdateSchema,
  mediaQuerySchema,
} from "@/lib/validators/cms";

describe("slugSchema", () => {
  it("accepts valid slugs", () => {
    expect(slugSchema.safeParse("hello-world").success).toBe(true);
    expect(slugSchema.safeParse("berita-2026").success).toBe(true);
  });

  it("rejects slugs with uppercase", () => {
    expect(slugSchema.safeParse("Hello-World").success).toBe(false);
  });

  it("rejects slugs with spaces", () => {
    expect(slugSchema.safeParse("hello world").success).toBe(false);
  });

  it("rejects empty slugs", () => {
    expect(slugSchema.safeParse("").success).toBe(false);
  });
});

describe("positiveIdSchema", () => {
  it("accepts positive integers", () => {
    expect(positiveIdSchema.safeParse(1).success).toBe(true);
    expect(positiveIdSchema.safeParse("42").success).toBe(true);
  });

  it("rejects zero and negatives", () => {
    expect(positiveIdSchema.safeParse(0).success).toBe(false);
    expect(positiveIdSchema.safeParse(-1).success).toBe(false);
  });
});

describe("categorySchema", () => {
  it("accepts valid category", () => {
    const result = categorySchema.safeParse({ name: "Nasional", slug: "nasional" });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = categorySchema.safeParse({ slug: "test" });
    expect(result.success).toBe(false);
  });
});

describe("tagSchema", () => {
  it("accepts valid tag", () => {
    expect(tagSchema.safeParse({ name: "Politik", slug: "politik" }).success).toBe(true);
  });
});

describe("topicSchema", () => {
  it("accepts valid topic", () => {
    expect(topicSchema.safeParse({ name: "Energi", slug: "energi" }).success).toBe(true);
  });
});

describe("locationSchema", () => {
  it("accepts valid location with level", () => {
    expect(locationSchema.safeParse({ name: "Jakarta", slug: "jakarta", level: "city" }).success).toBe(true);
  });

  it("rejects invalid level", () => {
    expect(locationSchema.safeParse({ name: "Jakarta", slug: "jakarta", level: "invalid" }).success).toBe(false);
  });
});

describe("entitySchema", () => {
  it("accepts valid entity", () => {
    expect(entitySchema.safeParse({ name: "Jokowi", slug: "jokowi", type: "person" }).success).toBe(true);
  });
});

describe("authorSchema", () => {
  it("accepts valid author", () => {
    expect(authorSchema.safeParse({ name: "Budi", slug: "budi" }).success).toBe(true);
  });
});

describe("pageSchema", () => {
  it("accepts valid page", () => {
    expect(pageSchema.safeParse({ title: "About Us", slug: "about-us" }).success).toBe(true);
  });
});

describe("roleSchema", () => {
  it("accepts valid role", () => {
    expect(roleSchema.safeParse({ name: "editor" }).success).toBe(true);
  });
});

describe("commentCreateSchema", () => {
  it("accepts valid comment", () => {
    expect(commentCreateSchema.safeParse({ articleId: 1, content: "Great article!" }).success).toBe(true);
  });
});

describe("settingsSchema", () => {
  it("accepts non-empty record", () => {
    expect(settingsSchema.safeParse({ siteName: "Test" }).success).toBe(true);
  });

  it("rejects empty record", () => {
    expect(settingsSchema.safeParse({}).success).toBe(false);
  });
});

describe("media schemas", () => {
  it("accepts validated media metadata", () => {
    const result = mediaCreateSchema.safeParse({
      url: "/storage/uploads/article.webp",
      type: "image",
      size: 1024,
      width: 640,
      height: 360,
      alt: "Article cover",
    });
    expect(result.success).toBe(true);
  });

  it("rejects unsupported media types and oversized files", () => {
    expect(mediaCreateSchema.safeParse({ url: "/file.bin", type: "script" }).success).toBe(false);
    expect(mediaCreateSchema.safeParse({ url: "/file.bin", size: 101 * 1024 * 1024 }).success).toBe(false);
  });

  it("requires a valid paginated media query", () => {
    expect(mediaQuerySchema.safeParse({ page: "2", limit: "50", type: "video" }).success).toBe(true);
    expect(mediaQuerySchema.safeParse({ page: "0" }).success).toBe(false);
  });

  it("requires at least one editable media field", () => {
    expect(mediaUpdateSchema.safeParse({ alt: "Updated alt" }).success).toBe(true);
    expect(mediaUpdateSchema.safeParse({}).success).toBe(false);
  });
});
