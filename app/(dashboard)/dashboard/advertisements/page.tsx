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
import { Plus, PencilSimple, Trash, CircleNotch, Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { toast } from "sonner";

interface Advertisement {
  id: number;
  title: string;
  image: string | null;
  link: string | null;
  position: string;
  status: string;
  clicks: number;
  impressions: number;
}

export default function AdvertisementsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<Advertisement | null>(null);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/advertisements");
      const data = await res.json();
      if (res.ok) {
        setAds(data || []);
      } else {
        toast.error("Gagal mengambil data iklan");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetch(`/api/advertisements/${deleteItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus iklan");
      }

      toast.success("Iklan berhasil dihapus");
      setDeleteItem(null);
      fetchAds();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus iklan");
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Manajemen Slot Iklan Banner</CardTitle>
            <Link href="/dashboard/advertisements/new">
              <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
                <Plus className="size-4" />
                Iklan Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Preview</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Judul Iklan</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Posisi</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Status</TableHead>
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
                  ) : ads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        Belum ada iklan dipasang. Klik "Iklan Baru" untuk memasang banner.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ads.map((ad) => (
                      <TableRow key={ad.id} className="border-border/50">
                        <TableCell className="py-3">
                          <div className="size-10 overflow-hidden border border-border bg-muted flex items-center justify-center">
                            {ad.image ? (
                              <img src={ad.image} alt={ad.title} className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon className="size-5 text-muted-foreground/50" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 font-medium text-sm">
                          {ad.title}
                          {ad.link && (
                            <p className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">
                              {ad.link}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="py-3 text-xs font-mono uppercase">
                          {ad.position}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium rounded-none ${
                              ad.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {ad.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/advertisements/${ad.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
                              onClick={() => setDeleteItem(ad)}
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
            <AlertDialogTitle>Hapus Slot Iklan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus iklan <strong>{deleteItem?.title}</strong>?
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
