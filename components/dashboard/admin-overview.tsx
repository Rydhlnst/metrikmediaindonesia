"use client";

import dynamic from "next/dynamic";
import { StatGrid } from "@/components/dashboard/stat-card";
import { RecentArticlesTable } from "@/components/dashboard/recent-articles-table";
import { RecentCommentsTable } from "@/components/dashboard/recent-comments-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
const ViewsChart = dynamic(() => import("@/components/dashboard/charts").then((m) => m.ViewsChart), { loading: () => <div className="h-full animate-pulse bg-muted/30" /> });
const CategoryBarChart = dynamic(() => import("@/components/dashboard/charts").then((m) => m.CategoryBarChart), { loading: () => <div className="h-full animate-pulse bg-muted/30" /> });

export function AdminOverview() {
  return (
    <div className="w-full flex-1 space-y-8">
      <section className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Ringkasan Beranda
        </h1>
        <p className="text-sm text-muted-foreground">
          Semua kondisi situs berita Anda dalam satu layar — angka penting,
          grafik pembaca, dan aktivitas terbaru.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Angka Penting
        </h2>
        <StatGrid />
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Grafik
        </h2>
        <div className="grid gap-6 xl:grid-cols-4">
          <Card className="rounded-none border border-black/10 bg-white shadow-none xl:col-span-3">
            <CardHeader className="space-y-1 border-b border-black/5 px-6 py-5">
              <h3 className="text-base font-bold text-foreground">
                Pembaca Artikel
              </h3>
              <p className="text-xs text-muted-foreground">
                Jumlah orang yang membaca artikel tiap bulan. Arahkan kursor
                ke garis untuk melihat angkanya.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72">
                <ViewsChart />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border border-black/10 bg-white shadow-none">
            <CardHeader className="space-y-1 border-b border-black/5 px-6 py-5">
              <h3 className="text-base font-bold text-foreground">
                Artikel per Kategori
              </h3>
              <p className="text-xs text-muted-foreground">
                Kategori mana yang paling banyak beritanya.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72">
                <CategoryBarChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Aktivitas Terbaru
        </h2>
        <div className="grid gap-6 xl:grid-cols-2">
          <RecentArticlesTable />
          <RecentCommentsTable />
        </div>
      </section>
    </div>
  );
}
