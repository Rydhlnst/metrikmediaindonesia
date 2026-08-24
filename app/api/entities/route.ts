import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { entities, articleEntities } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";
import { entitySchema, entityTypeSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const typeParam = searchParams.get("type");
    const parsedType = typeParam ? entityTypeSchema.safeParse(typeParam) : null;
    if (parsedType && !parsedType.success) return zodError(parsedType.error);
    const type = parsedType?.data;

    if (slug) {
      const [entity] = await db
        .select()
        .from(entities)
        .where(eq(entities.slug, slug))
        .limit(1);

      if (!entity) {
        return NextResponse.json({ message: "Entitas tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(entity);
    }

    const items = await db
      .select({
        id: entities.id,
        type: entities.type,
        name: entities.name,
        slug: entities.slug,
        avatarOrLogo: entities.avatarOrLogo,
        bioOrDesc: entities.bioOrDesc,
        metadata: entities.metadata,
        createdAt: entities.createdAt,
        articleCount: count(articleEntities.articleId),
      })
      .from(entities)
      .leftJoin(articleEntities, eq(articleEntities.entityId, entities.id))
      .where(type ? eq(entities.type, type) : undefined)
      .groupBy(entities.id)
      .orderBy(desc(entities.createdAt));

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/entities error:", error);
    return NextResponse.json({ message: "Gagal mengambil data entitas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = entitySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { type, name, slug, avatarOrLogo, bioOrDesc, metadata, isActive } = parsed.data;

    const [existing] = await db
      .select()
      .from(entities)
      .where(eq(entities.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { message: "Slug entitas sudah digunakan" },
        { status: 400 }
      );
    }

    const [newEntity] = await db
      .insert(entities)
      .values({
        type,
        name,
        slug,
        avatarOrLogo: avatarOrLogo || null,
        bioOrDesc: bioOrDesc || null,
        metadata: metadata || null,
        isActive: isActive ?? true,
      })
      .returning();

    return NextResponse.json(
      { message: "Entitas berhasil dibuat", data: newEntity },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/entities error:", error);
    return NextResponse.json({ message: "Gagal membuat entitas" }, { status: 500 });
  }
}
