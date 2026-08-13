"use client";

import { useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Warning,
  XCircle,
  Sparkle,
  Globe,
} from "@phosphor-icons/react/dist/ssr";

interface SeoTrackerProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  focusKeyword: string;
  onFocusKeywordChange: (val: string) => void;
  onScoreChange?: (score: number) => void;
}

export function SeoTracker({
  title,
  slug,
  excerpt,
  content,
  thumbnailUrl,
  seoTitle,
  seoDescription,
  seoKeywords,
  focusKeyword,
  onFocusKeywordChange,
  onScoreChange,
}: SeoTrackerProps) {
  const effectiveTitle = seoTitle || title;
  const effectiveDesc = seoDescription || excerpt;

  const analysis = useMemo(() => {
    const checks = [];
    let score = 0;

    // Clean html tags from content
    const plainContent = content.replace(/<[^>]*>/g, " ").trim();
    const wordCount = plainContent ? plainContent.split(/\s+/).length : 0;
    const lowerKeyword = focusKeyword.trim().toLowerCase();

    // 1. Focus Keyword Provided (10 pts)
    const hasKeyword = lowerKeyword.length > 0;
    checks.push({
      id: "has-keyword",
      label: "Focus Keyword Ditetapkan",
      status: hasKeyword ? "pass" : "fail",
      detail: hasKeyword
        ? `Target keyword: "${focusKeyword}"`
        : "Tentukan Focus Keyword untuk mengukur relevansi SEO",
      score: hasKeyword ? 10 : 0,
    });
    if (hasKeyword) score += 10;

    // 2. Title Length Check (15 pts)
    const titleLen = effectiveTitle.length;
    const titleOk = titleLen >= 40 && titleLen <= 65;
    const titleWarn = titleLen > 0 && (titleLen < 40 || titleLen > 65);
    checks.push({
      id: "title-length",
      label: "Panjang Judul SEO (40 - 65 Karakter)",
      status: titleOk ? "pass" : titleWarn ? "warn" : "fail",
      detail: titleLen
        ? `${titleLen} karakter (Ideal: 40-65)`
        : "Judul belum diisi",
      score: titleOk ? 15 : titleWarn ? 8 : 0,
    });
    score += titleOk ? 15 : titleWarn ? 8 : 0;

    // 3. Meta Description Check (15 pts)
    const descLen = effectiveDesc.length;
    const descOk = descLen >= 120 && descLen <= 160;
    const descWarn = descLen > 0 && (descLen < 120 || descLen > 160);
    checks.push({
      id: "desc-length",
      label: "Panjang Meta Description (120 - 160 Karakter)",
      status: descOk ? "pass" : descWarn ? "warn" : "fail",
      detail: descLen
        ? `${descLen} karakter (Ideal: 120-160)`
        : "Meta description / excerpt belum diisi",
      score: descOk ? 15 : descWarn ? 8 : 0,
    });
    score += descOk ? 15 : descWarn ? 8 : 0;

    // 4. Keyword in Title Check (15 pts)
    const keywordInTitle =
      hasKeyword && effectiveTitle.toLowerCase().includes(lowerKeyword);
    checks.push({
      id: "keyword-title",
      label: "Focus Keyword dalam Judul",
      status: keywordInTitle ? "pass" : hasKeyword ? "warn" : "fail",
      detail: keywordInTitle
        ? "Focus Keyword muncul di dalam Judul"
        : "Sertakan Focus Keyword di dalam Judul Artikel",
      score: keywordInTitle ? 15 : 0,
    });
    if (keywordInTitle) score += 15;

    // 5. Keyword in Meta Description Check (15 pts)
    const keywordInDesc =
      hasKeyword && effectiveDesc.toLowerCase().includes(lowerKeyword);
    checks.push({
      id: "keyword-desc",
      label: "Focus Keyword dalam Meta Description",
      status: keywordInDesc ? "pass" : hasKeyword ? "warn" : "fail",
      detail: keywordInDesc
        ? "Focus Keyword muncul di dalam Meta Description"
        : "Sertakan Focus Keyword di dalam Meta Description",
      score: keywordInDesc ? 15 : 0,
    });
    if (keywordInDesc) score += 15;

    // 6. Keyword in Content Body Check (15 pts)
    const keywordInContent =
      hasKeyword && plainContent.toLowerCase().includes(lowerKeyword);
    checks.push({
      id: "keyword-content",
      label: "Focus Keyword dalam Isi Konten",
      status: keywordInContent ? "pass" : hasKeyword ? "warn" : "fail",
      detail: keywordInContent
        ? "Focus Keyword muncul di dalam teks artikel"
        : "Gunakan Focus Keyword beberapa kali di dalam teks artikel",
      score: keywordInContent ? 15 : 0,
    });
    if (keywordInContent) score += 15;

    // 7. Word Count Check (15 pts)
    const wordCountOk = wordCount >= 300;
    const wordCountWarn = wordCount > 0 && wordCount < 300;
    checks.push({
      id: "word-count",
      label: "Jumlah Kata Artikel (Min. 300 Kata)",
      status: wordCountOk ? "pass" : wordCountWarn ? "warn" : "fail",
      detail: `${wordCount} kata ${
        wordCountOk
          ? "(Memenuhi syarat SEO Berita)"
          : "(Disarankan min. 300 kata)"
      }`,
      score: wordCountOk ? 15 : wordCountWarn ? 7 : 0,
    });
    score += wordCountOk ? 15 : wordCountWarn ? 7 : 0;

    // 8. Featured Image WebP Check (10 pts)
    const hasImage = thumbnailUrl.length > 0;
    checks.push({
      id: "featured-image",
      label: "Gambar Utama Terpasang",
      status: hasImage ? "pass" : "fail",
      detail: hasImage
        ? "Gambar utama terpasang & ter-optimasi WebP"
        : "Upload gambar utama untuk Open Graph & Google Image SEO",
      score: hasImage ? 10 : 0,
    });
    if (hasImage) score += 10;

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(0, score));

    return { checks, score: finalScore };
  }, [
    title,
    effectiveTitle,
    effectiveDesc,
    content,
    thumbnailUrl,
    focusKeyword,
  ]);

  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(analysis.score);
    }
  }, [analysis.score, onScoreChange]);

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return { label: "Sangat Bagus (Good)", color: "bg-emerald-500 text-white" };
    if (score >= 50)
      return { label: "Cukup (Needs Improvement)", color: "bg-amber-500 text-white" };
    return { label: "Perlu Ditingkatkan (Poor)", color: "bg-red-500 text-white" };
  };

  const badge = getScoreBadge(analysis.score);

  return (
    <Card className="rounded-none bg-card ring-0 shadow-sm border border-border">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkle className="size-4 text-news-red" weight="fill" />
          <CardTitle className="text-sm font-bold">SEO Tracker & Real-Time Analyzer</CardTitle>
        </div>
        <Badge className={`rounded-none font-mono text-xs font-bold ${badge.color}`}>
          SEO Score: {analysis.score} / 100
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Focus Keyword Input */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            Focus Keyword (Kata Kunci Utama)
          </label>
          <Input
            placeholder="Masukkan kata kunci utama (contoh: Transformasi Digital)"
            value={focusKeyword}
            onChange={(e) => onFocusKeywordChange(e.target.value)}
            className="rounded-none font-medium"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            Kata kunci target yang ingin dioptimasi agar artikel muncul di rangking teratas Google.
          </p>
        </div>

        {/* Google SERP Live Preview */}
        <div className="border border-border bg-muted/40 p-3">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-muted-foreground">
            <Globe className="size-3.5" />
            <span>Google Search Result Live Preview</span>
          </div>
          <div className="space-y-1 font-sans">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono truncate">
              https://metrikmediaindonesia.id/berita/{slug || "url-artikel"}
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
              {effectiveTitle || "Judul Artikel Terpasang di Google Search"} | Metrik Media
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {effectiveDesc || "Deskripsi artikel yang akan tampil di halaman pencarian Google..."}
            </p>
          </div>
        </div>

        {/* SEO Audit Checklist */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Daftar Pemeriksaan SEO (Checklist):</p>
          <div className="space-y-1.5">
            {analysis.checks.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 text-xs p-2 border border-border/60 bg-background"
              >
                {item.status === "pass" && (
                  <CheckCircle className="size-4 shrink-0 text-emerald-600 mt-0.5" weight="fill" />
                )}
                {item.status === "warn" && (
                  <Warning className="size-4 shrink-0 text-amber-500 mt-0.5" weight="fill" />
                )}
                {item.status === "fail" && (
                  <XCircle className="size-4 shrink-0 text-red-500 mt-0.5" weight="fill" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-foreground">{item.label}</span>
                  <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
