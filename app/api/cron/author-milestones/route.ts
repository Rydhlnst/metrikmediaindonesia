import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { authors, user, articles, authorMilestoneLogs } from "@/db/schema/index";
import { eq, and, sql } from "drizzle-orm";
import { sendAuthorMilestoneEmail } from "@/lib/email";
import { getMilestoneEmailContent } from "@/lib/email-templates/milestone";
import { milestoneQuerySchema } from "@/lib/validators/public";
import { zodError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

type MilestoneKey = "3_months" | "6_months" | "1_year" | "2_years" | "annual";

interface MilestoneRule {
  key: MilestoneKey;
  minDays: number;
  label: string;
}

const MILESTONE_RULES: MilestoneRule[] = [
  { key: "3_months", minDays: 90, label: "3 Bulan" },
  { key: "6_months", minDays: 180, label: "6 Bulan" },
  { key: "1_year", minDays: 365, label: "1 Tahun" },
  { key: "2_years", minDays: 730, label: "2 Tahun" },
];

export async function GET(request: NextRequest) {
  return handleMilestones(request);
}

export async function POST(request: NextRequest) {
  return handleMilestones(request);
}

async function handleMilestones(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const parsedQuery = milestoneQuerySchema.safeParse({
      preview: searchParams.get("preview") ?? undefined,
      forceMilestone: searchParams.get("forceMilestone") ?? undefined,
      testEmail: searchParams.get("testEmail") ?? undefined,
      name: searchParams.get("name") ?? undefined,
      slug: searchParams.get("slug") ?? undefined,
      articles: searchParams.get("articles") ?? undefined,
      views: searchParams.get("views") ?? undefined,
    });
    if (!parsedQuery.success) return zodError(parsedQuery.error);
    const { preview, forceMilestone, testEmail, name, slug, articles: articleCount, views } = parsedQuery.data;

    // Secret verification: CRON_SECRET wajib di production,
    // fallback dev-secret hanya untuk development.
    const expectedSecret =
      process.env.CRON_SECRET ??
      (process.env.NODE_ENV === "production" ? null : "dev-secret");

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET belum dikonfigurasi di environment" },
        { status: 500 }
      );
    }

    // Preview render murni (tanpa pengiriman email) boleh tanpa secret di dev
    const isPreviewOnly = preview && !testEmail;
    const authHeader = request.headers.get("authorization");
    if (
      !isPreviewOnly &&
      secret !== expectedSecret &&
      authHeader !== `Bearer ${expectedSecret}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Preview mode: render HTML directly in browser
    if (preview) {
      const milestone = forceMilestone || "3_months";
      const previewData = {
        authorName: name || "Author Preview",
        authorEmail: testEmail || "budi@metrikmediaindonesia.id",
        authorSlug: slug || "author-preview",
        milestoneType: milestone,
        joinedDateFormatted: "16 Mei 2026",
        totalArticles: articleCount || 14,
        totalViews: views || 28_450,
      };
      const emailContent = getMilestoneEmailContent(previewData);
      return new NextResponse(emailContent.html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // 2. Direct single test trigger
    if (testEmail && forceMilestone) {
      const testData = {
        authorName: name || "Author Uji Coba",
        authorEmail: testEmail,
        authorSlug: slug || "author-uji-coba",
        milestoneType: forceMilestone,
        joinedDateFormatted: new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date()),
        totalArticles: articleCount || 8,
        totalViews: views || 15_200,
      };

      const result = await sendAuthorMilestoneEmail(testData);
      return NextResponse.json({
        success: true,
        message: `Email milestone ${forceMilestone} berhasil dikirim ke ${testEmail}`,
        result,
      });
    }

    // 3. Automated Cron Scan
    const db = await getDb();
    const now = new Date();

    // Fetch all active authors joined with user accounts
    const authorRecords = await db
      .select({
        id: authors.id,
        name: authors.name,
        slug: authors.slug,
        status: authors.status,
        joinedAt: authors.joinedAt,
        createdAt: authors.createdAt,
        userEmail: user.email,
      })
      .from(authors)
      .leftJoin(user, eq(authors.authUserId, user.id))
      .where(eq(authors.status, "active"));

    const results = [];

    for (const author of authorRecords) {
      const email = author.userEmail;
      if (!email) continue; // Skip authors without email

      const joinDate = author.joinedAt || author.createdAt || new Date();
      const diffTime = Math.abs(now.getTime() - new Date(joinDate).getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Determine eligible milestones
      for (const rule of MILESTONE_RULES) {
        if (diffDays >= rule.minDays) {
          // Check if already sent
          const [existingLog] = await db
            .select()
            .from(authorMilestoneLogs)
            .where(
              and(
                eq(authorMilestoneLogs.authorId, author.id),
                eq(authorMilestoneLogs.milestoneType, rule.key)
              )
            )
            .limit(1);

          if (!existingLog) {
            // Calculate live stats
            const [stats] = await db
              .select({
                totalArticles: sql<number>`count(${articles.id})::int`,
                totalViews: sql<number>`coalesce(sum(${articles.viewCount}), 0)::int`,
              })
              .from(articles)
              .where(
                and(
                  eq(articles.authorId, author.id),
                  eq(articles.status, "published")
                )
              );

            const totalArticles = stats?.totalArticles || 0;
            const totalViews = stats?.totalViews || 0;

            const joinedFormatted = new Intl.DateTimeFormat("id-ID", {
              dateStyle: "long",
            }).format(new Date(joinDate));

            // Send Email
            const emailResult = await sendAuthorMilestoneEmail({
              authorName: author.name,
              authorEmail: email,
              authorSlug: author.slug,
              milestoneType: rule.key,
              joinedDateFormatted: joinedFormatted,
              totalArticles,
              totalViews,
            });

            // Log to database
            await db.insert(authorMilestoneLogs).values({
              authorId: author.id,
              milestoneType: rule.key,
              email,
              statsSnapshot: {
                totalArticles,
                totalViews,
                milestoneLabel: rule.label,
                joinedAt: joinDate.toISOString(),
              },
            });

            // Update stats cache on author
            await db
              .update(authors)
              .set({
                totalArticles,
                totalViews,
              })
              .where(eq(authors.id, author.id));

            results.push({
              authorId: author.id,
              authorName: author.name,
              email,
              milestone: rule.key,
              daysActive: diffDays,
              emailResult,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      processedAuthors: authorRecords.length,
      emailsDispatched: results.length,
      details: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron Author Milestones] Error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
