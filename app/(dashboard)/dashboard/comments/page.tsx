"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Trash } from "lucide-react";

const comments = [
  { id: "1", user: "Ahmad Fauzi", article: "Indonesia Luncurkan Program Digital", content: "Artikel yang sangat informatif!", status: "pending" as const, createdAt: "2 jam lalu" },
  { id: "2", user: "Dewi Sartika", article: "Pasar Saham Catat Rekor", content: "IHSG makin monster!", status: "pending" as const, createdAt: "3 jam lalu" },
  { id: "3", user: "Rizky Pratama", article: "Timnas U-20 Gemilang", content: "GARUDA!", status: "approved" as const, createdAt: "5 jam lalu" },
  { id: "4", user: "Budi Hartono", article: "Startup AI Raih Pendanaan", content: "Semoga semakin banyak startup lokal", status: "approved" as const, createdAt: "6 jam lalu" },
  { id: "5", user: "SpamBot123", article: "Film Indonesia di Cannes", content: "Buy cheap stuff here...", status: "spam" as const, createdAt: "8 jam lalu" },
];

const statusConfig = {
  approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  spam: { label: "Spam", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export default function CommentsPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-bold">Moderasi Komentar</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="space-y-3">
              {comments.map((comment) => {
                const status = statusConfig[comment.status];
                return (
                  <div key={comment.id} className="border border-border/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">{comment.user}</span>
                          <Badge variant="outline" className={`text-[10px] font-medium rounded-none ${status.className}`}>
                            {status.label}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{comment.createdAt}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {comment.content}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          di: <span className="font-medium text-foreground">{comment.article}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="size-7 text-emerald-600">
                          <Check className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 text-red-600">
                          <X className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 text-destructive">
                          <Trash className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
