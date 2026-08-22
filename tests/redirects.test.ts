import { describe, it, expect } from "vitest";
import { isSafeRedirectPath } from "@/lib/redirects";

describe("isSafeRedirectPath", () => {
  it("accepts valid relative paths", () => {
    expect(isSafeRedirectPath("/category/nasional")).toBe(true);
    expect(isSafeRedirectPath("/")).toBe(true);
  });

  it("rejects protocol-relative URLs", () => {
    expect(isSafeRedirectPath("//evil.com")).toBe(false);
  });

  it("rejects paths with backslashes", () => {
    expect(isSafeRedirectPath("/foo\\bar")).toBe(false);
  });

  it("rejects empty strings", () => {
    expect(isSafeRedirectPath("")).toBe(false);
  });

  it("rejects absolute URLs", () => {
    expect(isSafeRedirectPath("https://evil.com")).toBe(false);
  });
});
