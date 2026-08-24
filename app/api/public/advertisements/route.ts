import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActiveAdvertisements } from "@/lib/advertising";
import { zodError } from "@/lib/api-response";

const querySchema = z.object({
  position: z.enum(["homepage", "article_top", "article_middle", "sidebar", "category", "header", "footer", "inline"]),
  limit: z.coerce.number().int().min(1).max(6).default(1),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return zodError(parsed.error);
  const data = await getActiveAdvertisements(parsed.data.position, parsed.data.limit);
  return NextResponse.json({ data });
}
