import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { newsletterSubscribers } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/server-session";
import { newsletterSchema } from "@/lib/validators/public";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "newsletter", 5, 60);
  if (limited) return limited;
  try {
    const parsed = newsletterSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ message: "Invalid email address" }, { status: 422 });
    const { email, source } = parsed.data;
    const db = await getDb();
    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email.toLowerCase()))
      .limit(1);

    if (existing) {
      if (!existing.isActive) {
        await db
          .update(newsletterSubscribers)
          .set({ isActive: true })
          .where(eq(newsletterSubscribers.id, existing.id));
      }
      return NextResponse.json({
        message: "Anda sudah terdaftar dalam newsletter kami",
        success: true,
      });
    }

    await db.insert(newsletterSubscribers).values({
      email: email.toLowerCase(),
      source,
    });

    return NextResponse.json({
      message: "Berhasil berlangganan newsletter",
      success: true,
    });
  } catch (error) {
    console.error("[Newsletter] Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request);
  if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(newsletterSubscribers.createdAt);
    return NextResponse.json({ data: subscribers });
  } catch (error) {
    console.error("[Newsletter] GET error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data subscriber" },
      { status: 500 }
    );
  }
}
