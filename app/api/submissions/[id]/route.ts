import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/index";
import { categories, notifications, submissionReviews, submissions, submissionRevisions } from "@/db/schema/index";
import { requireAuth } from "@/lib/server-session";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { apiError, zodError } from "@/lib/api-response";
import { sanitizeRichHtml } from "@/lib/content-sanitizer";
import { canTransitionSubmission } from "@/lib/editorial-state";
import { writeAuditLog } from "@/lib/audit-log";

const authorUpdateSchema = z.object({
  title: z.string().trim().min(10).max(255).optional(),
  summary: z.string().trim().max(500).optional().nullable(),
  content: z.string().trim().min(50).max(100_000).optional(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  featuredImage: z.string().url().max(2_000).optional().nullable(),
  attachments: z.array(z.string().url().max(2_000)).max(10).optional(),
  videoUrl: z.string().url().max(2_000).optional().nullable(),
  sources: z.string().trim().max(10_000).optional().nullable(),
  submit: z.boolean().optional(),
});

const editorialUpdateSchema = z.object({
  status: z.enum(["under_review", "revision_required", "approved", "rejected", "published"]),
  adminNote: z.string().trim().max(5_000).optional().nullable(),
  articleId: z.coerce.number().int().positive().optional().nullable(),
});

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const authResult = authGuard.user;
  const id = parseId((await params).id);
  if (!id) return apiError(400, "VALIDATION_ERROR", "Invalid submission id");

  const db = await getDb();
  const [submission] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  if (!submission || (!hasPermission(authResult, PERMISSIONS.SUBMISSIONS_REVIEW) && submission.userId !== authResult.id)) {
    return NextResponse.json({ message: "Submission not found" }, { status: 404 });
  }
  const reviews = await db
    .select({ action: submissionReviews.action, note: submissionReviews.note, createdAt: submissionReviews.createdAt })
    .from(submissionReviews)
    .where(eq(submissionReviews.submissionId, id))
    .orderBy(submissionReviews.createdAt);
  return NextResponse.json({ data: submission, reviews });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const authResult = authGuard.user;
  const id = parseId((await params).id);
  if (!id) return apiError(400, "VALIDATION_ERROR", "Invalid submission id");

  const db = await getDb();
  const [existing] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  if (!existing) return NextResponse.json({ message: "Submission not found" }, { status: 404 });

  const editorial = hasPermission(authResult, PERMISSIONS.SUBMISSIONS_REVIEW);
  if (!editorial && existing.userId !== authResult.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const now = new Date();
  if (editorial) {
    const payload = editorialUpdateSchema.safeParse(body);
    if (!payload.success) return zodError(payload.error);

    if (["revision_required", "rejected"].includes(payload.data.status) && !payload.data.adminNote) {
      return apiError(422, "VALIDATION_ERROR", "An editorial note is required");
    }
    if (!canTransitionSubmission(existing.status, payload.data.status)) {
      return apiError(422, "VALIDATION_ERROR", "Invalid submission status transition");
    }
    if (payload.data.status === "published" && !payload.data.articleId && !existing.articleId) {
      return apiError(422, "VALIDATION_ERROR", "Publish through the conversion endpoint");
    }

    const updated = await db.transaction(async (tx) => {
    if (payload.data.status === "revision_required") {
      const [revisionNumber] = await tx
        .select({ value: sql<number>`coalesce(max(${submissionRevisions.versionNumber}), 0)` })
        .from(submissionRevisions)
        .where(eq(submissionRevisions.submissionId, id));
      await tx.insert(submissionRevisions).values({
        submissionId: id,
        versionNumber: Number(revisionNumber?.value || 0) + 1,
        snapshot: existing,
        changedById: authResult.id,
        changeSummary: payload.data.adminNote || "Revision requested",
      });
    }

    const [updatedRow] = await tx
      .update(submissions)
      .set({
        status: payload.data.status,
        adminNote: payload.data.adminNote ?? null,
        articleId: payload.data.articleId ?? existing.articleId,
        reviewedBy: authResult.id,
        reviewedAt: now,
        publishedAt: payload.data.status === "published" ? now : existing.publishedAt,
        updatedAt: now,
      })
      .where(eq(submissions.id, id))
      .returning();

    await tx.insert(submissionReviews).values({
      submissionId: id,
      reviewerId: authResult.id,
      action: payload.data.status,
      note: payload.data.adminNote ?? null,
    });
    return updatedRow;
    });
    if (!updated) return apiError(500, "INTERNAL_ERROR", "Submission update failed");
    await writeAuditLog(request, { userEmail: authResult.email, action: "submission.review", resource: "submission", resourceId: id, details: { fromStatus: existing.status, toStatus: payload.data.status } });

    await db.insert(notifications).values({
      userId: existing.userId,
      type: "submission_reviewed",
      title: "Your submission was reviewed",
      message: `“${existing.title}” is now ${updated.status.replaceAll("_", " ")}.`,
      link: `/submissions/${id}`,
    });
    return NextResponse.json({ data: updated });
  }

  if (!["draft", "revision_required"].includes(existing.status)) {
    return NextResponse.json({ message: "This submission can no longer be edited" }, { status: 409 });
  }
  const payload = authorUpdateSchema.safeParse(body);
  if (!payload.success) return zodError(payload.error);
  if (payload.data.categoryId) {
    const [category] = await db.select({ id: categories.id }).from(categories).where(and(eq(categories.id, payload.data.categoryId), eq(categories.isActive, true))).limit(1);
    if (!category) return apiError(422, "VALIDATION_ERROR", "Category not found");
  }

  const { submit, ...submissionUpdates } = payload.data;
  const sanitizedSubmissionUpdates = {
    ...submissionUpdates,
    ...(submissionUpdates.content !== undefined
      ? { content: sanitizeRichHtml(submissionUpdates.content) || "" }
      : {}),
  };
  const nextStatus = submit ? "submitted" : existing.status;
  if (!canTransitionSubmission(existing.status, nextStatus)) {
    return apiError(422, "VALIDATION_ERROR", "Invalid submission status transition");
  }
  const [updated] = await db
    .update(submissions)
    .set({
      ...sanitizedSubmissionUpdates,
      status: nextStatus,
      submittedAt: submit ? now : existing.submittedAt,
      updatedAt: now,
    })
    .where(eq(submissions.id, id))
    .returning();
  if (submit || submissionUpdates.content !== undefined || submissionUpdates.title !== undefined) {
    const [revisionNumber] = await db
      .select({ value: sql<number>`coalesce(max(${submissionRevisions.versionNumber}), 0)` })
      .from(submissionRevisions)
      .where(eq(submissionRevisions.submissionId, id));
    await db.insert(submissionRevisions).values({
      submissionId: id,
      versionNumber: Number(revisionNumber?.value || 0) + 1,
      snapshot: updated,
      changedById: authResult.id,
      changeSummary: submit ? "Submission resubmitted" : "Author revision saved",
    });
    await writeAuditLog(request, { userEmail: authResult.email, action: "submission.resubmit", resource: "submission", resourceId: id, details: { status: nextStatus } });
  }
  if (submit) {
    await db.insert(submissionReviews).values({
      submissionId: id,
      reviewerId: authResult.id,
      action: "resubmitted",
    });
  }
  return NextResponse.json({ data: updated });
}
