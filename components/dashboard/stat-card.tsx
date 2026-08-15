"use client";

import { useState, useEffect } from "react";
import { NewspaperClipping, ChartBar, Users, FolderOpen } from "@phosphor-icons/react/dist/ssr";

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
      label: "Artikel",
      detail: "Semua berita yang sudah dibuat",
      value: data.totalArticles,
      icon: NewspaperClipping,
    },
    {
      label: "Dibaca",
      detail: "Total kali artikel Anda dibaca orang",
      value: data.totalViews,
      icon: ChartBar,
    },
    {
      label: "Penulis",
      detail: "Jumlah penulis dan redaksi aktif",
      value: data.activeAuthors,
      icon: Users,
    },
    {
      label: "Kategori",
      detail: "Kelompok rubrik berita Anda",
      value: data.totalCategories,
      icon: FolderOpen,
    },
  ];

  return (
    <section className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-2 bg-white p-6 transition-colors hover:bg-[#B8860B]/[0.03]"
        >
          <div className="flex items-center gap-2.5">
            <stat.icon className="size-4 shrink-0 text-[#B8860B]" weight="bold" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-foreground tabular-nums">
            {stat.value.toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-muted-foreground">{stat.detail}</div>
        </div>
      ))}
    </section>
  );
}
