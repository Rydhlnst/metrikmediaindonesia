"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewspaperClipping, ChartBar, Users, FolderOpen } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface StatsData {
  totalArticles: number;
  totalViews: number;
  activeAuthors: number;
  totalCategories: number;
}

export function StatGrid() {
  const [data, setData] = useState<StatsData>({
    totalArticles: 0,
    totalViews: 0,
    activeAuthors: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.stats) {
          setData(resData.stats);
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: "Total Artikel Berita",
      value: data.totalArticles.toLocaleString("id-ID"),
      detail: "Terpublikasi & Draft",
      icon: NewspaperClipping,
      tone: "bg-news-red",
    },
    {
      label: "Total Views Pembaca",
      value: data.totalViews.toLocaleString("id-ID"),
      detail: "Total akumulasi pembaca",
      icon: ChartBar,
      tone: "bg-blue-500",
    },
    {
      label: "Penulis & Redaksi",
      value: data.activeAuthors.toLocaleString("id-ID"),
      detail: "Tim Jurnalis Aktif",
      icon: Users,
      tone: "bg-emerald-500",
    },
    {
      label: "Kategori Berita",
      value: data.totalCategories.toLocaleString("id-ID"),
      detail: "Kategori aktif",
      icon: FolderOpen,
      tone: "bg-purple-500",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="min-h-28 rounded-none bg-card py-4 ring-0 shadow-sm"
        >
          <CardHeader className="flex items-center gap-2 px-4 pb-2">
            <div
              className={cn(
                "flex items-center justify-center p-2 text-white",
                stat.tone
              )}
            >
              <stat.icon className="size-5" />
            </div>
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex flex-col mt-auto">
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            <div className="mt-2 text-xs text-muted-foreground">{stat.detail}</div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
