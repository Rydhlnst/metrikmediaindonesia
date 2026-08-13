"use client";

import { useState, useEffect } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus, PencilSimple, Trash, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { toast } from "sonner";

interface StaticPageItem {
  id: number;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
}

export default function PagesPage() {
  const [pageList, setPageList] = useState<StaticPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<StaticPageItem | null>(null);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      if (res.ok) {
        setPageList(data || []);
      } else {
        toast.error("Gagal mengambil data halaman");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetch(`/api/pages/${deleteItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus halaman");
      }

      toast.success("Halaman berhasil dihapus");
      setDeleteItem(null);
      fetchPages();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus halaman");
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Halaman Statis (CMS Pages)</CardTitle>
            <Link href="/dashboard/pages/new">
              <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
                <Plus className="size-4" />
                Halaman Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Judul Halaman</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Slug URL</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Status</TableHead>
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
                  ) : pageList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        Belum ada halaman statis. Klik "Halaman Baru" untuk membuat (seperti Redaksi, Tentang Kami, Pedoman Siber).
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageList.map((item) => (
                      <TableRow key={item.id} className="border-border/50">
                        <TableCell className="py-3 font-medium text-sm">{item.title}</TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                          /{item.slug}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium rounded-none ${
                              item.status === "published"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/pages/${item.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
                              onClick={() => setDeleteItem(item)}
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
            <AlertDialogTitle>Hapus Halaman</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus halaman <strong>{deleteItem?.title}</strong>?
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
