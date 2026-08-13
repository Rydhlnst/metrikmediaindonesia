"use client";

import { useState, useEffect } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus, PencilSimple, Trash, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  articleCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data || []);
      } else {
        toast.error(data.message || "Gagal mengambil data kategori");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetch(`/api/categories/${deleteItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus kategori");
      }

      toast.success("Kategori berhasil dihapus");
      setDeleteItem(null);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus kategori");
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Kategori Berita</CardTitle>
            <Link href="/dashboard/categories/new">
              <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
                <Plus className="size-4" />
                Kategori Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Nama</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Slug</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Jumlah Artikel</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-news-red" />
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        Belum ada kategori. Klik "Kategori Baru" untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((cat) => (
                      <TableRow key={cat.id} className="border-border/50">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="size-3 shrink-0 rounded-none"
                              style={{ backgroundColor: cat.color || "#DC2626" }}
                            />
                            <span className="font-medium text-sm">{cat.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                          {cat.slug}
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs text-muted-foreground">
                          {cat.articleCount || 0}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/categories/${cat.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
                              onClick={() => setDeleteItem(cat)}
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
            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori <strong>{deleteItem?.name}</strong>?
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
