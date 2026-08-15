"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  published: { label: "Tayang", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  draft: { label: "Draf", className: "bg-muted text-muted-foreground" },
  scheduled: { label: "Terjadwal", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
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
    <Card className="rounded-none border border-black/10 bg-white py-0 shadow-none">
      <CardHeader className="flex items-center justify-between border-b border-black/5 px-6 py-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">Artikel Terbaru</h3>
          <p className="text-xs text-muted-foreground">
            Berita yang baru saja dibuat tim Anda.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-none text-xs text-muted-foreground hover:text-foreground" asChild>
          <Link href="/dashboard/articles">
            Lihat Semua
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-black/5">
              <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Judul</TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Kategori</TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Penulis</TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dibaca</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-black/5">
                  <TableCell colSpan={5} className="py-3.5">
                    <div className="h-4 animate-pulse bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : articles.length === 0 ? (
              <TableRow className="border-black/5">
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  Belum ada artikel
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => {
                const status = statusConfig[article.status] || statusConfig.draft;
                return (
                  <TableRow key={article.id} className="border-black/5">
                    <TableCell className="max-w-56 py-3.5 pl-6">
                      <span className="line-clamp-1 text-sm font-medium text-foreground">
                        {article.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: article.categoryColor || "#666" }}
                      >
                        {article.categoryName || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs text-muted-foreground">
                      {article.authorName || "-"}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Badge
                        variant="outline"
                        className={cn("rounded-none border text-[10px] font-medium", status.className)}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3.5 pr-6 text-right">
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
      </CardContent>
    </Card>
  );
}
