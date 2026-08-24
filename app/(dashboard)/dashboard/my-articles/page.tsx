"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Suspense } from "react";
import {
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  CircleNotch,
  ArrowSquareOut,
  WarningCircle,
  NewspaperClipping,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";
import { useSession } from "@/lib/use-session";

interface MyArticle {
  id: number;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
  submittedAt: string | null;
  createdAt: string;
  publishedAt: string | null;
  reviewNote: string | null;
  categoryName: string | null;
  categorySlug: string | null;
}

const STATUS_TABS = [
  { key: "all", label: "Semua" },
  { key: "draft", label: "Draft" },
  { key: "submitted", label: "Menunggu Review" },
  { key: "revision_required", label: "Perlu Revisi" },
  { key: "published", label: "Sudah Terbit" },
];

export default function MyArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
          <DashboardTopbar />
          <div className="flex flex-1 items-center justify-center">
            <CircleNotch className="size-8 animate-spin text-[#b8860b]" />
          </div>
        </div>
      }
    >
      <MyArticlesContent />
    </Suspense>
  );
}

function MyArticlesContent() {
  const searchParams = useSearchParams();
  const { user, isLoading: sessionLoading } = useSession();

  const [articles, setArticles] = useState<MyArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [deleteItem, setDeleteItem] = useState<MyArticle | null>(null);

  const fetchMyArticles = useCallback(
    async (searchQuery = "", currentStatus = statusFilter) => {
      if (!user?.authorId) return;
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          authorId: String(user.authorId),
          limit: "50",
        });
        if (searchQuery) params.set("search", searchQuery);
        if (currentStatus && currentStatus !== "all") params.set("status", currentStatus);

        const res = await fetch(`/api/articles?${params}`);
        const data = await res.json();
        if (res.ok) {
          setArticles(data.data || []);
        } else {
          toast.error("Gagal mengambil data artikel");
        }
      } catch {
        toast.error("Gagal terhubung ke server");
      } finally {
        setIsLoading(false);
      }
    },
    [user, statusFilter]
  );

  useEffect(() => {
    if (!sessionLoading && user?.authorId) {
      queueMicrotask(() => fetchMyArticles(search, statusFilter));
    } else if (!sessionLoading && user && !user.authorId) {
      queueMicrotask(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLoading, user?.authorId]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchMyArticles(search, status);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/articles/${deleteItem.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus artikel");
      }
      toast.success("Artikel berhasil dihapus");
      setDeleteItem(null);
      fetchMyArticles(search, statusFilter);
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus artikel"));
    }
  };

  const canEdit = (status: string) => ["draft", "revision_required"].includes(status);
  const canDelete = (status: string) => status !== "published";

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/5 pb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Artikel Saya</h1>
            <p className="text-xs text-muted-foreground">
              Kelola semua berita yang Anda tulis — lihat status review redaksi di sini.
            </p>
          </div>
          <Link href="/dashboard/articles/new">
            <Button className="gap-2 rounded-none bg-[#b8860b] hover:bg-[#92700a] text-white font-bold uppercase tracking-wider text-xs px-4 py-2 border border-[#92700a] shadow-xs">
              <Plus className="size-4" weight="bold" />
              Tulis Berita Baru
            </Button>
          </Link>
        </div>

        {/* Review notes banner */}
        {articles
          .filter((a) => a.status === "revision_required" && a.reviewNote)
          .slice(0, 1)
          .map((a) => (
            <div
              key={a.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-red-500/30 border-l-4 border-l-red-500 bg-red-500/5 p-4"
            >
              <div className="flex items-start gap-3">
                <WarningCircle className="size-5 shrink-0 text-red-600" weight="bold" />
                <div>
                  <p className="text-sm font-bold text-red-800">
                    Redaksi meminta revisi: {a.title}
                  </p>
                  <p className="mt-0.5 text-xs text-red-700/80 italic">
                    &ldquo;{a.reviewNote}&rdquo;
                  </p>
                </div>
              </div>
              <Link href={`/dashboard/articles/${a.id}/edit`}>
                <Button
                  size="sm"
                  className="shrink-0 gap-1.5 rounded-none bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
                >
                  <PencilSimple className="size-3.5" />
                  Perbaiki Sekarang
                </Button>
              </Link>
            </div>
          ))}

        {/* Main Card */}
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black/5 px-6 py-4 gap-3">
            <CardTitle className="font-serif text-lg font-bold text-foreground">
              Daftar Artikel Saya
            </CardTitle>
            <div className="relative max-w-xs w-full">
              <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari judul berita..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  fetchMyArticles(e.target.value, statusFilter);
                }}
                className="rounded-none border-black/15 pl-9 bg-white text-xs"
              />
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleStatusFilterChange(tab.key)}
                  className={`text-xs px-3.5 py-2 font-bold uppercase tracking-wider transition-all rounded-none border ${
                    statusFilter === tab.key
                      ? "bg-[#111827] text-[#f9dc5c] border-[#111827] shadow-xs"
                      : "bg-white text-slate-700 border-black/10 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f8f9fa] border-b border-black/10 hover:bg-[#f8f9fa]">
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black">Judul Berita</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black">Status</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black hidden md:table-cell">Kategori</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black text-right">Views</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading || sessionLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-[#b8860b]" />
                      </TableCell>
                    </TableRow>
                  ) : articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <NewspaperClipping className="size-8 text-muted-foreground/40" />
                          <p className="text-sm font-bold text-foreground">
                            {statusFilter === "all"
                              ? "Belum ada artikel"
                              : "Tidak ada artikel dengan status ini"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Klik &ldquo;Tulis Berita Baru&rdquo; untuk mulai menulis.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    articles.map((article) => (
                      <TableRow key={article.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                        <TableCell className="py-3.5 max-w-xs sm:max-w-md">
                          <span className="line-clamp-1 font-bold text-sm text-foreground">
                            {article.title}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {new Date(
                              article.submittedAt || article.createdAt
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          {article.status === "revision_required" && article.reviewNote && (
                            <span className="mt-1 block line-clamp-1 text-[10px] italic text-red-700">
                              Catatan redaksi: {article.reviewNote}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <StatusBadge status={article.status} />
                        </TableCell>
                        <TableCell className="py-3.5 hidden md:table-cell">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#b8860b]">
                            {article.categoryName || "Umum"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 text-right text-xs font-mono font-bold text-slate-800">
                          {article.viewCount.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {article.status === "published" && article.categorySlug && (
                              <a
                                href={`/${article.categorySlug}/${article.slug}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="size-7 rounded-none hover:bg-black/5" title="Lihat di Web">
                                  <ArrowSquareOut className="size-3.5 text-slate-700" />
                                </Button>
                              </a>
                            )}
                            {canEdit(article.status) && (
                              <Link href={`/dashboard/articles/${article.id}/edit`}>
                                <Button variant="ghost" size="icon" className="size-7 rounded-none hover:bg-black/5" title="Edit Artikel">
                                  <PencilSimple className="size-3.5 text-slate-700" />
                                </Button>
                              </Link>
                            )}
                            {canDelete(article.status) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 rounded-none text-destructive hover:bg-destructive/10"
                                title="Hapus Artikel"
                                onClick={() => setDeleteItem(article)}
                              >
                                <Trash className="size-3.5" />
                              </Button>
                            )}
                          </div>
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

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="rounded-none border border-black/10 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-lg font-bold">Hapus Artikel</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus artikel <strong>{deleteItem?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none text-xs">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-destructive text-white hover:bg-destructive/90 text-xs font-bold uppercase tracking-wider"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
