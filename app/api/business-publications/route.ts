import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db/index";
import { businessPublications, notifications } from "@/db/schema/index";
import { getSessionFromRequest, requireAdmin } from "@/lib/server-session";
import { businessPublicationSchema } from "@/lib/validators/public";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { zodError } from "@/lib/api-response";
import { assertSameOrigin } from "@/lib/request-security";
import { getEditorialRecipientIds } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request);
  if (authGuard.error) return authGuard.error;

  const db = await getDb();
  const data = await db
    .select({
      id: businessPublications.id,
      companyName: businessPublications.companyName,
      contactName: businessPublications.contactName,
      contactEmail: businessPublications.contactEmail,
      articleTitle: businessPublications.articleTitle,
      status: businessPublications.status,
      reviewNote: businessPublications.reviewNote,
      createdAt: businessPublications.createdAt,
      updatedAt: businessPublications.updatedAt,
    })
    .from(businessPublications)
    .orderBy(desc(businessPublications.updatedAt));
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  const limited = await enforceRateLimit(request, "business-publications", 3, 60 * 60);
  if (limited) return limited;

  const parsed = businessPublicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return zodError(parsed.error);
  }

  const sessionUser = await getSessionFromRequest(request);
  const db = await getDb();
  const [publication] = await db
    .insert(businessPublications)
    .values({
      ...parsed.data,
      userId: sessionUser?.id ?? null,
      status: "submitted",
    })
    .returning({ id: businessPublications.id, articleTitle: businessPublications.articleTitle });

  const editorialRecipients = await getEditorialRecipientIds();
  if (editorialRecipients.length > 0) {
    await db.insert(notifications).values(
      editorialRecipients.map((userId) => ({
        userId,
        type: "business_publication_received",
        title: "New business publication request",
        message: `${parsed.data.companyName} submitted “${parsed.data.articleTitle}”.`,
        link: `/dashboard/business-publications/${publication.id}`,
      }))
    );
  }

  const recipient = process.env.BUSINESS_PUBLICATION_RECIPIENT || process.env.EDITORIAL_EMAIL;
  if (recipient) {
    await sendEmail({
      to: recipient,
      subject: `Business publication request: ${parsed.data.articleTitle}`,
      html: `<p>${parsed.data.companyName} submitted a business publication request.</p><p>Contact: ${parsed.data.contactEmail}</p>`,
    });
  }

  return NextResponse.json({ message: "Business publication submitted", data: publication }, { status: 201 });
}
