import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { articles, categories, authors, notifications, users, tags, articleTags, articleRevisions } from "@/db/schema/index";
import { eq, and, ne, max } from "drizzle-orm";
import { revalidateAllArticles } from "@/lib/queries";
import { z } from "zod";
import { apiError, zodError } from "@/lib/api-response";
import { positiveIdSchema } from "@/lib/validators/cms";
import {
  canManageEditorial,
  getSessionFromRequest,
  isContributor,
} from "@/lib/server-session";
import { sanitizeRichHtml } from "@/lib/content-sanitizer";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { canTransitionArticle } from "@/lib/editorial-state";
import { assertSameOrigin } from "@/lib/request-security";
import { writeAuditLog } from "@/lib/audit-log";

const articleUpdateSchema = z.object({
  title: z.string().trim().min(5).max(255).optional(),
  slug: z.string().trim().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  subtitle: z.string().max(500).nullable().optional(),
  content: z.string().max(250_000).nullable().optional(),
  excerpt: z.string().max(1_000).nullable().optional(),
  thumbnail: z.string().url().or(z.string().startsWith("/")).nullable().optional(),
  imageCaption: z.string().max(1_000).nullable().optional(),
  status: z.enum(["draft", "submitted", "editorial_review", "approved", "scheduled", "published", "revision_required", "rejected", "archived"]).optional(),
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
  reviewNote: z.string().max(5_000).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(100)).max(20).optional(),
}).strict();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const articleId = parsedId.data;

    const [article] = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        subtitle: articles.subtitle,
        content: articles.content,
        excerpt: articles.excerpt,
        thumbnail: articles.thumbnail,
        imageCaption: articles.imageCaption,
        status: articles.status,
        viewCount: articles.viewCount,
        featured: articles.featured,
        editorsChoice: articles.editorsChoice,
        breaking: articles.breaking,
        readingTime: articles.readingTime,
        scheduledAt: articles.scheduledAt,
        authorId: articles.authorId,
        locationId: articles.locationId,
        sponsoredLabel: articles.sponsoredLabel,
        seoTitle: articles.seoTitle,
        seoDescription: articles.seoDescription,
        seoKeywords: articles.seoKeywords,
        focusKeyword: articles.focusKeyword,
        seoScore: articles.seoScore,
        publishedAt: articles.publishedAt,
        submittedAt: articles.submittedAt,
        reviewNote: articles.reviewNote,
        editorId: articles.editorId,
        createdAt: articles.createdAt,
        categoryId: articles.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: authors.name,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(eq(articles.id, articleId))
      .limit(1);

    if (!article) {
      return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    const sessionUser = await getSessionFromRequest(request);
    const canViewPrivateArticle =
      canManageEditorial(sessionUser) ||
      (isContributor(sessionUser) && article.authorId === sessionUser?.authorId);
    if (article.status !== "published" && !canViewPrivateArticle) {
      return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    // Fetch tags untuk artikel ini
    const articleTagRows = await db
      .select({ tagId: tags.id, tagName: tags.name, tagSlug: tags.slug })
      .from(articleTags)
      .innerJoin(tags, eq(articleTags.tagId, tags.id))
      .where(eq(articleTags.articleId, articleId));

    const articleWithTags = {
      ...article,
      tags: articleTagRows.map((t) => ({ id: t.tagId, name: t.tagName, slug: t.tagSlug })),
    };

    return NextResponse.json(articleWithTags);
  } catch (error) {
    console.error("GET /api/articles/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data artikel" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const originError = assertSameOrigin(request);
    if (originError) return originError;
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const articleId = parsedId.data;
    const parsedBody = articleUpdateSchema.safeParse(await request.json().catch(() => null));
    if (!parsedBody.success) return zodError(parsedBody.error);
    const body = parsedBody.data;
    const sessionUser = await getSessionFromRequest(request);

    if (!sessionUser) {
      return NextResponse.json(
        { message: "Anda harus login untuk mengubah artikel" },
        { status: 401 }
      );
    }

    const contributor = isContributor(sessionUser);
    const editorialUser = hasPermission(sessionUser, PERMISSIONS.ARTICLES_EDIT_ANY) || canManageEditorial(sessionUser);
    if (!hasPermission(sessionUser, PERMISSIONS.ARTICLES_EDIT_OWN) && !editorialUser) {
      return NextResponse.json(
        { message: "Akun pembaca tidak dapat mengubah artikel editorial" },
        { status: 403 }
      );
    }

    const {
      title,
      slug,
      subtitle,
      content,
      excerpt,
      thumbnail,
      imageCaption,
      status,
      categoryId,
      authorId,
      locationId,
      featured,
      editorsChoice,
      breaking,
      breakingStartsAt,
      breakingEndsAt,
      readingTime,
      scheduledAt,
      seoTitle,
      seoDescription,
      seoKeywords,
      focusKeyword,
      seoScore,
      sponsoredLabel,
      reviewNote,
      tags: tagNames,
    } = body;

    const [existing] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, articleId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    // Permission: kontributor hanya boleh mengubah artikel miliknya sendiri
    if (contributor) {
      if (existing.authorId !== sessionUser.authorId) {
        return NextResponse.json(
          { message: "Anda tidak memiliki akses ke artikel ini" },
          { status: 403 }
        );
      }
      // Kontributor hanya boleh mengedit draft atau artikel yang perlu revisi
      if (!["draft", "revision_required", "submitted"].includes(existing.status)) {
        return NextResponse.json(
          { message: "Artikel dengan status ini tidak dapat diubah oleh kontributor" },
          { status: 403 }
        );
      }
    }

    // Status finalisasi:
    // - Kontributor hanya boleh draft/submitted (submit ulang setelah revisi)
    // - Hanya admin/redaksi yang boleh publish/approve/reject
    let finalStatus = status ?? existing.status;
    if (contributor && !["draft", "submitted"].includes(finalStatus)) {
      finalStatus = "submitted";
    }

    const statusChanged = finalStatus !== existing.status;
    const now = new Date();
    if (statusChanged && !canTransitionArticle(existing.status, finalStatus)) {
      return apiError(422, "VALIDATION_ERROR", "Invalid article status transition");
    }

    const sanitizedContent = content !== undefined ? sanitizeRichHtml(content) : undefined;
    const effectiveContent = sanitizedContent !== undefined ? sanitizedContent : existing.content;
    const effectiveCategoryId = categoryId !== undefined ? categoryId : existing.categoryId;
    const effectiveScheduledAt = scheduledAt !== undefined ? (scheduledAt ? new Date(scheduledAt) : null) : existing.scheduledAt;
    if (["submitted", "editorial_review", "approved", "scheduled", "published"].includes(finalStatus) && (!effectiveContent?.trim() || !effectiveCategoryId)) {
      return NextResponse.json({ message: "Content and category are required before review or publication" }, { status: 422 });
    }
    if (finalStatus === "published" && effectiveScheduledAt && effectiveScheduledAt > now) {
      return NextResponse.json({ message: "This article cannot be published before its scheduled time" }, { status: 422 });
    }
    if (finalStatus === "scheduled" && !(scheduledAt || existing.scheduledAt)) {
      return NextResponse.json({ message: "A scheduled publication time is required" }, { status: 422 });
    }
    const effectiveScheduledDate = scheduledAt !== undefined ? (scheduledAt ? new Date(scheduledAt) : null) : existing.scheduledAt;
    if (finalStatus === "scheduled" && effectiveScheduledDate && effectiveScheduledDate <= now) {
      return apiError(422, "VALIDATION_ERROR", "Scheduled publication must be in the future");
    }
    const effectiveBreakingStart = breakingStartsAt !== undefined ? (breakingStartsAt ? new Date(breakingStartsAt) : null) : existing.breakingStartsAt;
    const effectiveBreakingEnd = breakingEndsAt !== undefined ? (breakingEndsAt ? new Date(breakingEndsAt) : null) : existing.breakingEndsAt;
    if (effectiveBreakingStart && effectiveBreakingEnd && effectiveBreakingEnd <= effectiveBreakingStart) {
      return apiError(422, "VALIDATION_ERROR", "Breaking-news end time must be after its start time");
    }

    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(articles)
        .where(and(eq(articles.slug, slug), ne(articles.id, articleId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json(
          { message: "Slug artikel sudah digunakan" },
          { status: 400 }
        );
      }
    }

    // Resolve editor ke tabel users legacy via email (hindari FK violation)
    let resolvedEditorId = existing.editorId;
    if (!contributor && statusChanged) {
      const [editorUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, sessionUser.email))
        .limit(1);
      if (editorUser) resolvedEditorId = editorUser.id;
    }

    const updated = await db.transaction(async (tx) => {
      const [updatedRow] = await tx
      .update(articles)
      .set({
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
        content: sanitizedContent !== undefined ? sanitizedContent : existing.content,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        thumbnail: thumbnail !== undefined ? thumbnail : existing.thumbnail,
        imageCaption: imageCaption !== undefined ? imageCaption : existing.imageCaption,
        status: finalStatus,
        categoryId: categoryId !== undefined ? (categoryId || null) : existing.categoryId,
        authorId: contributor
          ? existing.authorId
          : authorId !== undefined
            ? (authorId || null)
            : existing.authorId,
        locationId: locationId !== undefined ? (locationId || null) : existing.locationId,
        featured: contributor ? existing.featured : (featured !== undefined ? Boolean(featured) : existing.featured),
        editorsChoice: contributor ? existing.editorsChoice : (editorsChoice !== undefined ? Boolean(editorsChoice) : existing.editorsChoice),
        breaking: contributor ? existing.breaking : (breaking !== undefined ? Boolean(breaking) : existing.breaking),
        breakingStartsAt: contributor ? existing.breakingStartsAt : effectiveBreakingStart,
        breakingEndsAt: contributor ? existing.breakingEndsAt : effectiveBreakingEnd,
        readingTime: readingTime !== undefined ? readingTime : existing.readingTime,
        scheduledAt: scheduledAt !== undefined ? (scheduledAt ? new Date(scheduledAt) : null) : existing.scheduledAt,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : existing.seoKeywords,
        focusKeyword: focusKeyword !== undefined ? focusKeyword : existing.focusKeyword,
        seoScore: seoScore !== undefined ? seoScore : existing.seoScore,
        sponsoredLabel: sponsoredLabel !== undefined ? sponsoredLabel : existing.sponsoredLabel,
        // Transisi editorial
        submittedAt:
          finalStatus === "submitted" && existing.status !== "submitted"
            ? now
            : existing.submittedAt,
        reviewNote: reviewNote !== undefined ? reviewNote : existing.reviewNote,
        editorId: resolvedEditorId,
        publishedAt:
          finalStatus === "published" && existing.status !== "published"
            ? now
            : finalStatus !== "published"
              ? existing.publishedAt
              : existing.publishedAt,
        updatedAt: now,
      })
      .where(eq(articles.id, articleId))
      .returning();
      if (!updatedRow) return undefined;

    const [revisionNumber] = await tx
      .select({ value: max(articleRevisions.versionNumber) })
      .from(articleRevisions)
      .where(eq(articleRevisions.articleId, articleId));
    await tx.insert(articleRevisions).values({
      articleId,
      versionNumber: Number(revisionNumber?.value || 0) + 1,
      title: existing.title,
      content: existing.content,
      changedByAuthUserId: sessionUser.id,
      changeSummary: statusChanged ? `Status changed to ${finalStatus}` : "Article content mutation",
    });
    return updatedRow;
    });
    if (!updated) return apiError(500, "INTERNAL_ERROR", "Article update failed");
    await writeAuditLog(request, { userEmail: sessionUser.email, action: "article.update", resource: "article", resourceId: articleId, details: { fromStatus: existing.status, toStatus: finalStatus } });

    revalidateAllArticles();

    // Update tags jika disediakan
    if (Array.isArray(tagNames)) {
      try {
        // Hapus tag lama
        await db.delete(articleTags).where(eq(articleTags.articleId, articleId));
        // Insert tag baru
        for (const tagName of tagNames) {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
          let [existingTag] = await db.select().from(tags).where(eq(tags.slug, tagSlug)).limit(1);
          if (!existingTag) {
            [existingTag] = await db.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
          }
          if (existingTag) {
            await db.insert(articleTags).values({ articleId, tagId: existingTag.id }).onConflictDoNothing();
          }
        }
      } catch (tagError) {
        console.warn("Gagal update tags:", tagError instanceof Error ? tagError.message : "unknown error");
      }
    }

    // Notifikasi ke kontributor saat redaksi mengubah status artikelnya
    if (statusChanged && !contributor) {
      const notifByStatus: Record<string, { type: string; title: string; message: string }> = {
        editorial_review: {
          type: "article_review",
          title: "Artikel sedang ditinjau",
          message: `"${updated.title}" kini sedang ditinjau oleh tim redaksi.`,
        },
        revision_required: {
          type: "revision_required",
          title: "Artikel perlu revisi",
          message: `Redaksi meminta revisi untuk "${updated.title}".${reviewNote ? ` Catatan: ${reviewNote}` : ""}`,
        },
        approved: {
          type: "article_approved",
          title: "Artikel disetujui",
          message: `"${updated.title}" telah disetujui redaksi dan menunggu jadwal tayang.`,
        },
        published: {
          type: "article_published",
          title: "Artikel Anda telah terbit!",
          message: `"${updated.title}" kini tayang di Metrik Media Indonesia.`,
        },
        archived: {
          type: "article_rejected",
          title: "Artikel ditolak",
          message: `"${updated.title}" tidak lolos kurasi redaksi.${reviewNote ? ` Alasan: ${reviewNote}` : ""}`,
        },
      };

      const notif = notifByStatus[finalStatus];
      if (notif) {
        try {
          // Cari identifier user kontributor pemilik artikel
          const [author] = await db
            .select({ userId: authors.userId, authUserId: authors.authUserId, email: authors.email })
            .from(authors)
            .where(eq(authors.id, updated.authorId ?? 0))
            .limit(1);

          const recipientId =
            author?.authUserId ||
            (author?.userId ? String(author.userId) : null) ||
            (author?.email ? `author-email:${author.email}` : null);

          if (recipientId) {
            await db.insert(notifications).values({
              userId: recipientId,
              type: notif.type,
              title: notif.title,
              message: notif.message,
              articleId: updated.id,
              link:
                finalStatus === "published"
                  ? `/dashboard/my-articles`
                  : `/dashboard/articles/${updated.id}/edit`,
            });
          }
        } catch (notifError) {
          console.warn("Gagal membuat notifikasi kontributor:", notifError instanceof Error ? notifError.message : "unknown error");
        }
      }
    }

    return NextResponse.json({ message: "Artikel berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/articles/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui artikel" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const originError = assertSameOrigin(request);
    if (originError) return originError;
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const articleId = parsedId.data;
    const sessionUser = await getSessionFromRequest(request);

    if (!sessionUser) {
      return NextResponse.json(
        { message: "Anda harus login untuk menghapus artikel" },
        { status: 401 }
      );
    }

    const [existing] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, articleId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    // Kontributor hanya boleh hapus artikel miliknya yang belum terbit
    if (isContributor(sessionUser)) {
      if (existing.authorId !== sessionUser.authorId) {
        return NextResponse.json(
          { message: "Anda tidak memiliki akses ke artikel ini" },
          { status: 403 }
        );
      }
      if (existing.status === "published") {
        return NextResponse.json(
          { message: "Artikel yang sudah terbit tidak dapat dihapus kontributor" },
          { status: 403 }
        );
      }
    } else if (!hasPermission(sessionUser, PERMISSIONS.ARTICLES_DELETE) && !canManageEditorial(sessionUser)) {
      return NextResponse.json(
        { message: "Akun pembaca tidak dapat menghapus artikel editorial" },
        { status: 403 }
      );
    }

    await db.delete(articles).where(eq(articles.id, articleId));
    await writeAuditLog(request, { userEmail: sessionUser.email, action: "article.delete", resource: "article", resourceId: articleId });

    revalidateAllArticles();

    return NextResponse.json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus artikel" }, { status: 500 });
  }
}
