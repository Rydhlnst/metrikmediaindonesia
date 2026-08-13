"use client";

import { useState, useEffect } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface Author {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  avatar: string | null;
  role: string | null;
  articleCount?: number;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<Author | null>(null);

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/authors");
      const data = await res.json();
      if (res.ok) {
        setAuthors(data || []);
      } else {
        toast.error("Gagal mengambil data penulis");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetch(`/api/authors/${deleteItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus penulis");
      }

      toast.success("Penulis berhasil dihapus");
      setDeleteItem(null);
      fetchAuthors();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus penulis");
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Penulis & Redaksi Berita</CardTitle>
            <Link href="/dashboard/authors/new">
              <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
                <Plus className="size-4" />
                Penulis Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Penulis</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Slug</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Role Redaksi</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Artikel</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-news-red" />
                      </TableCell>
                    </TableRow>
                  ) : authors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        Belum ada penulis. Klik "Penulis Baru" untuk menambahkan profil redaksi.
                      </TableCell>
                    </TableRow>
                  ) : (
                    authors.map((author) => (
                      <TableRow key={author.id} className="border-border/50">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 rounded-none">
                              <AvatarImage src={author.avatar || undefined} />
                              <AvatarFallback className="bg-news-red text-white rounded-none text-xs">
                                {author.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{author.name}</p>
                              {author.bio && (
                                <p className="text-[10px] text-muted-foreground line-clamp-1">
                                  {author.bio}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                          {author.slug}
                        </TableCell>
                        <TableCell className="py-3 text-xs font-semibold text-news-red">
                          {author.role || "Redaktur"}
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs text-muted-foreground font-mono">
                          {author.articleCount || 0}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/authors/${author.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
                              onClick={() => setDeleteItem(author)}
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
            <AlertDialogTitle>Hapus Penulis</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus penulis <strong>{deleteItem?.name}</strong>?
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
