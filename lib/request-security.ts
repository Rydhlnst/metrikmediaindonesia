import { NextRequest } from "next/server";
import { apiError } from "@/lib/api-response";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function assertSameOrigin(request: NextRequest) {
  if (SAFE_METHODS.has(request.method)) return null;

  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;
  const fetchSite = request.headers.get("sec-fetch-site");

  if (origin && origin !== expectedOrigin) {
    return apiError(403, "FORBIDDEN", "Cross-origin mutation rejected");
  }

  if (fetchSite === "cross-site") {
    return apiError(403, "FORBIDDEN", "Cross-origin mutation rejected");
  }

  return null;
}
