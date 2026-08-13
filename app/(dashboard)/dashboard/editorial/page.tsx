import { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/mock-data";
import { FileEdit, CheckCircle2, Clock, AlertCircle, Eye, ChevronRight, UserCheck, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Workflow Board - Metrik Media CMS",
  description: "Manajemen alur kerja redaksi, peninjauan artikel jurnalis, persetujuan editor, dan penjadwalan publikasi.",
};

const WORKFLOW_STAGES = [
  { id: "draft", label: "Draft", color: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200" },
  { id: "submitted", label: "Pending Review", color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300" },
  { id: "editorial_review", label: "Editorial Review", color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300" },
  { id: "revision_required", label: "Revision Required", color: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300" },
  { id: "approved", label: "Approved", color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300" },
  { id: "scheduled", label: "Scheduled", color: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300" },
  { id: "published", label: "Published", color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300" },
];

export default function EditorialWorkflowPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-blue-600" />
            Editorial Workflow Board
          </h1>
          <p className="text-xs text-slate-500">
            Kelola alur persetujuan liputan dari Jurnalis &rarr; Editor Review &rarr; Chief Editor &rarr; Dipublikasikan.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            Mode Akses: Editor-in-Chief
          </span>
        </div>
      </div>

      {/* Kanban / Stage Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {WORKFLOW_STAGES.slice(1, 5).map((stage) => {
          const items = articles.slice(0, 3);
          return (
            <div key={stage.id} className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${stage.color}`}>
                  {stage.label} ({items.length})
                </span>
              </div>

              <div className="space-y-3">
                {items.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        {article.category.name}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                        {article.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-900">
                      <span>{article.author.name}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 2j lalu
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-1 pt-1">
                      <Link
                        href={`/dashboard/articles/revisions/${article.id}`}
                        className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 font-medium"
                      >
                        Revisi
                      </Link>
                      <button className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 font-bold">
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
