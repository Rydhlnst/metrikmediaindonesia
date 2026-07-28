"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recentComments } from "./data";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

const statusConfig = {
  approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  spam: { label: "Spam", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function RecentCommentsTable() {
  return (
    <Card className="rounded-none bg-card ring-0 shadow-sm">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg font-bold">Komentar Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        <div className="space-y-4">
          {recentComments.map((comment) => {
            const status = statusConfig[comment.status];
            return (
              <div
                key={comment.id}
                className="border border-border/50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{comment.user}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-medium rounded-none", status.className)}
                      >
                        {status.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {comment.content}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="line-clamp-1">
                        di artikel: <span className="font-medium text-foreground">{comment.article}</span>
                      </span>
                      <span>&middot;</span>
                      <span>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
