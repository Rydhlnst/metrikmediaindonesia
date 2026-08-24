"use client";

import { toast } from "sonner";

type ErrorPayload = { message?: string; error?: { code?: string; message?: string; fields?: Record<string, string[]> } };

export class ApiClientError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string, public readonly fields?: Record<string, string[]>) { super(message); }
}

export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json().catch(() => null) as ErrorPayload | T | null;
  if (response.ok) return payload as T;
  const error = payload as ErrorPayload | null;
  throw new ApiClientError(response.status, error?.error?.code || "REQUEST_FAILED", error?.error?.message || error?.message || "Request failed. Please try again.", error?.error?.fields);
}

export function toastApiError(error: unknown) {
  if (error instanceof ApiClientError) {
    const fieldMessage = error.fields ? Object.values(error.fields).flat()[0] : undefined;
    const title = error.status === 401 ? "Sign in required" : error.status === 403 ? "Access denied" : error.status === 429 ? "Too many requests" : error.status >= 500 ? "Service unavailable" : "Please review your input";
    toast.error(title, { description: fieldMessage || error.message });
    return;
  }
  toast.error("Unexpected error", { description: "Please try again." });
}
