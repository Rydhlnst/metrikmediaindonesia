import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { newsletterSubscribers } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = "footer" } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email diperlukan" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Format email tidak valid" },
        { status: 400 }
      );
    }

    try {
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
    } catch (dbError) {
      console.error("[Newsletter] DB error:", dbError);
      return NextResponse.json({
        message: "Berhasil berlangganan newsletter",
        success: true,
      });
    }
  } catch (error) {
    console.error("[Newsletter] Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET() {
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
