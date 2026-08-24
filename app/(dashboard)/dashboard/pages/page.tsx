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
import { getErrorMessage } from "@/lib/error-message";

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
    queueMicrotask(() => fetchPages());
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus halaman"));
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <CardTitle className="text-base font-bold text-foreground">Halaman Statis (CMS Pages)</CardTitle>
            <Link href="/dashboard/pages/new">
              <Button className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs">
                <Plus className="size-4" weight="bold" />
                Halaman Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Judul Halaman</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Status</TableHead>
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
                  ) : pageList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        Belum ada halaman statis. Klik &quot;Halaman Baru&quot; untuk membuat (seperti Redaksi, Tentang Kami, Pedoman Siber).
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageList.map((item) => (
                      <TableRow key={item.id} className="border-black/5 hover:bg-black/2">
                        <TableCell className="py-3 font-semibold text-sm text-foreground">{item.title}</TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                          /{item.slug}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold rounded-none uppercase tracking-wider ${
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
                              <Button variant="ghost" size="icon" className="size-7 rounded-none">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
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
        <AlertDialogContent className="rounded-none border border-black/10">
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
    </div>
  );
}
