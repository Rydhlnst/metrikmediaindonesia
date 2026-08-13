"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, PencilSimple, Trash, MagnifyingGlass, CircleNotch, Eye } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { toast } from "sonner";

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
  authorName: string | null;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteItem, setDeleteItem] = useState<Article | null>(null);

  const fetchArticles = useCallback(async (searchQuery = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

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
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSearch = (val: string) => {
    setSearch(val);
    fetchArticles(val);
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
      fetchArticles(search);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus artikel");
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Semua Artikel Berita</CardTitle>
            <Link href="/dashboard/articles/new">
              <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
                <Plus className="size-4" />
                Artikel Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari artikel..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="rounded-none pl-9"
                />
              </div>
            </div>

            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Judul</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Kategori</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Status</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">SEO Score</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Views</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-news-red" />
                      </TableCell>
                    </TableRow>
                  ) : articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        Belum ada artikel. Klik "Artikel Baru" untuk membuat berita.
                      </TableCell>
                    </TableRow>
                  ) : (
                    articles.map((article) => (
                      <TableRow key={article.id} className="border-border/50">
                        <TableCell className="py-3">
                          <span className="line-clamp-1 font-medium text-sm">
                            {article.title}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <span
                            className="text-xs font-semibold"
                            style={{ color: article.categoryColor || "#DC2626" }}
                          >
                            {article.categoryName || "Umum"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium rounded-none ${
                              article.status === "published"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }`}
                          >
                            {article.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-mono rounded-none ${
                              (article.seoScore || 0) >= 80
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : (article.seoScore || 0) >= 50
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }`}
                          >
                            {article.seoScore || 0} / 100
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs text-muted-foreground font-mono">
                          {article.viewCount.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {article.categorySlug && (
                              <a
                                href={`/${article.categorySlug}/${article.slug}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="size-7">
                                  <Eye className="size-3.5" />
                                </Button>
                              </a>
                            )}
                            <Link href={`/dashboard/articles/${article.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
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
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Artikel</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus artikel <strong>{deleteItem?.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
