"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  Kanban,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  ArrowCounterClockwise,
  Eye,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { toIndonesianErrorMessage } from "@/lib/error-message";

interface Article {
  id: number;
  title: string;
  slug: string;
  status: string;
  categoryName: string | null;
  authorName: string | null;
  submittedAt: string | null;
  updatedAt: string;
  reviewNote: string | null;
}

const WORKFLOW_STAGES = [
  {
    id: "submitted",
    label: "Pending Review",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    dotClass: "bg-amber-500",
  },
  {
    id: "editorial_review",
    label: "Editorial Review",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-300",
    dotClass: "bg-blue-500",
  },
  {
    id: "revision_required",
    label: "Revision Required",
    badgeClass: "bg-red-50 text-red-800 border-red-300",
    dotClass: "bg-red-500",
  },
  {
    id: "approved",
    label: "Approved & Ready",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
    dotClass: "bg-emerald-500",
  },
];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}j lalu`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}h lalu`;
}

export default function EditorialWorkflowPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const statuses = ["submitted", "editorial_review", "revision_required", "approved"];
      const allArticles: Article[] = [];

      for (const status of statuses) {
        const res = await fetch(`/api/articles?status=${status}&limit=20`);
        const data = await res.json();
        if (res.ok && data.data) {
          allArticles.push(...data.data);
        }
      }

      setArticles(allArticles);
    } catch {
      toast.error("Gagal memuat data editorial");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchArticles());
  }, [fetchArticles]);

  const updateStatus = async (articleId: number, newStatus: string, reviewNote?: string) => {
    setActingId(articleId);
    try {
      const body: Record<string, unknown> = { status: newStatus };
      if (reviewNote !== undefined) body.reviewNote = reviewNote;

      const res = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Artikel berhasil dipindahkan ke "${WORKFLOW_STAGES.find(s => s.id === newStatus)?.label || newStatus}"`);
        fetchArticles();
      } else {
        toast.error(toIndonesianErrorMessage(data.message, "Gagal memperbarui status"));
      }
    } catch {
      toast.error("Gagal memperbarui status");
    } finally {
      setActingId(null);
    }
  };

  const getStageArticles = (stageId: string) =>
    articles.filter((a) => a.status === stageId);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Kanban className="size-5 text-[#B8860B]" weight="bold" />
              Editorial Workflow Board
            </h1>
            <p className="text-xs text-muted-foreground flex items-center flex-wrap gap-1">
              <span>Kelola alur persetujuan liputan dari Jurnalis</span>
              <ArrowRight className="size-3 text-muted-foreground" />
              <span>Editor Review</span>
              <ArrowRight className="size-3 text-muted-foreground" />
              <span>Chief Editor</span>
              <ArrowRight className="size-3 text-muted-foreground" />
              <span>Dipublikasikan.</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-none uppercase tracking-wider text-[10px] font-bold bg-[#B8860B]/10 text-primary border-[#B8860B]/30 px-3 py-1"
            >
              {articles.length} Artikel Aktif
            </Badge>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start pb-6">
          {WORKFLOW_STAGES.map((stage) => {
            const stageArticles = getStageArticles(stage.id);

            return (
              <div
                key={stage.id}
                className="bg-white rounded-none p-4 space-y-4 border border-black/10 shadow-2xs min-h-[520px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${stage.dotClass}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {stage.label}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-none border ${stage.badgeClass}`}>
                    {loading ? "..." : stageArticles.length}
                  </span>
                </div>

                {/* Article Cards */}
                <div className="space-y-3 flex-1">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 rounded-none" />
                    ))
                  ) : stageArticles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border-dashed border border-black/10 bg-[#fafafa]">
                      <FileText className="size-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Kolom Kosong</p>
                    </div>
                  ) : (
                    stageArticles.map((article) => (
                      <div
                        key={article.id}
                        className="p-4 bg-white rounded-none border border-black/10 shadow-2xs space-y-3 hover:border-[#B8860B]/60 hover:shadow-xs transition-all"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B8860B]">
                            {article.categoryName || "BERITA"}
                          </span>
                          <h3 className="font-serif font-bold text-xs sm:text-sm text-foreground line-clamp-2 leading-snug">
                            {article.title}
                          </h3>
                        </div>

                        {article.reviewNote && (
                          <p className="text-[10px] text-red-600 bg-red-50 p-2 rounded border border-red-200">
                            {article.reviewNote}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground pt-2.5 border-t border-black/5">
                          <span>{article.authorName || "Redaksi"}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-muted-foreground" />
                            {article.submittedAt ? timeAgo(article.submittedAt) : timeAgo(article.updatedAt)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5">
                          {stage.id === "submitted" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 rounded-none border-black/15 text-[11px] font-bold uppercase tracking-wider px-2.5 hover:bg-black/5"
                                disabled={actingId === article.id}
                                onClick={() => updateStatus(article.id, "revision_required", "Perlu revisi sebelum dipublikasikan")}
                              >
                                <ArrowCounterClockwise className="size-3 mr-1" />
                                Revisi
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 gap-1 rounded-none bg-primary text-white hover:bg-primary/90 text-[11px] font-bold uppercase tracking-wider px-3 shadow-2xs"
                                disabled={actingId === article.id}
                                onClick={() => updateStatus(article.id, "editorial_review")}
                              >
                                <CheckCircle className="size-3.5" weight="bold" />
                                Review
                              </Button>
                            </>
                          )}
                          {stage.id === "editorial_review" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 rounded-none border-black/15 text-[11px] font-bold uppercase tracking-wider px-2.5 hover:bg-black/5"
                                disabled={actingId === article.id}
                                onClick={() => updateStatus(article.id, "revision_required", "Perlu perbaikan dari penulis")}
                              >
                                <ArrowCounterClockwise className="size-3 mr-1" />
                                Revisi
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 gap-1 rounded-none bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold uppercase tracking-wider px-3 shadow-2xs"
                                disabled={actingId === article.id}
                                onClick={() => updateStatus(article.id, "approved")}
                              >
                                <CheckCircle className="size-3.5" weight="bold" />
                                Setujui
                              </Button>
                            </>
                          )}
                          {stage.id === "revision_required" && (
                            <Link href={`/dashboard/articles/${article.id}/edit`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 rounded-none border-black/15 text-[11px] font-bold uppercase tracking-wider px-2.5 hover:bg-black/5"
                              >
                                <Eye className="size-3 mr-1" />
                                Lihat
                              </Button>
                            </Link>
                          )}
                          {stage.id === "approved" && (
                            <Button
                              size="sm"
                              className="h-7 gap-1 rounded-none bg-primary text-white hover:bg-primary/90 text-[11px] font-bold uppercase tracking-wider px-3 shadow-2xs"
                              disabled={actingId === article.id}
                              onClick={() => updateStatus(article.id, "published")}
                            >
                              Publish
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
