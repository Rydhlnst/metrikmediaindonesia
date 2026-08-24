import { NextRequest, NextResponse } from "next/server";
import { and, eq, gte, isNull, lte, or, sql } from "drizzle-orm";
import { getDb } from "@/db/index";
import { advertisements } from "@/db/schema/index";
import { enforceRateLimit } from "@/lib/rate-limit";

function safeExternalUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await enforceRateLimit(request, "ad-click", 20, 60);
  if (limited) return limited;
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.redirect(new URL("/", request.url));

  const now = new Date();
  const db = await getDb();
  const [ad] = await db
    .select({ id: advertisements.id, link: advertisements.link })
    .from(advertisements)
    .where(and(eq(advertisements.id, id), eq(advertisements.status, "active"), or(isNull(advertisements.startDate), lte(advertisements.startDate, now)), or(isNull(advertisements.endDate), gte(advertisements.endDate, now))))
    .limit(1);
  const target = safeExternalUrl(ad?.link ?? null);
  if (!ad || !target) return NextResponse.redirect(new URL("/", request.url));
  await db.update(advertisements).set({ clicks: sql`${advertisements.clicks} + 1`, updatedAt: now }).where(eq(advertisements.id, ad.id));
  return NextResponse.redirect(target, 302);
}
