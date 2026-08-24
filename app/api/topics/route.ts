import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { topics, articleTopics } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";
import { topicSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [topic] = await db
        .select()
        .from(topics)
        .where(eq(topics.slug, slug))
        .limit(1);

      if (!topic) {
        return NextResponse.json({ message: "Topik tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(topic);
    }

    const items = await db
      .select({
        id: topics.id,
        name: topics.name,
        slug: topics.slug,
        description: topics.description,
        seoTitle: topics.seoTitle,
        seoDescription: topics.seoDescription,
        createdAt: topics.createdAt,
        articleCount: count(articleTopics.articleId),
      })
      .from(topics)
      .leftJoin(articleTopics, eq(articleTopics.topicId, topics.id))
      .groupBy(topics.id)
      .orderBy(desc(topics.createdAt));

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/topics error:", error);
    return NextResponse.json({ message: "Gagal mengambil data topik" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = topicSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug, description, seoTitle, seoDescription, cover, isActive } = parsed.data;

    const [existing] = await db
      .select()
      .from(topics)
      .where(eq(topics.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { message: "Slug topik sudah digunakan" },
        { status: 400 }
      );
    }

    const [newTopic] = await db
      .insert(topics)
      .values({
        name,
        slug,
        description: description || null,
        cover: cover || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isActive: isActive ?? true,
      })
      .returning();

    return NextResponse.json(
      { message: "Topik berhasil dibuat", data: newTopic },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/topics error:", error);
    return NextResponse.json({ message: "Gagal membuat topik" }, { status: 500 });
  }
}
