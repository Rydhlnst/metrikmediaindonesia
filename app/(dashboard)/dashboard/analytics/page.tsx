"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { StatGrid } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewsChart } from "@/components/dashboard/charts";
import { CategoryBarChart } from "@/components/dashboard/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const topArticles = [
  { title: "Timnas Indonesia Tampil Gemilang di Piala Dunia U-20", views: 28500, change: "+24.5%" },
  { title: "Film Indonesia Raih Penghargaan di Cannes 2026", views: 18200, change: "+12.3%" },
  { title: "Indonesia Luncurkan Program Transformasi Digital", views: 15420, change: "+8.7%" },
  { title: "Pemerintah Umumkan Kenaikan UMR 2027", views: 22100, change: "+15.2%" },
  { title: "Elon Musk Umumkan Starship Mendarat di Bulan", views: 19800, change: "+11.1%" },
];

export default function AnalyticsPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto grid gap-4">
        <StatGrid />

        <section className="grid gap-3 xl:grid-cols-4">
          <Card className="rounded-none bg-card ring-0 shadow-sm xl:col-span-3">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg font-bold">Views per Bulan</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <div className="h-80">
                <ViewsChart />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none bg-card ring-0 shadow-sm">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg font-bold">Per Kategori</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <div className="h-80">
                <CategoryBarChart />
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-bold">Artikel Terpopuler</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">#</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Judul</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Views</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Perubahan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topArticles.map((article, index) => (
                    <TableRow key={index} className="border-border/50">
                      <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-3 font-medium text-sm line-clamp-1">
                        {article.title}
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs text-muted-foreground">
                        {article.views.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                          <ArrowUpRight className="size-3" />
                          {article.change}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
