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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, MapPin, PencilSimple, Trash, CircleNotch, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

interface Location {
  id: number;
  name: string;
  slug: string;
  level: string;
  parentId: number | null;
  parentName: string | null;
  description: string | null;
  articleCount?: number;
}

const LEVEL_LABELS: Record<string, string> = {
  country: "Negara",
  province: "Provinsi",
  city: "Kota/Kabupaten",
  district: "Kecamatan",
};

const emptyForm = { name: "", slug: "", level: "province", parentId: "" };

export default function LocationsManagementPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteItem, setDeleteItem] = useState<Location | null>(null);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/locations");
      const data = await res.json();
      if (res.ok) setLocations(data || []);
      else toast.error(data.message || "Gagal mengambil data wilayah");
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchLocations());
  }, [fetchLocations]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (loc: Location) => {
    setEditing(loc);
    setForm({
      name: loc.name,
      slug: loc.slug,
      level: loc.level,
      parentId: loc.parentId ? String(loc.parentId) : "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Nama dan slug wajib diisi");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(editing ? `/api/locations/${editing.id}` : "/api/locations", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          level: form.level,
          parentId: form.parentId ? parseInt(form.parentId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan wilayah");
      toast.success(editing ? "Wilayah berhasil diperbarui" : "Wilayah berhasil dibuat");
      setDialogOpen(false);
      fetchLocations();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan wilayah"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/locations/${deleteItem.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus wilayah");
      }
      toast.success("Wilayah berhasil dihapus");
      setDeleteItem(null);
      fetchLocations();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus wilayah"));
      setDeleteItem(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Hirarki Wilayah & Berita Daerah</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center flex-wrap gap-1">
                <span>Struktur hirarki wilayah liputan: Indonesia</span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span>Provinsi</span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span>Kota/Kabupaten</span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span>Kecamatan.</span>
              </p>
            </div>
            <Button
              onClick={openCreate}
              className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs"
            >
              <Plus className="size-4" weight="bold" />
              Tambah Wilayah
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Nama Wilayah</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Tingkat / Level</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Induk Wilayah</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Artikel Terkait</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : locations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Belum ada wilayah. Klik &quot;Tambah Wilayah&quot; untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    locations.map((loc) => (
                      <TableRow key={loc.id} className="border-black/5 hover:bg-black/2">
                        <TableCell className="py-3 font-semibold text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-primary" weight="bold" />
                            <span>{loc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs font-medium text-muted-foreground">
                          {LEVEL_LABELS[loc.level] || loc.level}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground">
                          {loc.parentName || "Indonesia"}
                        </TableCell>
                        <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                          /daerah/{loc.slug}
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs font-mono">
                          {(loc.articleCount || 0).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-7 rounded-none" onClick={() => openEdit(loc)}>
                              <PencilSimple className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteItem(loc)}
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
            <DialogTitle>{editing ? "Edit Wilayah" : "Tambah Wilayah Baru"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui informasi wilayah." : "Buat wilayah baru untuk berita daerah."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="loc-name">Nama Wilayah</Label>
              <Input
                id="loc-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="cth: Jawa Barat"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loc-slug">Slug URL</Label>
              <Input
                id="loc-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="cth: jawa-barat"
              />
            </div>
            <div className="space-y-2">
              <Label>Tingkat / Level</Label>
              <Select value={form.level} onValueChange={(v) => setForm((f) => ({ ...f, level: v }))}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Pilih level" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Induk Wilayah</Label>
              <Select value={form.parentId || "none"} onValueChange={(v) => setForm((f) => ({ ...f, parentId: v === "none" ? "" : v }))}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Tanpa induk (teratas)" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="none">Tanpa induk (teratas)</SelectItem>
                  {locations
                    .filter((l) => !editing || l.id !== editing.id)
                    .map((l) => (
                      <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button className="rounded-none bg-primary text-white hover:bg-primary/90" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <CircleNotch className="size-4 animate-spin mr-2" /> : null}
              {editing ? "Simpan Perubahan" : "Buat Wilayah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus wilayah ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Wilayah &quot;{deleteItem?.name}&quot; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
