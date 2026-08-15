"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { StatGrid } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "@phosphor-icons/react/dist/ssr";

const ViewsChart = dynamic(() => import("@/components/dashboard/charts").then((m) => m.ViewsChart), { ssr: false });
const CategoryBarChart = dynamic(() => import("@/components/dashboard/charts").then((m) => m.CategoryBarChart), { ssr: false });

interface TopArticle {
  id: number;
  title: string;
  viewCount: number;
  slug: string;
  categoryName: string | null;
  categoryColor: string | null;
}

export default function AnalyticsPage() {
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setTopArticles(data.topArticles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <StatGrid />

        <section className="grid gap-6 xl:grid-cols-4">
          <Card className="rounded-none border border-black/10 bg-white shadow-2xs xl:col-span-3">
            <CardHeader className="border-b border-black/5 px-6 py-4">
              <CardTitle className="text-base font-bold text-foreground">Views per Bulan</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ViewsChart />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
            <CardHeader className="border-b border-black/5 px-6 py-4">
              <CardTitle className="text-base font-bold text-foreground">Per Kategori</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <CategoryBarChart />
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="border-b border-black/5 px-6 py-4">
            <CardTitle className="text-base font-bold text-foreground">Artikel Terpopuler</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">#</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Judul</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Kategori</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4} className="py-3">
                          <div className="h-4 animate-pulse rounded bg-muted/50" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : topArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        Belum ada artikel
                      </TableCell>
                    </TableRow>
                  ) : (
                    topArticles.map((article, index) => (
                      <TableRow key={article.id} className="border-black/5 hover:bg-black/2">
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                          {index + 1}
                        </TableCell>
                        <TableCell className="py-3 font-medium text-sm line-clamp-1">
                          {article.title}
                        </TableCell>
                        <TableCell className="py-3">
                          <span
                            className="text-xs font-semibold"
                            style={{ color: article.categoryColor || "#B8860B" }}
                          >
                            {article.categoryName || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground font-mono">
                            <Eye className="size-3" />
                            {(article.viewCount || 0).toLocaleString("id-ID")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
