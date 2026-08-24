import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articleMedia, articles, articleRevisions, authors, categories, media, notifications, submissionReviews, submissions, submissionRevisions, user as authUsers } from "@/db/schema/index";
import { requirePermission } from "@/lib/server-session";
import { PERMISSIONS } from "@/lib/permissions";
import { apiError } from "@/lib/api-response";
import { sanitizeRichHtml } from "@/lib/content-sanitizer";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 220);
}

type Database = Awaited<ReturnType<typeof getDb>>;

async function createUniqueSlug(db: Database, title: string) {
  const base = slugify(title) || "submission";
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const slug = suffix ? `${base}-${suffix + 1}` : base;
    const [existing] = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug)).limit(1);
    if (!existing) return slug;
  }
  return `${base}-${Date.now()}`;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authGuard = await requirePermission(request, PERMISSIONS.SUBMISSIONS_REVIEW, "Editorial permission required");
  if (authGuard.error) return authGuard.error;
  const id = parseId((await params).id);
  if (!id) return apiError(400, "VALIDATION_ERROR", "Invalid submission id");

  const db = await getDb();
  const [submission] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  if (!submission) return apiError(404, "NOT_FOUND", "Submission not found");
  if (submission.articleId) {
    const [existingArticle] = await db.select().from(articles).where(eq(articles.id, submission.articleId)).limit(1);
    if (existingArticle) return NextResponse.json({ data: existingArticle, idempotent: true }, { status: 200 });
  }
  if (!["approved", "published"].includes(submission.status)) {
    return apiError(409, "CONFLICT", "Only approved submissions can be published");
  }
  if (!submission.categoryId) return apiError(422, "VALIDATION_ERROR", "A category is required before publishing");
  const [category] = await db.select({ id: categories.id, slug: categories.slug }).from(categories).where(and(eq(categories.id, submission.categoryId), eq(categories.isActive, true))).limit(1);
  if (!category) return apiError(422, "VALIDATION_ERROR", "Category is unavailable");

  const result = await db.transaction(async (tx) => {
  const [author] = await tx.select().from(authors).where(eq(authors.authUserId, submission.userId)).limit(1);
  const [submitter] = await tx.select({ name: authUsers.name, email: authUsers.email }).from(authUsers).where(eq(authUsers.id, submission.userId)).limit(1);
  let authorId = author?.id;
  if (!authorId && submitter) {
    const authorSlug = `${slugify(submitter.name) || "contributor"}-${submission.id}`;
    const [createdAuthor] = await tx.insert(authors).values({
      authUserId: submission.userId,
      name: submitter.name,
      email: submitter.email,
      slug: authorSlug,
      role: "Contributor",
      status: "active",
    }).returning({ id: authors.id });
    authorId = createdAuthor.id;
  }
  if (!authorId) throw new Error("Unable to resolve submission author");

  const now = new Date();
  const slug = await createUniqueSlug(tx, submission.title);
  const [article] = await tx.insert(articles).values({
    title: submission.title,
    slug,
    excerpt: submission.summary,
    content: sanitizeRichHtml(submission.content) || "",
    thumbnail: submission.featuredImage,
    categoryId: submission.categoryId,
    authorId,
    editorAuthUserId: authGuard.user.id,
    status: "published",
    publishedAt: now,
    readingTime: Math.max(1, Math.ceil(submission.content.split(/\s+/).filter(Boolean).length / 200)),
  }).returning();
  if (!article) throw new Error("Article was not created");
  await tx.insert(articleRevisions).values({ articleId: article.id, versionNumber: 1, title: article.title, content: article.content, changedByAuthUserId: authGuard.user.id, changeSummary: "Published from submission" });

  const mediaUrls = [
    ...(submission.attachments ?? []).map((url) => ({ url, type: "image" as const, role: "gallery" })),
    ...(submission.videoUrl ? [{ url: submission.videoUrl, type: "video" as const, role: "video" }] : []),
  ];
  for (const [sortOrder, item] of mediaUrls.entries()) {
    const [createdMedia] = await tx.insert(media).values({ url: item.url, type: item.type, alt: submission.title, authUserId: submission.userId }).returning({ id: media.id });
    const mediaId = createdMedia?.id;
    if (mediaId) await tx.insert(articleMedia).values({ articleId: article.id, mediaId, role: item.role, sortOrder, caption: submission.title }).onConflictDoNothing();
  }

  await tx.update(submissions).set({ status: "published", articleId: article.id, publishedAt: now, reviewedBy: authGuard.user.id, reviewedAt: now, updatedAt: now }).where(eq(submissions.id, id));
  const [revisionNumber] = await tx.select({ value: sql<number>`coalesce(max(${submissionRevisions.versionNumber}), 0)` }).from(submissionRevisions).where(eq(submissionRevisions.submissionId, id));
  await tx.insert(submissionRevisions).values({ submissionId: id, versionNumber: Number(revisionNumber?.value || 0) + 1, snapshot: { ...submission, status: "published", articleId: article.id }, changedById: authGuard.user.id, changeSummary: `Published as article ${article.id}` });
  await tx.insert(submissionReviews).values({ submissionId: id, reviewerId: authGuard.user.id, action: "published", note: `Published as article ${article.id}` });
  await tx.insert(notifications).values({ userId: submission.userId, type: "submission_published", title: "Your submission is published", message: `“${submission.title}” is now live.`, articleId: article.id, link: `/${category.slug}/${slug}` });
  return article;
  });
  return NextResponse.json({ data: result }, { status: 201 });
}
