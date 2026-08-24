import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { locations, articles } from "@/db/schema/index";
import { desc, eq, count, aliasedTable } from "drizzle-orm";
import { locationSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [loc] = await db
        .select()
        .from(locations)
        .where(eq(locations.slug, slug))
        .limit(1);

      if (!loc) {
        return NextResponse.json({ message: "Wilayah tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(loc);
    }

    const parentLocations = aliasedTable(locations, "parent_locations");

    const items = await db
      .select({
        id: locations.id,
        name: locations.name,
        slug: locations.slug,
        level: locations.level,
        parentId: locations.parentId,
        parentName: parentLocations.name,
        description: locations.description,
        createdAt: locations.createdAt,
        articleCount: count(articles.id),
      })
      .from(locations)
      .leftJoin(parentLocations, eq(locations.parentId, parentLocations.id))
      .leftJoin(articles, eq(articles.locationId, locations.id))
      .groupBy(locations.id, parentLocations.name)
      .orderBy(desc(locations.createdAt));

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/locations error:", error);
    return NextResponse.json({ message: "Gagal mengambil data wilayah" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = locationSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug, level, parentId, description, isActive } = parsed.data;

    const [existing] = await db
      .select()
      .from(locations)
      .where(eq(locations.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { message: "Slug wilayah sudah digunakan" },
        { status: 400 }
      );
    }

    const [newLocation] = await db
      .insert(locations)
      .values({
        name,
        slug,
        level,
        parentId: parentId || null,
        description: description || null,
        isActive: isActive ?? true,
      })
      .returning();

    return NextResponse.json(
      { message: "Wilayah berhasil dibuat", data: newLocation },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/locations error:", error);
    return NextResponse.json({ message: "Gagal membuat wilayah" }, { status: 500 });
  }
}
