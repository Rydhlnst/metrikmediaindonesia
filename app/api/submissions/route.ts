import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { categories, notifications, submissionReviews, submissions, submissionRevisions, user as authUsers } from "@/db/schema/index";
import { enforceRateLimit } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/server-session";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { zodError } from "@/lib/api-response";
import { sanitizeRichHtml } from "@/lib/content-sanitizer";
import { writeAuditLog } from "@/lib/audit-log";

const submissionSchema = z.object({
  title: z.string().trim().min(10).max(255),
  summary: z.string().trim().max(500).optional().nullable(),
  content: z.string().trim().min(50).max(100_000),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  featuredImage: z.string().url().max(2_000).optional().nullable(),
  attachments: z.array(z.string().url().max(2_000)).max(10).optional(),
  videoUrl: z.string().url().max(2_000).optional().nullable(),
  sources: z.string().trim().max(10_000).optional().nullable(),
  submit: z.boolean().optional().default(false),
});

const pageSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["draft", "submitted", "under_review", "revision_required", "approved", "rejected", "published"]).optional(),
});

export async function GET(request: NextRequest) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const authResult = authGuard.user;

  const parsed = pageSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return zodError(parsed.error);

  const db = await getDb();
  const filters = [];
  if (!hasPermission(authResult, PERMISSIONS.SUBMISSIONS_REVIEW)) filters.push(eq(submissions.userId, authResult.id));
  if (parsed.data.status) filters.push(eq(submissions.status, parsed.data.status));

  const data = await db
    .select({
      id: submissions.id,
      title: submissions.title,
      summary: submissions.summary,
      status: submissions.status,
      adminNote: submissions.adminNote,
      submittedAt: submissions.submittedAt,
      reviewedAt: submissions.reviewedAt,
      publishedAt: submissions.publishedAt,
      createdAt: submissions.createdAt,
      updatedAt: submissions.updatedAt,
      articleId: submissions.articleId,
      user: { id: authUsers.id, name: authUsers.name, email: authUsers.email },
      category: { id: categories.id, name: categories.name, slug: categories.slug },
    })
    .from(submissions)
    .leftJoin(authUsers, eq(submissions.userId, authUsers.id))
    .leftJoin(categories, eq(submissions.categoryId, categories.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(submissions.updatedAt))
    .limit(parsed.data.limit)
    .offset((parsed.data.page - 1) * parsed.data.limit);

  return NextResponse.json({ data, page: parsed.data.page, limit: parsed.data.limit });
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, "submissions", 5, 60 * 60);
  if (limited) return limited;
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const authResult = authGuard.user;

  const payload = submissionSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return zodError(payload.error);
  }

  const db = await getDb();
  if (payload.data.categoryId) {
    const [category] = await db.select({ id: categories.id }).from(categories).where(and(eq(categories.id, payload.data.categoryId), eq(categories.isActive, true))).limit(1);
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 400 });
  }

  const now = new Date();
  const status = payload.data.submit ? "submitted" : "draft";
  const [submission] = await db
    .insert(submissions)
    .values({
      userId: authResult.id,
      title: payload.data.title,
      summary: payload.data.summary ?? null,
      content: sanitizeRichHtml(payload.data.content) || "",
      categoryId: payload.data.categoryId ?? null,
      featuredImage: payload.data.featuredImage ?? null,
      attachments: payload.data.attachments ?? [],
      videoUrl: payload.data.videoUrl ?? null,
      sources: payload.data.sources ?? null,
      status,
      submittedAt: payload.data.submit ? now : null,
      updatedAt: now,
    })
    .returning();

  await db.insert(submissionRevisions).values({
    submissionId: submission.id,
    versionNumber: 1,
    snapshot: { ...submission, content: sanitizeRichHtml(submission.content) || "" },
    changedById: authResult.id,
    changeSummary: payload.data.submit ? "Initial submission" : "Initial draft",
  });
  await writeAuditLog(request, { userEmail: authResult.email, action: "submission.create", resource: "submission", resourceId: submission.id, details: { status } });

  if (payload.data.submit) {
    await db.insert(submissionReviews).values({
      submissionId: submission.id,
      reviewerId: authResult.id,
      action: "submitted",
    });
    await db.insert(notifications).values({
      userId: "admin",
      type: "submission_received",
      title: "New public submission",
      message: `${authResult.name} submitted “${submission.title}”.`,
      link: `/dashboard/submissions/${submission.id}`,
    });
  }

  return NextResponse.json({ data: submission }, { status: 201 });
}
