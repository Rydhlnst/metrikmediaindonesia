import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { settings } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import { settingsSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const items = await db.select().from(settings);

    // Convert array of key-value records to object
    const settingsObject: Record<string, string | null> = {};
    items.forEach((item) => {
      settingsObject[item.key] = item.value;
    });

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ message: "Gagal mengambil pengaturan" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = settingsSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const body = parsed.data;

    const entries = Object.entries(body);

    for (const [key, value] of entries) {
      const [existing] = await db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .limit(1);

      if (existing) {
        await db
          .update(settings)
          .set({ value: String(value), updatedAt: new Date() })
          .where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({
          key,
          value: String(value),
        });
      }
    }

    return NextResponse.json({ message: "Pengaturan berhasil disimpan" });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ message: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
}
