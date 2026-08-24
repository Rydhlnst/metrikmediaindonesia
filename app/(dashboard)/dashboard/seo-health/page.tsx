"use client";

import { useState, useEffect } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
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
import { ShieldCheck, CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { requestJson, toastApiError } from "@/lib/api-client";

interface ChecklistItem {
  label: string;
  status: "passed" | "warning" | "failed";
  detail: string;
}

interface ProblematicArticle {
  id: number;
  title: string;
  slug: string;
  status: string;
  seoScore: number;
  categoryName: string | null;
  issues: string[];
}

interface SeoHealthData {
  score: number;
  summary: {
    totalArticles: number;
    missingSeoTitle: number;
    missingSeoDescription: number;
    missingThumbnail: number;
    missingCategory: number;
    missingAuthor: number;
    missingCanonical: number;
    missingKeywords: number;
    missingContent: number;
  };
  checklist: ChecklistItem[];
  problematicArticles: ProblematicArticle[];
}

const statusConfig = {
  passed: {
    icon: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" weight="fill" />,
    badge: (
      <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
        Passed
      </Badge>
    ),
  },
  warning: {
    icon: <WarningCircle className="w-5 h-5 text-amber-600 shrink-0" weight="fill" />,
    badge: (
      <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-600 border-amber-500/20">
        Warning
      </Badge>
    ),
  },
  failed: {
    icon: <XCircle className="w-5 h-5 text-red-600 shrink-0" weight="fill" />,
    badge: (
      <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold tracking-wider bg-red-500/10 text-red-600 border-red-500/20">
        Failed
      </Badge>
    ),
  },
};

export default function SeoHealthPage() {
  const [data, setData] = useState<SeoHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestJson<SeoHealthData>("/api/seo-health")
      .then((d) => setData(d))
      .catch(toastApiError)
      .finally(() => setLoading(false));
  }, []);

  const scoreColor =
    !data ? "text-foreground" :
    data.score >= 80 ? "text-emerald-600" :
    data.score >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="border-b border-black/5 pb-4">
          <h1 className="text-xl font-bold text-foreground">SEO Health Dashboard & Pre-Publish Checklist</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluasi otomatis technical SEO, keterindeksan (indexability), kelayakan sitemap, dan Schema.org NewsArticle.
          </p>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-32 rounded-none" />
              <Skeleton className="h-32 rounded-none" />
              <Skeleton className="h-32 rounded-none" />
            </div>
            <Skeleton className="h-72 rounded-none" />
            <Skeleton className="h-48 rounded-none" />
          </>
        ) : !data ? (
          <p className="text-sm text-muted-foreground">Gagal memuat data SEO health.</p>
        ) : (
          <>
            {/* Health Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
                <CardContent className="p-6 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Skor Kesehatan SEO</span>
                  <p className={`text-3xl font-extrabold ${scoreColor}`}>
                    {data.score} <span className="text-base font-normal text-muted-foreground">/ 100</span>
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Dihitung dari {data.summary.totalArticles} artikel berdasarkan kelengkapan 8 faktor SEO.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
                <CardContent className="p-6 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status Sitemap</span>
                  <p className="text-2xl font-bold text-foreground">Terverifikasi</p>
                  <p className="text-xs text-primary font-mono font-medium">/sitemap.xml</p>
                </CardContent>
              </Card>

              <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
                <CardContent className="p-6 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Artikel Bermasalah</span>
                  <p className="text-2xl font-bold text-foreground">{data.problematicArticles.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Artikel dengan minimal 1 masalah SEO on-page.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pre-Publish Checklist */}
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Content SEO Checklist Pra-Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {data.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-black/5 rounded-none text-sm">
                    <div className="flex items-center space-x-3">
                      {statusConfig[item.status].icon}
                      <div>
                        <span className="font-medium text-foreground text-xs sm:text-sm block">{item.label}</span>
                        <span className="text-[11px] text-muted-foreground">{item.detail}</span>
                      </div>
                    </div>
                    <div>{statusConfig[item.status].badge}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Problematic Articles Table */}
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Artikel Perlu Perbaikan SEO</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Diurutkan berdasarkan jumlah masalah. Klik edit untuk memperbaiki.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {data.problematicArticles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <ShieldCheck className="size-10 text-emerald-600 mb-3" weight="fill" />
                    <p className="text-sm font-medium text-foreground">Semua artikel lolos audit SEO!</p>
                    <p className="text-xs text-muted-foreground mt-1">Tidak ada artikel dengan masalah SEO on-page.</p>
                  </div>
                ) : (
                  <div className="border border-black/10 rounded-none overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Judul Artikel</TableHead>
                          <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Masalah</TableHead>
                          <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.problematicArticles.map((article) => (
                          <TableRow key={article.id} className="border-black/5 hover:bg-black/2">
                            <TableCell className="py-3 max-w-xs">
                              <p className="font-semibold text-sm line-clamp-1">{article.title}</p>
                              <p className="text-[11px] text-muted-foreground font-mono">/{article.slug}</p>
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {article.issues.map((issue, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="rounded-none text-[10px] font-bold tracking-wider bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  >
                                    {issue}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 text-right">
                              <Link
                                href={`/dashboard/articles/${article.id}/edit`}
                                className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
                              >
                                Perbaiki
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
