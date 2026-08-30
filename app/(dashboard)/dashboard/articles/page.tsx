"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  CircleNotch,
  CheckCircle,
  ShieldCheck,
  ArrowSquareOut,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";
import { useSession } from "@/lib/use-session";
import { StatusBadge } from "@/components/shared/status-badge";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  viewCount: number;
  seoScore: number;
  createdAt: string;
  categoryName: string | null;
  categoryColor: string | null;
  categorySlug: string | null;
  authorId: number | null;
  authorName: string | null;
  authorSlug: string | null;
  authorRole: string | null;
}

export default function ArticlesPage() {
  const { user } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteItem, setDeleteItem] = useState<Article | null>(null);
  const [isApproving, setIsApproving] = useState<number | null>(null);

  const isContributor = user?.role === "Kontributor";

  const fetchArticles = useCallback(
    async (searchQuery = "", currentStatus = statusFilter) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
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
    [statusFilter]
  );

  useEffect(() => {
    queueMicrotask(() => fetchArticles(search, statusFilter));
  }, [fetchArticles, search, statusFilter]);

  const handleSearch = (val: string) => {
    setSearch(val);
    fetchArticles(val, statusFilter);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchArticles(search, status);
  };

  const handleApprove = async (articleId: number) => {
    setIsApproving(articleId);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyetujui artikel");
      }

      toast.success("Artikel berhasil disetujui dan dipublikasikan.");
      fetchArticles(search, statusFilter);
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyetujui artikel"));
    } finally {
      setIsApproving(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetch(`/api/articles/${deleteItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus artikel");
      }

      toast.success("Artikel berhasil dihapus");
      setDeleteItem(null);
      fetchArticles(search, statusFilter);
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus artikel"));
    }
  };

  const totalViewsAccrued = articles.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const submittedCount = articles.filter((a) => a.status === "submitted").length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Contributor / Editorial Milestone Banner - Sharp & Gold Styled */}
        <div className="rounded-none border border-black/10 border-l-4 border-l-[#b8860b] bg-[#111827] p-6 text-white shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-none bg-[#b8860b] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 tracking-widest border border-[#92700a]">
                  {user?.role || "Jurnalis & Penulis"}
                </span>
                <span className="text-xs text-[#f9dc5c] flex items-center gap-1 font-semibold tracking-wider uppercase text-[10px]">
                  <ShieldCheck className="size-3.5 text-[#f9dc5c]" weight="bold" /> Ruang Redaksi Terverifikasi
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
                Selamat Datang, {user?.name || "Penulis Redaksi"}
              </h1>
              <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                Platform penulisan terbuka Metrik Media Indonesia. Kontributor aktif mendapatkan notifikasi milestone berkala (3 bulan, 6 bulan, 1 tahun, dan seterusnya) sebagai bentuk apresiasi dedikasi jurnalistik.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-none">
              <div className="text-center px-4 border-r border-white/10">
                <div className="text-xl font-bold text-[#f9dc5c] font-mono">
                  {articles.length}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                  Artikel
                </div>
              </div>
              <div className="text-center px-4">
                <div className="text-xl font-bold text-white font-mono">
                  {totalViewsAccrued.toLocaleString("id-ID")}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                  Total Views
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Articles Card */}
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black/5 px-6 py-4 gap-3">
            <div>
              <CardTitle className="font-serif text-lg font-bold text-foreground">
                Manajemen Berita & Antrean Redaksi
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daftar seluruh liputan berita dari jurnalis dan kontributor nasional.
              </p>
            </div>
            <Link href="/dashboard/articles/new">
              <Button className="gap-2 rounded-none bg-[#b8860b] hover:bg-[#92700a] text-white font-bold uppercase tracking-wider text-xs px-4 py-2 border border-[#92700a] shadow-xs">
                <Plus className="size-4" weight="bold" />
                Tulis Berita Baru
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { key: "all", label: "Semua Berita" },
                  { key: "submitted", label: `Menunggu Review ${submittedCount > 0 ? `(${submittedCount})` : ""}`, highlight: submittedCount > 0 },
                  { key: "published", label: "Terbit" },
                  { key: "draft", label: "Draft" },
                  { key: "revision_required", label: "Perlu Revisi" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleStatusFilterChange(tab.key)}
                    className={`text-xs px-3.5 py-2 font-bold uppercase tracking-wider transition-all rounded-none border ${
                      statusFilter === tab.key
                        ? "bg-[#111827] text-[#f9dc5c] border-[#111827] shadow-xs"
                        : tab.highlight
                        ? "bg-amber-50 text-amber-900 border-[#b8860b]/40 hover:bg-amber-100"
                        : "bg-white text-slate-700 border-black/10 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative max-w-xs w-full">
                <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari judul berita..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="rounded-none border-black/15 pl-9 bg-white text-xs"
                />
              </div>
            </div>

            {/* Articles Data Table */}
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f8f9fa] border-b border-black/10 hover:bg-[#f8f9fa]">
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black">Judul Berita</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black">Penulis / Author</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black">Kategori</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black">Status</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black text-right">Views</TableHead>
                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-black text-right">Aksi & Moderasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-[#b8860b]" />
                      </TableCell>
                    </TableRow>
                  ) : articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                        Tidak ada artikel yang ditemukan. Klik &quot;Tulis Berita Baru&quot; untuk membuat liputan berita.
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
                            {new Date(article.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900">
                              {article.authorName || "Kontributor Tamu"}
                            </span>
                            <span className="text-[10px] text-[#b8860b] font-bold uppercase tracking-wider">
                              {article.authorRole || "Kontributor"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: article.categoryColor || "#B8860B" }}
                          >
                            {article.categoryName || "Nasional"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <StatusBadge status={article.status} />
                        </TableCell>
                        <TableCell className="py-3.5 text-right text-xs font-mono font-bold text-slate-800">
                          {article.viewCount.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Moderation Approve Button */}
                            {article.status === "submitted" && !isContributor && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] gap-1 rounded-none bg-[#b8860b] hover:bg-[#92700a] text-white font-bold uppercase tracking-wider border-none px-2.5"
                                disabled={isApproving === article.id}
                                onClick={() => handleApprove(article.id)}
                              >
                                {isApproving === article.id ? (
                                  <CircleNotch className="size-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="size-3.5" weight="bold" />
                                )}
                                Setujui
                              </Button>
                            )}

                            {article.categorySlug && article.status === "published" && (
                              <a
                                href={`/${article.categorySlug}/${article.slug}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="size-7 rounded-none hover:bg-black/5" title="Lihat Berita di Web">
                                  <ArrowSquareOut className="size-3.5 text-slate-700" />
                                </Button>
                              </a>
                            )}
                            <Link href={`/dashboard/articles/${article.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7 rounded-none hover:bg-black/5" title="Edit Artikel">
                                <PencilSimple className="size-3.5 text-slate-700" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
                              title="Hapus Artikel"
                              onClick={() => setDeleteItem(article)}
                            >
                              <Trash className="size-3.5" />
                            </Button>
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
