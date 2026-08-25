import { describe, expect, it } from "vitest";
import { getAdminSeedConfig } from "@/db/admin-seed-config";

describe("getAdminSeedConfig", () => {
  it("normalizes a valid admin configuration", () => {
    expect(getAdminSeedConfig({ ADMIN_EMAIL: " Admin@metrikmedia.test ", ADMIN_PASSWORD: "strong-password-123" })).toEqual({
      email: "admin@metrikmedia.test",
      password: "strong-password-123",
    });
  });

  it("rejects missing credentials", () => {
    expect(() => getAdminSeedConfig({})).toThrow("ADMIN_EMAIL is required");
    expect(() => getAdminSeedConfig({ ADMIN_EMAIL: "admin@metrikmedia.test" })).toThrow("ADMIN_PASSWORD is required");
  });

  it("rejects invalid or weak credentials", () => {
    expect(() => getAdminSeedConfig({ ADMIN_EMAIL: "not-an-email", ADMIN_PASSWORD: "strong-password-123" })).toThrow("valid email");
    expect(() => getAdminSeedConfig({ ADMIN_EMAIL: "admin@metrikmedia.test", ADMIN_PASSWORD: "short" })).toThrow("at least 12");
  });
});
