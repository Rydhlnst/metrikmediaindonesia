import { describe, it, expect } from "vitest";
import { apiError, zodError } from "@/lib/api-response";
import { z } from "zod";

describe("apiError", () => {
  it("returns JSON response with correct status", async () => {
    const response = apiError(404, "NOT_FOUND", "Resource not found");
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe("NOT_FOUND");
    expect(body.error.message).toBe("Resource not found");
  });

  it("includes fields when provided", async () => {
    const response = apiError(422, "VALIDATION_ERROR", "Invalid", { name: ["Required"] });
    const body = await response.json();
    expect(body.error.fields.name).toEqual(["Required"]);
  });
});

describe("zodError", () => {
  it("returns 422 with field errors", async () => {
    const schema = z.object({ name: z.string().min(1) });
    const result = schema.safeParse({});
    if (!result.success) {
      const response = zodError(result.error);
      expect(response.status).toBe(422);
      const body = await response.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
    }
  });
});
