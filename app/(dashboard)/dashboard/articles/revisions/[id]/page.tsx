"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, Warning, FileText, Pen } from "@phosphor-icons/react/dist/ssr";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Article {
  id: number;
  title: string;
  slug: string;
  status: string;
  reviewNote: string | null;
  submittedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categoryName: string | null;
  authorName: string | null;
  editorId: number | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: <FileText className="size-3" /> },
  submitted: { label: "Submitted", color: "bg-amber-100 text-amber-800", icon: <Clock className="size-3" /> },
  editorial_review: { label: "In Review", color: "bg-blue-100 text-blue-800", icon: <Pen className="size-3" /> },
  revision_required: { label: "Revisi Diperlukan", color: "bg-red-100 text-red-800", icon: <Warning className="size-3" /> },
  approved: { label: "Disetujui", color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle className="size-3" /> },
  published: { label: "Published", color: "bg-green-100 text-green-800", icon: <CheckCircle className="size-3" /> },
};

export default function ArticleRevisionsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [correctionNote, setCorrectionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();
        if (res.ok) {
          setArticle(data);
        } else {
          toast.error("Artikel tidak ditemukan");
          router.push("/dashboard/articles");
        }
      } catch {
        toast.error("Gagal memuat artikel");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, router]);

  const handleCorrectionSubmit = async () => {
    if (!correctionNote.trim()) {
      toast.error("Catatan koreksi tidak boleh kosong");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewNote: correctionNote.trim() }),
      });
      if (res.ok) {
        toast.success("Catatan koreksi berhasil disimpan");
        setCorrectionNote("");
        const data = await res.json();
        setArticle((prev) => prev ? { ...prev, reviewNote: data.data?.reviewNote || correctionNote.trim() } : prev);
      } else {
        toast.error("Gagal menyimpan catatan");
      }
    } catch {
      toast.error("Gagal menyimpan catatan");
    } finally {
      setSubmitting(false);
    }
  };

  // Build timeline from available article data
  const buildTimeline = () => {
    if (!article) return [];
    const events: { date: string; label: string; icon: React.ReactNode; color: string }[] = [];

    events.push({
      date: article.createdAt,
      label: "Artikel dibuat",
      icon: <FileText className="size-4" />,
      color: "bg-gray-400",
    });

    if (article.submittedAt) {
      events.push({
        date: article.submittedAt,
        label: "Artikel dikirim untuk review",
        icon: <Clock className="size-4" />,
        color: "bg-amber-500",
      });
    }

    if (article.status === "revision_required" && article.reviewNote) {
      events.push({
        date: article.updatedAt,
        label: `Revisi diminta: ${article.reviewNote}`,
        icon: <Warning className="size-4" />,
        color: "bg-red-500",
      });
    }

    if (article.status === "editorial_review") {
      events.push({
        date: article.updatedAt,
        label: "Sedang dalam editorial review",
        icon: <Pen className="size-4" />,
        color: "bg-blue-500",
      });
    }

    if (article.status === "approved") {
      events.push({
        date: article.updatedAt,
        label: "Artikel disetujui untuk publikasi",
        icon: <CheckCircle className="size-4" />,
        color: "bg-emerald-500",
      });
    }

    if (article.publishedAt) {
      events.push({
        date: article.publishedAt,
        label: "Artikel dipublikasikan",
        icon: <CheckCircle className="size-4" />,
        color: "bg-green-500",
      });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
        <DashboardTopbar />
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!article) return null;

  const timeline = buildTimeline();
  const cfg = statusConfig[article.status] || statusConfig.draft;

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/articles">
              <Button variant="ghost" size="icon" className="size-8 rounded-none border border-black/10 bg-white hover:bg-black/5">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Histori Revisi</h1>
              <p className="text-xs text-muted-foreground mt-1">{article.title}</p>
            </div>
          </div>
          <Badge className={`${cfg.color} border-none rounded-none text-xs`}>
            {cfg.icon}
            <span className="ml-1">{cfg.label}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada riwayat.</p>
              ) : (
                <div className="space-y-4">
                  {timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`size-8 rounded-full ${event.color} flex items-center justify-center text-white`}>
                          {event.icon}
                        </div>
                        {idx < timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-black/10 mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{event.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })} WIB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Correction Notice */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Catatan Koreksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.reviewNote && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  <p className="font-medium text-xs mb-1">Catatan Review Terakhir:</p>
                  {article.reviewNote}
                </div>
              )}
              <Textarea
                placeholder="Tulis catatan koreksi untuk artikel ini..."
                value={correctionNote}
                onChange={(e) => setCorrectionNote(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleCorrectionSubmit}
                disabled={submitting || !correctionNote.trim()}
                className="w-full"
                size="sm"
              >
                {submitting ? "Menyimpan..." : "Simpan Catatan Koreksi"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
