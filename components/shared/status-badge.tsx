"use client";

import { cn } from "@/lib/utils";

export const ARTICLE_STATUS_META: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  draft: {
    label: "Draft",
    badgeClass: "bg-slate-500/10 text-slate-700 border-slate-500/30",
    dotClass: "bg-slate-400",
  },
  submitted: {
    label: "Menunggu Review",
    badgeClass: "bg-[#b8860b]/15 text-[#92700a] border-[#b8860b]/40",
    dotClass: "bg-[#b8860b]",
  },
  editorial_review: {
    label: "Sedang Ditinjau Redaksi",
    badgeClass: "bg-blue-500/10 text-blue-800 border-blue-500/30",
    dotClass: "bg-blue-500",
  },
  revision_required: {
    label: "Perlu Revisi",
    badgeClass: "bg-red-500/10 text-red-800 border-red-500/30",
    dotClass: "bg-red-500",
  },
  approved: {
    label: "Disetujui",
    badgeClass: "bg-emerald-500/10 text-emerald-800 border-emerald-500/30",
    dotClass: "bg-emerald-500",
  },
  scheduled: {
    label: "Terjadwal",
    badgeClass: "bg-violet-500/10 text-violet-800 border-violet-500/30",
    dotClass: "bg-violet-500",
  },
  published: {
    label: "Terbit",
    badgeClass: "bg-emerald-600/10 text-emerald-900 border-emerald-600/40",
    dotClass: "bg-emerald-600",
  },
  archived: {
    label: "Diarsipkan",
    badgeClass: "bg-slate-500/10 text-slate-600 border-slate-500/30",
    dotClass: "bg-slate-500",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const meta = ARTICLE_STATUS_META[status] ?? {
    label: status?.toUpperCase() || "UNKNOWN",
    badgeClass: "bg-slate-500/10 text-slate-700 border-slate-500/30",
    dotClass: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        meta.badgeClass,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </span>
  );
}
