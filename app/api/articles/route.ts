import { NextRequest, NextResponse } from "next/server";
import { and, count, desc, eq, inArray, like, or } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/index";
import { articleTags, articles, authors, categories, notifications, tags } from "@/db/schema/index";
import { revalidateAllArticles } from "@/lib/queries";
import {
  canManageEditorial,
  getSessionFromRequest,
  isContributor,
} from "@/lib/server-session";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { apiError, zodError } from "@/lib/api-response";
import { sanitizeRichHtml } from "@/lib/content-sanitizer";
import { articleRevisions } from "@/db/schema/index";
import { assertSameOrigin } from "@/lib/request-security";
import { writeAuditLog } from "@/lib/audit-log";

const articleStatusSchema = z.enum([
  "draft",
  "submitted",
  "editorial_review",
  "approved",
  "scheduled",
  "published",
  "revision_required",
  "rejected",
  "archived",
]);

const articleInputSchema = z.object({
  title: z.string().trim().min(5).max(255),
  slug: z.string().trim().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  subtitle: z.string().max(500).nullable().optional(),
  content: z.string().max(250_000).nullable().optional(),
  excerpt: z.string().max(1_000).nullable().optional(),
  thumbnail: z.string().url().or(z.string().startsWith("/")).nullable().optional(),
  imageCaption: z.string().max(1_000).nullable().optional(),
  status: articleStatusSchema.optional(),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
  authorId: z.coerce.number().int().positive().nullable().optional(),
  locationId: z.coerce.number().int().positive().nullable().optional(),
  featured: z.boolean().optional(),
  editorsChoice: z.boolean().optional(),
  breaking: z.boolean().optional(),
  breakingStartsAt: z.string().datetime().nullable().optional(),
  breakingEndsAt: z.string().datetime().nullable().optional(),
  readingTime: z.coerce.number().int().min(0).max(1_440).optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  seoTitle: z.string().max(255).nullable().optional(),
  seoDescription: z.string().max(1_000).nullable().optional(),
  seoKeywords: z.string().max(1_000).nullable().optional(),
  focusKeyword: z.string().max(100).nullable().optional(),
  seoScore: z.coerce.number().int().min(0).max(100).optional(),
  sponsoredLabel: z.string().max(50).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(100)).max(20).optional(),
});

function createTagSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") || "10", 10) || 10));
    const search = searchParams.get("search")?.trim() || "";
    const categorySlug = searchParams.get("category");
    const statusValue = searchParams.get("status");
    const authorIdValue = searchParams.get("authorId");
    const slug = searchParams.get("slug")?.trim();
    const sessionUser = await getSessionFromRequest(request);
    const editorialUser = canManageEditorial(sessionUser);
    const contributor = isContributor(sessionUser);
    const ownAuthorId = sessionUser?.authorId;

    if (statusValue && !articleStatusSchema.safeParse(statusValue).success) {
      return NextResponse.json({ message: "Status artikel tidak valid" }, { status: 400 });
    }

    if (slug) {
      const [article] = await db
        .select()
        .from(articles)
        .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
        .limit(1);
      if (!article) {
        return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json(article);
    }

    const conditions = [];
    const privateContributorQuery = contributor && ownAuthorId && (
      Boolean(authorIdValue) || (statusValue !== null && statusValue !== "published")
    );

    if (!editorialUser) {
      conditions.push(
        privateContributorQuery && ownAuthorId
          ? eq(articles.authorId, ownAuthorId)
          : eq(articles.status, "published")
      );
    }
    if (statusValue) conditions.push(eq(articles.status, statusValue));
    if (search) {
      const term = `%${search}%`;
      conditions.push(or(like(articles.title, term), like(articles.excerpt, term)));
    }
    if (contributor && ownAuthorId && authorIdValue) {
      conditions.push(eq(articles.authorId, ownAuthorId));
    } else if (authorIdValue && /^\d+$/.test(authorIdValue)) {
      conditions.push(eq(articles.authorId, Number.parseInt(authorIdValue, 10)));
    }
    if (categorySlug) {
      const [category] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);
      if (!category) return NextResponse.json({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
      conditions.push(eq(articles.categoryId, category.id));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const items = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        thumbnail: articles.thumbnail,
        status: articles.status,
        viewCount: articles.viewCount,
        seoTitle: articles.seoTitle,
        seoDescription: articles.seoDescription,
        seoKeywords: articles.seoKeywords,
        focusKeyword: articles.focusKeyword,
        seoScore: articles.seoScore,
        publishedAt: articles.publishedAt,
        submittedAt: articles.submittedAt,
        reviewNote: articles.reviewNote,
        createdAt: articles.createdAt,
        categoryId: articles.categoryId,
        categoryName: categories.name,
        categoryColor: categories.color,
        categorySlug: categories.slug,
        authorId: articles.authorId,
        authorName: authors.name,
        authorSlug: authors.slug,
        authorAvatar: authors.avatar,
        authorRole: authors.role,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(whereClause)
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [totalResult] = await db.select({ count: count() }).from(articles).where(whereClause);
    const articleIds = items.map((item) => item.id);
    const tagRows = articleIds.length
      ? await db
          .select({ articleId: articleTags.articleId, id: tags.id, name: tags.name, slug: tags.slug })
          .from(articleTags)
          .innerJoin(tags, eq(articleTags.tagId, tags.id))
          .where(inArray(articleTags.articleId, articleIds))
      : [];
    const tagsByArticle = new Map<number, { id: number; name: string; slug: string }[]>();
    for (const tag of tagRows) {
      tagsByArticle.set(tag.articleId, [...(tagsByArticle.get(tag.articleId) || []), {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      }]);
    }

    return NextResponse.json({
      data: items.map((item) => ({ ...item, tags: tagsByArticle.get(item.id) || [] })),
      pagination: {
        page,
        limit,
        total: totalResult?.count || 0,
        totalPages: Math.ceil((totalResult?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/articles failed", error);
    return NextResponse.json({ message: "Gagal mengambil data artikel" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const originError = assertSameOrigin(request);
    if (originError) return originError;
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json({ message: "Anda harus login untuk membuat artikel" }, { status: 401 });
    }
    const contributor = isContributor(sessionUser);
    if (!hasPermission(sessionUser, PERMISSIONS.ARTICLES_CREATE) && !hasPermission(sessionUser, PERMISSIONS.ARTICLES_EDIT_ANY)) {
      return NextResponse.json({ message: "Akun pembaca tidak dapat membuat artikel editorial" }, { status: 403 });
    }

    const parsed = articleInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return zodError(parsed.error);
    }
    const input = parsed.data;
    const finalStatus = contributor && !["draft", "submitted"].includes(input.status || "draft")
      ? "submitted"
      : input.status || "draft";
    if (["submitted", "published", "scheduled"].includes(finalStatus) && (!input.content || !input.categoryId)) {
      return NextResponse.json(
        { message: "Konten dan kategori wajib diisi sebelum dikirim atau diterbitkan" },
        { status: 400 }
      );
    }
    if (finalStatus === "scheduled" && !input.scheduledAt) {
      return NextResponse.json({ message: "Tanggal publikasi wajib diisi" }, { status: 400 });
    }
    if (finalStatus === "scheduled" && input.scheduledAt && new Date(input.scheduledAt) <= new Date()) {
      return apiError(422, "VALIDATION_ERROR", "Scheduled publication must be in the future");
    }
    if (input.breakingStartsAt && input.breakingEndsAt && new Date(input.breakingEndsAt) <= new Date(input.breakingStartsAt)) {
      return apiError(422, "VALIDATION_ERROR", "Breaking-news end time must be after its start time");
    }

    const db = await getDb();
    const [existing] = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, input.slug)).limit(1);
    if (existing) return NextResponse.json({ message: "Slug artikel sudah digunakan" }, { status: 400 });

    const [newArticle] = await db
      .insert(articles)
      .values({
        title: input.title,
        slug: input.slug,
        subtitle: input.subtitle || null,
        content: sanitizeRichHtml(input.content) || null,
        excerpt: input.excerpt || null,
        thumbnail: input.thumbnail || null,
        imageCaption: input.imageCaption || null,
        status: finalStatus,
        categoryId: input.categoryId || null,
        authorId: contributor ? sessionUser.authorId || null : input.authorId || null,
        locationId: input.locationId || null,
        featured: contributor ? false : Boolean(input.featured),
        editorsChoice: contributor ? false : Boolean(input.editorsChoice),
        breaking: contributor ? false : Boolean(input.breaking),
        breakingStartsAt: contributor ? null : input.breakingStartsAt ? new Date(input.breakingStartsAt) : null,
        breakingEndsAt: contributor ? null : input.breakingEndsAt ? new Date(input.breakingEndsAt) : null,
        readingTime: input.readingTime || 0,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        seoTitle: input.seoTitle || input.title,
        seoDescription: input.seoDescription || input.excerpt || null,
        seoKeywords: input.seoKeywords || null,
        focusKeyword: input.focusKeyword || null,
        seoScore: input.seoScore || 0,
        sponsoredLabel: input.sponsoredLabel || null,
        submittedAt: finalStatus === "submitted" ? new Date() : null,
        publishedAt: finalStatus === "published" ? new Date() : null,
      })
      .returning();

    await db.insert(articleRevisions).values({
      articleId: newArticle.id,
      versionNumber: 1,
      title: newArticle.title,
      content: newArticle.content,
      changedByAuthUserId: sessionUser.id,
      changeSummary: "Initial article snapshot",
    });
    await writeAuditLog(request, { userEmail: sessionUser.email, action: "article.create", resource: "article", resourceId: newArticle.id, details: { status: finalStatus } });

    for (const tagName of input.tags || []) {
      const tagSlug = createTagSlug(tagName);
      let [tag] = await db.select().from(tags).where(eq(tags.slug, tagSlug)).limit(1);
      if (!tag) [tag] = await db.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
      if (tag) await db.insert(articleTags).values({ articleId: newArticle.id, tagId: tag.id }).onConflictDoNothing();
    }

    if (finalStatus === "submitted" && contributor) {
      await db.insert(notifications).values({
        userId: "admin",
        type: "article_submitted",
        title: "Artikel baru menunggu review",
        message: `${sessionUser.name} mengirimkan "${input.title}" untuk ditinjau redaksi.`,
        articleId: newArticle.id,
        link: "/dashboard/editorial",
      });
    }

    revalidateAllArticles();
    return NextResponse.json({ message: "Artikel berhasil dibuat", data: newArticle }, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles failed", error);
    return NextResponse.json({ message: "Gagal membuat artikel" }, { status: 500 });
  }
}
