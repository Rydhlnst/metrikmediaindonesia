"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Comment {
  id: number;
  content: string;
  status: string;
  createdAt: string;
  authorName: string | null;
  articleTitle: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  approved: { label: "Disetujui", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  pending: { label: "Menunggu", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  spam: { label: "Spam", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function RecentCommentsTable() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setComments(data.recentComments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Card className="rounded-none border border-black/10 bg-white py-0 shadow-none">
      <CardHeader className="flex items-center justify-between border-b border-black/5 px-6 py-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">Komentar Terbaru</h3>
          <p className="text-xs text-muted-foreground">
            Tanggapan pembaca yang masuk.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-none text-xs text-muted-foreground hover:text-foreground" asChild>
          <Link href="/dashboard/comments">
            Lihat Semua
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-4">
        <div className="divide-y divide-black/5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2 px-6 py-4">
                <div className="h-4 w-1/3 animate-pulse bg-muted/50" />
                <div className="h-3 w-2/3 animate-pulse bg-muted/50" />
              </div>
            ))
          ) : comments.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Belum ada komentar
            </div>
          ) : (
            comments.map((comment) => {
              const status = statusConfig[comment.status] || statusConfig.pending;
              return (
                <div key={comment.id} className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{comment.authorName || "Anonim"}</span>
                    <Badge
                      variant="outline"
                      className={cn("rounded-none border text-[10px] font-medium", status.className)}
                    >
                      {status.label}
                    </Badge>
                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                    {comment.content}
                  </p>
                  <p className="mt-1.5 line-clamp-1 text-[10px] text-muted-foreground">
                    di artikel: <span className="font-medium text-foreground">{comment.articleTitle || "-"}</span>
                  </p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
