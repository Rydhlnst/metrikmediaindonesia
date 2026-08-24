import { NextRequest, NextResponse } from "next/server";
import { and, eq, gte, isNull, lte, or, sql } from "drizzle-orm";
import { getDb } from "@/db/index";
import { advertisements } from "@/db/schema/index";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await enforceRateLimit(request, "ad-impression", 30, 60);
  if (limited) return limited;
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ message: "Invalid advertisement id" }, { status: 400 });
  const now = new Date();
  const db = await getDb();
  await db
    .update(advertisements)
    .set({ impressions: sql`${advertisements.impressions} + 1`, updatedAt: now })
    .where(and(
      eq(advertisements.id, id),
      eq(advertisements.status, "active"),
      or(isNull(advertisements.startDate), lte(advertisements.startDate, now)),
      or(isNull(advertisements.endDate), gte(advertisements.endDate, now)),
    ));
  return new NextResponse(null, { status: 204 });
}
