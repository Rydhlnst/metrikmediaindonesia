import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { businessPublications, notifications } from "@/db/schema/index";
import { canManageEditorial, requireAuth } from "@/lib/server-session";
import { businessPublicationReviewSchema } from "@/lib/validators/public";
import { apiError, zodError } from "@/lib/api-response";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const id = parseId((await params).id);
  if (!id) return apiError(400, "VALIDATION_ERROR", "Invalid publication id");

  const db = await getDb();
  const [publication] = await db.select().from(businessPublications).where(eq(businessPublications.id, id)).limit(1);
  if (!publication || (!canManageEditorial(authGuard.user) && publication.userId !== authGuard.user.id)) {
    return NextResponse.json({ message: "Publication not found" }, { status: 404 });
  }
  return NextResponse.json({ data: publication });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  if (!canManageEditorial(authGuard.user)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const id = parseId((await params).id);
  if (!id) return apiError(400, "VALIDATION_ERROR", "Invalid publication id");

  const parsed = businessPublicationReviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return zodError(parsed.error);
  if (["revision_required", "rejected"].includes(parsed.data.status) && !parsed.data.reviewNote) {
    return apiError(422, "VALIDATION_ERROR", "A review note is required");
  }

  const db = await getDb();
  const [existing] = await db.select().from(businessPublications).where(eq(businessPublications.id, id)).limit(1);
  if (!existing) return NextResponse.json({ message: "Publication not found" }, { status: 404 });

  const now = new Date();
  const [updated] = await db
    .update(businessPublications)
    .set({
      status: parsed.data.status,
      reviewNote: parsed.data.reviewNote ?? null,
      articleId: parsed.data.articleId ?? existing.articleId,
      reviewedBy: authGuard.user.id,
      reviewedAt: now,
      publishedAt: parsed.data.status === "published" ? now : existing.publishedAt,
      updatedAt: now,
    })
    .where(eq(businessPublications.id, id))
    .returning();

  if (existing.userId) {
    await db.insert(notifications).values({
      userId: existing.userId,
      type: "business_publication_reviewed",
      title: "Business publication request updated",
      message: `“${existing.articleTitle}” is now ${updated.status.replaceAll("_", " ")}.`,
      link: `/business-publication/${id}`,
    });
  }
  return NextResponse.json({ data: updated });
}
