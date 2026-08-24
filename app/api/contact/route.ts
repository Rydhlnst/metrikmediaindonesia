import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { contactMessages } from "@/db/schema/index";
import { requireAdmin } from "@/lib/server-session";
import { contactMessageSchema } from "@/lib/validators/public";
import { enforceRateLimit } from "@/lib/rate-limit";
import { zodError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "contact", 5, 60);
  if (limited) return limited;
  try {
    const parsed = contactMessageSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const db = await getDb();
    await db.insert(contactMessages).values(parsed.data);

    return NextResponse.json({
      message: "Pesan berhasil dikirim. Kami akan menghubungi Anda segera.",
      success: true,
    });
  } catch (error) {
    console.error("[Contact] Error:", error);
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
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(contactMessages.createdAt);
    return NextResponse.json({ data: messages });
  } catch (error) {
    console.error("[Contact] GET error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data pesan" },
      { status: 500 }
    );
  }
}
