import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { getDb } from "@/db/index";
import { permissions } from "@/db/schema/index";
import { requireAdmin } from "@/lib/server-session";
import { apiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request);
  if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    return NextResponse.json({ data: await db.select().from(permissions).orderBy(asc(permissions.key)) });
  } catch (error) {
    console.error("GET /api/permissions error", error);
    return apiError(500, "INTERNAL_ERROR", "Could not load permissions");
  }
}
