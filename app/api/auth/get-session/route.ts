import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/server-session";

export async function GET(request: NextRequest) {
  const user = await getSessionFromRequest(request);
  return NextResponse.json({ user, session: user ? { userId: user.id } : null });
}
