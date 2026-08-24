"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
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
import { Plus, Users, PencilSimple, Trash, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

interface Entity {
  id: number;
  type: string;
  name: string;
  slug: string;
  bioOrDesc: string | null;
  articleCount?: number;
}

const TYPE_LABELS: Record<string, string> = {
  person: "Person",
  organization: "Organization",
  place: "Place",
};

const emptyForm = { type: "person", name: "", slug: "", bioOrDesc: "" };

export default function EntitiesManagementPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Entity | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteItem, setDeleteItem] = useState<Entity | null>(null);

  const fetchEntities = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = typeFilter ? `/api/entities?type=${typeFilter}` : "/api/entities";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setEntities(data || []);
      else toast.error(data.message || "Gagal mengambil data entitas");
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    queueMicrotask(() => fetchEntities());
  }, [fetchEntities]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (entity: Entity) => {
    setEditing(entity);
    setForm({
      type: entity.type,
      name: entity.name,
      slug: entity.slug,
      bioOrDesc: entity.bioOrDesc || "",
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
      const res = await fetch(editing ? `/api/entities/${editing.id}` : "/api/entities", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          name: form.name.trim(),
          slug: form.slug.trim(),
          bioOrDesc: form.bioOrDesc.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan entitas");
      toast.success(editing ? "Entitas berhasil diperbarui" : "Entitas berhasil dibuat");
      setDialogOpen(false);
      fetchEntities();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan entitas"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/entities/${deleteItem.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus entitas");
      }
      toast.success("Entitas berhasil dihapus");
      setDeleteItem(null);
      fetchEntities();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus entitas"));
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Entitas Berita (Entity Relationship System)</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Hubungan antar-konten melalui Tokoh (Person), Organisasi (Organization), dan Tempat (Place).</p>
            </div>
            <Button
              onClick={openCreate}
              className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs"
            >
              <Plus className="size-4" weight="bold" />
              Tambah Entitas
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Select value={typeFilter || "all"} onValueChange={(v) => setTypeFilter(v === "all" ? "" : v)}>
                <SelectTrigger className="rounded-none w-48">
                  <SelectValue placeholder="Semua tipe" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Nama Entitas</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Tipe Entitas</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Deskripsi / Bio</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Berita Terkait</TableHead>
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
                  ) : entities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Belum ada entitas. Klik &quot;Tambah Entitas&quot; untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    entities.map((entity) => (
                      <TableRow key={entity.id} className="border-black/5 hover:bg-black/2">
                        <TableCell className="py-3 font-semibold text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="size-4 text-primary" weight="bold" />
                            <span>{entity.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold tracking-wider bg-black/5 text-foreground border-black/10">
                            {TYPE_LABELS[entity.type] || entity.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                          /entity/{entity.slug}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground max-w-xs truncate">
                          {entity.bioOrDesc || "-"}
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs font-mono">
                          {(entity.articleCount || 0).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-7 rounded-none" onClick={() => openEdit(entity)}>
                              <PencilSimple className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteItem(entity)}
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
            <DialogTitle>{editing ? "Edit Entitas" : "Tambah Entitas Baru"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui informasi entitas." : "Buat entitas baru untuk relationship graph berita."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tipe Entitas</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity-name">Nama Entitas</Label>
              <Input
                id="entity-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="cth: Pemerintah RI"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity-slug">Slug URL</Label>
              <Input
                id="entity-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="cth: pemerintah-ri"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity-desc">Deskripsi / Bio</Label>
              <Textarea
                id="entity-desc"
                value={form.bioOrDesc}
                onChange={(e) => setForm((f) => ({ ...f, bioOrDesc: e.target.value }))}
                placeholder="Deskripsi singkat entitas..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button className="rounded-none bg-primary text-white hover:bg-primary/90" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <CircleNotch className="size-4 animate-spin mr-2" /> : null}
              {editing ? "Simpan Perubahan" : "Buat Entitas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus entitas ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Entitas &quot;{deleteItem?.name}&quot; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
