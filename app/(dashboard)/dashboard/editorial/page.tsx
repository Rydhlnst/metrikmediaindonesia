import { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/mock-data";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Kanban,
  Clock,
  CheckCircle,
  ArrowCounterClockwise,
  ArrowRight,
  Eye,
  FileText,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Editorial Workflow Board - Metrik Media CMS",
  description: "Manajemen alur kerja redaksi, peninjauan artikel jurnalis, persetujuan editor, dan penjadwalan publikasi.",
};

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

export default function EditorialWorkflowPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header Section */}
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
              Mode Akses: Editor-in-Chief
            </Badge>
          </div>
        </div>

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start pb-6">
          {WORKFLOW_STAGES.map((stage, sIdx) => {
            const stageArticles = sIdx === 2 ? articles.slice(0, 1) : articles.slice(0, 3);

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
                    {stageArticles.length}
                  </span>
                </div>

                {/* Article Cards Container */}
                <div className="space-y-3 flex-1">
                  {stageArticles.length === 0 ? (
                    <EmptyState
                      compact
                      icon={FileText}
                      title="Kolom Kosong"
                      description="Belum ada artikel di tahap ini."
                      className="border-dashed border-black/10 bg-[#fafafa] py-8"
                    />
                  ) : (
                    stageArticles.map((article) => (
                      <div
                        key={article.id}
                        className="p-4 bg-white rounded-none border border-black/10 shadow-2xs space-y-3 hover:border-[#B8860B]/60 hover:shadow-xs transition-all"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B8860B]">
                            {article.category?.name || "BERITA"}
                          </span>
                          <h3 className="font-serif font-bold text-xs sm:text-sm text-foreground line-clamp-2 leading-snug">
                            {article.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground pt-2.5 border-t border-black/5">
                          <span>{article.author?.name || "Redaksi"}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-muted-foreground" /> 2j lalu
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5">
                          <Link href={`/dashboard/articles/revisions/${article.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 rounded-none border-black/15 text-[11px] font-bold uppercase tracking-wider px-2.5 hover:bg-black/5"
                            >
                              Revisi
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="h-7 gap-1 rounded-none bg-primary text-white hover:bg-primary/90 text-[11px] font-bold uppercase tracking-wider px-3 shadow-2xs"
                          >
                            <CheckCircle className="size-3.5" weight="bold" />
                            Approve
                          </Button>
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
