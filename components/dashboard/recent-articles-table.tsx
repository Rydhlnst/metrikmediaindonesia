"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface Article {
  id: number;
  title: string;
  status: string;
  viewCount: number;
  publishedAt: string | null;
  categoryName: string | null;
  categoryColor: string | null;
  authorName: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  published: { label: "Published", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  scheduled: { label: "Scheduled", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

export function RecentArticlesTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.recentArticles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Card className="rounded-none bg-card ring-0 shadow-sm">
      <CardHeader className="flex items-center justify-between px-6 py-4">
        <CardTitle className="text-lg font-bold">Artikel Terbaru</CardTitle>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" asChild>
          <Link href="/dashboard/articles">
            Lihat Semua
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        <div className="border rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted">
                <TableHead className="h-10 text-xs font-semibold">Judul</TableHead>
                <TableHead className="h-10 text-xs font-semibold">Kategori</TableHead>
                <TableHead className="h-10 text-xs font-semibold">Penulis</TableHead>
                <TableHead className="h-10 text-xs font-semibold">Status</TableHead>
                <TableHead className="h-10 text-xs font-semibold text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="py-3">
                      <div className="h-4 animate-pulse rounded bg-muted/50" />
                    </TableCell>
                  </TableRow>
                ))
              ) : articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada artikel
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article) => {
                  const status = statusConfig[article.status] || statusConfig.draft;
                  return (
                    <TableRow key={article.id} className="border-border/50">
                      <TableCell className="py-3">
                        <span className="line-clamp-1 font-medium text-sm">
                          {article.title}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: article.categoryColor || "#666" }}
                        >
                          {article.categoryName || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground">
                        {article.authorName || "-"}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] font-medium rounded-none", status.className)}
                        >
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <Eye className="size-3" />
                          {(article.viewCount || 0).toLocaleString("id-ID")}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
