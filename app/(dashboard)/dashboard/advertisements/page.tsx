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
import { getErrorMessage } from "@/lib/error-message";
import { MediaImage } from "@/components/shared/media-image";

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
    queueMicrotask(() => fetchAds());
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus iklan"));
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <CardTitle className="text-base font-bold text-foreground">Manajemen Slot Iklan Banner</CardTitle>
            <Link href="/dashboard/advertisements/new">
              <Button className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs">
                <Plus className="size-4" weight="bold" />
                Iklan Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Preview</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Judul Iklan</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Posisi</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Status</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : ads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        Belum ada iklan dipasang. Klik &quot;Iklan Baru&quot; untuk memasang banner.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ads.map((ad) => (
                      <TableRow key={ad.id} className="border-black/5 hover:bg-black/2">
                        <TableCell className="py-3">
                          <div className="size-10 overflow-hidden border border-black/10 bg-muted flex items-center justify-center">
                            {ad.image ? (
                              <MediaImage src={ad.image} alt={ad.title} fill={false} width={80} height={80} className="h-full w-full object-cover" />
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
                              <Button variant="ghost" size="icon" className="size-7 rounded-none">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
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
        <AlertDialogContent className="rounded-none border border-black/10">
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
    </div>
  );
}
