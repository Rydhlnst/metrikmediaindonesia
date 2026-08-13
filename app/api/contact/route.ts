import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { contactMessages } from "@/db/schema/index";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
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
      await db.insert(contactMessages).values({
        name,
        email,
        subject,
        message,
      });
    } catch (dbError) {
      console.error("[Contact] DB error:", dbError);
    }

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

export async function GET() {
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
