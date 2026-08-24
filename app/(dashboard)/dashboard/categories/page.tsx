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
import { getErrorMessage } from "@/lib/error-message";

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
    queueMicrotask(() => fetchCategories());
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus kategori"));
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <CardTitle className="text-base font-bold text-foreground">Kategori Berita</CardTitle>
            <Link href="/dashboard/categories/new">
              <Button className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs">
                <Plus className="size-4" weight="bold" />
                Kategori Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Nama</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Slug</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Jumlah Artikel</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        Belum ada kategori. Klik &quot;Kategori Baru&quot; untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((cat) => (
                      <TableRow key={cat.id} className="border-black/5 hover:bg-black/2">
                        <TableCell className="py-3 font-medium">
                          <div className="flex items-center gap-2">
                            <span
                              className="size-3 shrink-0 rounded-full"
                              style={{ backgroundColor: cat.color || "#B8860B" }}
                            />
                            {cat.name}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                          {cat.slug}
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs font-mono">
                          {(cat.articleCount || 0).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/categories/${cat.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7 rounded-none">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
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
        <AlertDialogContent className="rounded-none border border-black/10">
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
    </div>
  );
}
