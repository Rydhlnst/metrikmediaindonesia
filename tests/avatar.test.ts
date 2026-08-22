import { describe, it, expect } from "vitest";
import { generateAvatarUrl } from "@/lib/avatar";

describe("generateAvatarUrl", () => {
  it("generates URL with seed", () => {
    const url = generateAvatarUrl("Budi Santoso");
    expect(url).toContain("/api/avatar?seed=");
    expect(url).toContain("Budi%20Santoso");
  });

  it("uses default size 128", () => {
    const url = generateAvatarUrl("test");
    expect(url).toContain("size=128");
  });

  it("accepts custom size", () => {
    const url = generateAvatarUrl("test", "initials", 256);
    expect(url).toContain("size=256");
  });

  it("encodes special characters", () => {
    const url = generateAvatarUrl("Budi & Co.");
    expect(url).toContain("Budi%20%26%20Co.");
  });
});
