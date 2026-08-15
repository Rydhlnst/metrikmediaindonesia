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
    const wordCount = plainContent ? plainContent.split(/\s+/).filter(Boolean).length : 0;
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
        : "Judul artikel masih kosong",
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
        ? "Focus Keyword ditemukan di dalam Judul"
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
        ? "Focus Keyword ditemukan di dalam Meta Description"
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
        : "Gunakan Focus Keyword beberapa kali di dalam teks naskah",
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
          ? "(Memenuhi standar indeks Google Berita)"
          : "(Disarankan minimal 300 kata untuk liputan mendalam)"
      }`,
      score: wordCountOk ? 15 : wordCountWarn ? 7 : 0,
    });
    score += wordCountOk ? 15 : wordCountWarn ? 7 : 0;

    // 8. Featured Image WebP Check (10 pts)
    const hasImage = thumbnailUrl.length > 0;
    checks.push({
      id: "featured-image",
      label: "Gambar Utama Terpasang & Ter-optimasi",
      status: hasImage ? "pass" : "fail",
      detail: hasImage
        ? "Gambar utama terpasang dengan format WebP (LCP Cepat)"
        : "Upload foto utama untuk Open Graph & Google Discover",
      score: hasImage ? 10 : 0,
    });
    if (hasImage) score += 10;

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(0, score));

    return { checks, score: finalScore };
  }, [
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
      return {
        label: "Sangat Bagus (Optimal)",
        className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
      };
    if (score >= 50)
      return {
        label: "Cukup (Needs Improvement)",
        className: "bg-[#B8860B]/10 text-[#B8860B] border-[#B8860B]/30",
      };
    return {
      label: "Belum Teroptimasi",
      className: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    };
  };

  const badge = getScoreBadge(analysis.score);

  return (
    <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkle className="size-4 text-[#B8860B]" weight="fill" />
          <CardTitle className="text-base font-bold text-foreground">
            Audit SEO & Indeks Mesin Pencari
          </CardTitle>
        </div>
        <Badge
          variant="outline"
          className={`rounded-none font-bold text-xs px-2.5 py-1 uppercase tracking-wider ${badge.className}`}
        >
          Skor SEO: {analysis.score} / 100
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Focus Keyword Input */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-foreground">
            Focus Keyword (Kata Kunci Utama)
          </label>
          <Input
            placeholder="Masukkan kata kunci utama (contoh: Transformasi Digital)"
            value={focusKeyword}
            onChange={(e) => onFocusKeywordChange(e.target.value)}
            className="rounded-none border-black/15 bg-white text-xs font-semibold focus:border-[#B8860B]"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            Kata kunci target yang ingin dioptimasi agar liputan muncul di peringkat teratas Google Search & Discover.
          </p>
        </div>

        {/* Minimalist Google SERP Live Preview */}
        <div className="rounded-none border border-black/10 bg-[#fafafa] p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-black/5 pb-2">
            <Globe className="size-3.5 text-primary" />
            <span>Pratinjau Hasil Google Search (Live SERP Preview)</span>
          </div>
          <div className="space-y-1 pt-1">
            <p className="text-[11px] text-muted-foreground font-mono truncate">
              https://metrikmedia.id/berita/{slug || "url-artikel"}
            </p>
            <p className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-1">
              {effectiveTitle || "Judul Artikel Terpasang di Google Search"} | Metrik Media Indonesia
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {effectiveDesc || "Deskripsi ringkas artikel yang akan tampil pada cuplikan pencarian Google dan social share..."}
            </p>
          </div>
        </div>

        {/* Minimalist SEO Audit Checklist */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              Daftar Pemeriksaan SEO (Checklist):
            </p>
            <span className="text-[11px] text-muted-foreground font-medium">
              {analysis.checks.filter((c) => c.status === "pass").length} dari {analysis.checks.length} Lolos
            </span>
          </div>

          <div className="rounded-none border border-black/10 divide-y divide-black/5 bg-white overflow-hidden">
            {analysis.checks.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 text-xs transition-colors hover:bg-black/[0.01]"
              >
                {item.status === "pass" && (
                  <CheckCircle className="size-4 shrink-0 text-emerald-600 mt-0.5" weight="fill" />
                )}
                {item.status === "warn" && (
                  <Warning className="size-4 shrink-0 text-[#B8860B] mt-0.5" weight="fill" />
                )}
                {item.status === "fail" && (
                  <XCircle className="size-4 shrink-0 text-rose-500/80 mt-0.5" weight="fill" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-foreground">{item.label}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "pass"
                          ? "text-emerald-700"
                          : item.status === "warn"
                          ? "text-[#B8860B]"
                          : "text-rose-600"
                      }`}
                    >
                      {item.status === "pass" ? "Lolos" : item.status === "warn" ? "Peringatan" : "Belum Memenuhi"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
