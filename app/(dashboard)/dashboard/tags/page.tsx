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

interface Tag {
  id: number;
  name: string;
  slug: string;
  articleCount?: number;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<Tag | null>(null);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (res.ok) {
        setTags(data || []);
      } else {
        toast.error(data.message || "Gagal mengambil data tags");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetch(`/api/tags/${deleteItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus tag");
      }

      toast.success("Tag berhasil dihapus");
      setDeleteItem(null);
      fetchTags();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus tag");
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Tags Berita</CardTitle>
            <Link href="/dashboard/tags/new">
              <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
                <Plus className="size-4" />
                Tag Baru
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
                    <TableHead className="h-10 text-xs font-semibold text-right">Artikel</TableHead>
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
                  ) : tags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        Belum ada tag. Klik "Tag Baru" untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tags.map((tag) => (
                      <TableRow key={tag.id} className="border-border/50">
                        <TableCell className="py-3 font-medium text-sm">#{tag.name}</TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                          {tag.slug}
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs text-muted-foreground">
                          {tag.articleCount || 0}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/tags/${tag.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
                              onClick={() => setDeleteItem(tag)}
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
            <AlertDialogTitle>Hapus Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tag <strong>#{deleteItem?.name}</strong>?
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
