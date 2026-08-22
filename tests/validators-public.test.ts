import { describe, it, expect } from "vitest";
import {
  contactMessageSchema,
  newsletterSchema,
  businessPublicationSchema,
  advertisementSchema,
  redirectSchema,
  userCreateSchema,
  paginationQuerySchema,
  milestoneQuerySchema,
} from "@/lib/validators/public";

describe("contactMessageSchema", () => {
  it("accepts valid contact message", () => {
    expect(contactMessageSchema.safeParse({
      name: "Budi",
      email: "budi@test.com",
      subject: "Hello there",
      message: "This is a test message with enough length",
    }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(contactMessageSchema.safeParse({
      name: "Budi",
      email: "not-email",
      subject: "Hello",
      message: "Test message body here",
    }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts valid email", () => {
    expect(newsletterSchema.safeParse({ email: "test@test.com" }).success).toBe(true);
  });

  it("has default source", () => {
    const result = newsletterSchema.safeParse({ email: "test@test.com" });
    if (result.success) {
      expect(result.data.source).toBe("footer");
    }
  });
});

describe("businessPublicationSchema", () => {
  it("accepts valid submission", () => {
    expect(businessPublicationSchema.safeParse({
      companyName: "PT Test",
      contactName: "Budi",
      contactEmail: "budi@test.com",
      contactPhone: "08123456789",
      articleTitle: "Test Article Title Here",
      articleContent: "A".repeat(50),
    }).success).toBe(true);
  });
});

describe("advertisementSchema", () => {
  it("accepts valid ad", () => {
    expect(advertisementSchema.safeParse({
      title: "Test Ad",
      position: "header",
    }).success).toBe(true);
  });

  it("rejects invalid position", () => {
    expect(advertisementSchema.safeParse({
      title: "Test Ad",
      position: "invalid",
    }).success).toBe(false);
  });
});

describe("redirectSchema", () => {
  it("accepts valid redirect", () => {
    expect(redirectSchema.safeParse({
      oldUrl: "/old-page",
      newUrl: "/new-page",
    }).success).toBe(true);
  });

  it("rejects oldUrl not starting with /", () => {
    expect(redirectSchema.safeParse({
      oldUrl: "old-page",
      newUrl: "/new-page",
    }).success).toBe(false);
  });
});

describe("userCreateSchema", () => {
  it("accepts valid user", () => {
    expect(userCreateSchema.safeParse({
      name: "Budi",
      email: "budi@test.com",
      password: "securepass123",
    }).success).toBe(true);
  });

  it("rejects short password", () => {
    expect(userCreateSchema.safeParse({
      name: "Budi",
      email: "budi@test.com",
      password: "123",
    }).success).toBe(false);
  });
});

describe("paginationQuerySchema", () => {
  it("has defaults", () => {
    const result = paginationQuerySchema.safeParse({});
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });
});

describe("milestoneQuerySchema", () => {
  it("parses preview as boolean", () => {
    const result = milestoneQuerySchema.safeParse({ preview: "true" });
    if (result.success) {
      expect(result.data.preview).toBe(true);
    }
  });
});
