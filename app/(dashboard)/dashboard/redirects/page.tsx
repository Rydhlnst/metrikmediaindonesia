"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, ArrowsLeftRight, PencilSimple, Trash, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

interface Redirect {
  id: number;
  oldUrl: string;
  newUrl: string;
  statusCode: number;
  isActive: boolean;
}

const emptyForm = { oldUrl: "", newUrl: "", statusCode: "301" };

export default function RedirectsManagementPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Redirect | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteItem, setDeleteItem] = useState<Redirect | null>(null);

  const fetchRedirects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/redirects");
      const data = await res.json();
      if (res.ok) setRedirects(data || []);
      else toast.error(data.message || "Gagal mengambil data redirect");
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchRedirects());
  }, [fetchRedirects]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (red: Redirect) => {
    setEditing(red);
    setForm({
      oldUrl: red.oldUrl,
      newUrl: red.newUrl,
      statusCode: String(red.statusCode),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.oldUrl.trim() || !form.newUrl.trim()) {
      toast.error("URL asal dan URL tujuan wajib diisi");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(editing ? `/api/redirects/${editing.id}` : "/api/redirects", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldUrl: form.oldUrl.trim(),
          newUrl: form.newUrl.trim(),
          statusCode: parseInt(form.statusCode),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan redirect");
      toast.success(editing ? "Redirect berhasil diperbarui" : "Redirect berhasil dibuat");
      setDialogOpen(false);
      fetchRedirects();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan redirect"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (red: Redirect) => {
    try {
      const res = await fetch(`/api/redirects/${red.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !red.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui status redirect");
      setRedirects((prev) =>
        prev.map((r) => (r.id === red.id ? { ...r, isActive: !r.isActive } : r))
      );
      toast.success(!red.isActive ? "Redirect diaktifkan" : "Redirect dinonaktifkan");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memperbarui status redirect"));
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/redirects/${deleteItem.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus redirect");
      }
      toast.success("Redirect berhasil dihapus");
      setDeleteItem(null);
      fetchRedirects();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus redirect"));
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Redirect Manager (301 & 302 URL Forwarding)</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Mengalihkan URL artikel lama ke URL baru tanpa kehilangan otoritas peringkat pencarian (Link Equity).</p>
            </div>
            <Button
              onClick={openCreate}
              className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs"
            >
              <Plus className="size-4" weight="bold" />
              Tambah Redirect
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">URL Asal (Old URL)</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">URL Tujuan (New URL)</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">HTTP Status</TableHead>
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
                  ) : redirects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Belum ada redirect. Klik &quot;Tambah Redirect&quot; untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    redirects.map((red) => (
                      <TableRow key={red.id} className="border-black/5 hover:bg-black/2">
                        <TableCell className="py-3 font-mono text-xs text-destructive font-semibold max-w-xs truncate">
                          {red.oldUrl}
                        </TableCell>
                        <TableCell className="py-3 font-mono text-xs text-emerald-600 font-semibold max-w-xs truncate">
                          {red.newUrl}
                        </TableCell>
                        <TableCell className="py-3 text-xs font-mono font-bold">
                          {red.statusCode} {red.statusCode === 301 ? "Permanent" : "Temporary"}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={red.isActive}
                              onCheckedChange={() => handleToggleActive(red)}
                            />
                            <Badge
                              variant="outline"
                              className={`rounded-none text-[10px] uppercase font-bold tracking-wider ${
                                red.isActive
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-muted text-muted-foreground border-black/10"
                              }`}
                            >
                              {red.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-7 rounded-none" onClick={() => openEdit(red)}>
                              <PencilSimple className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteItem(red)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-none border border-black/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowsLeftRight className="size-4 text-primary" weight="bold" />
              {editing ? "Edit Redirect" : "Tambah Redirect Baru"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui aturan pengalihan URL." : "Alihkan URL lama ke URL baru untuk menjaga link equity SEO."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="red-old">URL Asal (Old URL)</Label>
              <Input
                id="red-old"
                value={form.oldUrl}
                onChange={(e) => setForm((f) => ({ ...f, oldUrl: e.target.value }))}
                placeholder="/berita/url-lama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="red-new">URL Tujuan (New URL)</Label>
              <Input
                id="red-new"
                value={form.newUrl}
                onChange={(e) => setForm((f) => ({ ...f, newUrl: e.target.value }))}
                placeholder="/nasional/url-baru"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="red-code">HTTP Status Code</Label>
              <select
                id="red-code"
                value={form.statusCode}
                onChange={(e) => setForm((f) => ({ ...f, statusCode: e.target.value }))}
                className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="301">301 — Moved Permanently</option>
                <option value="302">302 — Found (Temporary)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button className="rounded-none bg-primary text-white hover:bg-primary/90" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <CircleNotch className="size-4 animate-spin mr-2" /> : null}
              {editing ? "Simpan Perubahan" : "Buat Redirect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus redirect ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengalihan dari &quot;{deleteItem?.oldUrl}&quot; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Batal</AlertDialogCancel>
            <AlertDialogAction className="rounded-none bg-destructive text-white hover:bg-destructive/90" onClick={handleDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
