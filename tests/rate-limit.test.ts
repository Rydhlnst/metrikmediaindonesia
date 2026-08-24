import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

// Mock Redis - we test the local fallback path
// The redis.ts returns null when NODE_ENV=test

describe("rateLimit", () => {
  it("allows requests within limit", async () => {
    const mockRequest = new NextRequest("http://localhost/test", { headers: { "x-forwarded-for": "127.0.0.1" } });

    const result = await rateLimit(mockRequest, "test-scope", 5, 60);
    expect(result.allowed).toBe(true);
  });

  it("returns retryAfter value", async () => {
    const mockRequest = new NextRequest("http://localhost/test", { headers: { "x-forwarded-for": "127.0.0.1" } });

    const result = await rateLimit(mockRequest, "test-scope-2", 10, 60);
    expect(result.retryAfter).toBeGreaterThan(0);
  });
});
