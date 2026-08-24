import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export type ApiErrorCode = "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "RATE_LIMITED" | "RATE_LIMIT_UNAVAILABLE" | "STORAGE_UNAVAILABLE" | "INTERNAL_ERROR";

export function apiError(status: number, code: ApiErrorCode, message: string, fields?: Record<string, string[]>) {
  return NextResponse.json({ error: { code, message, fields } }, { status });
}

export function zodError(error: ZodError) {
  return apiError(422, "VALIDATION_ERROR", "Please correct the highlighted fields.", error.flatten().fieldErrors);
}
