import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sensitiveAuthPath = ["/sign-in/", "/sign-up/", "/request-password-reset", "/reset-password"]
    .some((segment) => path.includes(segment));
  if (sensitiveAuthPath) {
    const limited = await enforceRateLimit(request, "auth", 8, 60);
    if (limited) return limited;
  }
  return handlers.POST(request);
}
