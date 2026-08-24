"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  PenNib,
  NewspaperClipping,
  Eye,
  HourglassMedium,
  CheckCircle,
  ArrowRight,
  CircleNotch,
  ShieldCheck,
  PencilSimple,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";

interface MyArticle {
  id: number;
  title: string;
  status: string;
  viewCount: number;
  submittedAt: string | null;
  createdAt: string;
  categoryName: string | null;
  reviewNote: string | null;
}

interface SessionUser {
  name?: string;
  authorId?: number;
}

export function ContributorOverview({ user }: { user: SessionUser | null }) {
  const [articles, setArticles] = useState<MyArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyArticles = useCallback(async () => {
    if (!user?.authorId) {
      setIsLoading(false);
      return;
    }
    try {
      const params = new URLSearchParams({
        authorId: String(user.authorId),
        limit: "5",
      });
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      if (res.ok) setArticles(data.data || []);
    } catch {
      // biarkan kosong, pesan error via toast tidak kritis di dashboard
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    queueMicrotask(() => fetchMyArticles());
  }, [fetchMyArticles]);

  const totalViews = articles.reduce((acc, a) => acc + (a.viewCount || 0), 0);
  const pendingCount = articles.filter((a) =>
    ["submitted", "editorial_review"].includes(a.status)
  ).length;
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const revisionCount = articles.filter((a) => a.status === "revision_required").length;

  const stats = [
    {
      label: "Artikel Saya",
      value: articles.length,
      icon: NewspaperClipping,
      iconClass: "text-[#b8860b]",
    },
    {
      label: "Menunggu Review",
      value: pendingCount,
      icon: HourglassMedium,
      iconClass: "text-amber-600",
    },
    {
      label: "Sudah Terbit",
      value: publishedCount,
      icon: CheckCircle,
      iconClass: "text-emerald-600",
    },
    {
      label: "Total Dibaca",
      value: totalViews.toLocaleString("id-ID"),
      icon: Eye,
      iconClass: "text-blue-600",
    },
  ];

  return (
    <div className="w-full flex-1 space-y-8">
      {/* Sambutan */}
      <section className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Halo, {user?.name?.split(" ")[0] || "Kontributor"} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Tulis dan kirim berita Anda — tim redaksi Metrik Media Indonesia akan
          memeriksa sebelum dipublikasikan.
        </p>
      </section>

      {/* Banner Revisi */}
      {revisionCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-red-500/30 border-l-4 border-l-red-500 bg-red-500/5 p-4">
          <div className="flex items-start gap-3">
            <WarningCircle className="size-5 shrink-0 text-red-600" weight="bold" />
            <div>
              <p className="text-sm font-bold text-red-800">
                {revisionCount} artikel perlu direvisi
              </p>
              <p className="text-xs text-red-700/80">
                Redaksi meminta perbaikan sebelum artikel Anda bisa terbit.
              </p>
            </div>
          </div>
          <Link href="/dashboard/my-articles?status=revision_required">
            <Button
              size="sm"
              className="gap-1.5 rounded-none bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
            >
              Lihat Catatan
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* CTA Tulis Berita */}
      <Link href="/dashboard/articles/new" className="block group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-black/10 border-l-4 border-l-[#b8860b] bg-[#111827] p-6 text-white transition-colors group-hover:bg-[#1a2332]">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center border border-[#b8860b]/40 bg-[#b8860b]/10">
              <PenNib className="size-6 text-[#f9dc5c]" weight="bold" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Punya berita untuk dibagikan?
              </h2>
              <p className="mt-0.5 max-w-lg text-xs leading-relaxed text-gray-300">
                Tulis liputan Anda, lampirkan foto, lalu kirim ke meja redaksi.
                Artikel akan tayang setelah disetujui editor.
              </p>
            </div>
          </div>
          <Button className="shrink-0 gap-2 rounded-none bg-[#b8860b] text-white hover:bg-[#92700a] font-bold uppercase tracking-wider text-xs px-5 py-2.5 border border-[#92700a]">
            Tulis Berita Baru
            <ArrowRight className="size-4" weight="bold" />
          </Button>
        </div>
      </Link>

      {/* Statistik Pribadi */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Statistik Saya
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center border border-black/10 bg-black/[0.03]">
                  <stat.icon className={`size-5 ${stat.iconClass}`} weight="bold" />
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Artikel Terbaru Saya */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Artikel Terbaru Saya
          </h2>
          <Link
            href="/dashboard/my-articles"
            className="flex items-center gap-1 text-xs font-bold text-[#b8860b] hover:text-[#92700a]"
          >
            Lihat Semua
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <CircleNotch className="size-6 animate-spin text-[#b8860b]" />
              </div>
            ) : articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
                <NewspaperClipping className="size-10 text-muted-foreground/40" />
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Belum ada artikel
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Mulai tulis berita pertama Anda dan kirim ke redaksi.
                  </p>
                </div>
                <Link href="/dashboard/articles/new">
                  <Button className="gap-2 rounded-none bg-[#b8860b] hover:bg-[#92700a] text-white font-bold uppercase tracking-wider text-xs px-4 py-2">
                    <PenNib className="size-3.5" weight="bold" />
                    Mulai Menulis
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-black/[0.02] transition-colors"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="line-clamp-1 text-sm font-bold text-foreground">
                        {article.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <StatusBadge status={article.status} />
                        {article.categoryName && (
                          <span className="font-semibold uppercase tracking-wider text-[#b8860b]">
                            {article.categoryName}
                          </span>
                        )}
                        <span>
                          {new Date(
                            article.submittedAt || article.createdAt
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {article.status === "published" && (
                        <span className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700">
                          <Eye className="size-3.5" />
                          {article.viewCount.toLocaleString("id-ID")}
                        </span>
                      )}
                      {["draft", "revision_required"].includes(article.status) && (
                        <Link href={`/dashboard/articles/${article.id}/edit`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 rounded-none border-black/15 text-[11px] font-bold uppercase tracking-wider hover:bg-black/5"
                          >
                            <PencilSimple className="size-3" />
                            {article.status === "revision_required" ? "Perbaiki" : "Lanjutkan"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Info alur */}
      <section className="flex items-start gap-3 border border-black/10 bg-white p-4">
        <ShieldCheck className="size-5 shrink-0 text-[#b8860b]" weight="bold" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Cara kerjanya:</strong> Artikel
          yang Anda kirim masuk ke antrean <em>Menunggu Review</em>. Editor akan
          memeriksa dan bisa meminta revisi atau langsung menyetujui. Anda akan
          menerima notifikasi setiap ada perkembangan.
        </p>
      </section>
    </div>
  );
}
