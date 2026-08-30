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
import { Plus, TagSimple, PencilSimple, Trash, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  articleCount?: number;
}

const emptyForm = { name: "", slug: "", description: "" };

export default function TopicsManagementPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteItem, setDeleteItem] = useState<Topic | null>(null);

  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/topics");
      const data = await res.json();
      if (res.ok) setTopics(data || []);
      else toast.error(getErrorMessage(new Error(data.message || ""), "Gagal mengambil data topik"));
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchTopics());
  }, [fetchTopics]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (topic: Topic) => {
    setEditing(topic);
    setForm({
      name: topic.name,
      slug: topic.slug,
      description: topic.description || "",
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
      const res = await fetch(editing ? `/api/topics/${editing.id}` : "/api/topics", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan topik");
      toast.success(editing ? "Topik berhasil diperbarui" : "Topik berhasil dibuat");
      setDialogOpen(false);
      fetchTopics();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan topik"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/topics/${deleteItem.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus topik");
      }
      toast.success("Topik berhasil dihapus");
      setDeleteItem(null);
      fetchTopics();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus topik"));
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Topik Berita (Topical Authority)</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Membangun topical authority di Google News melalui pengelompokan entitas berita.</p>
            </div>
            <Button
              onClick={openCreate}
              className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs"
            >
              <Plus className="size-4" weight="bold" />
              Tambah Topik
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Nama Topik</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Deskripsi</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Jumlah Artikel</TableHead>
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
                  ) : topics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Belum ada topik. Klik &quot;Tambah Topik&quot; untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    topics.map((topic) => (
                      <TableRow key={topic.id} className="border-black/5 hover:bg-black/2">
                        <TableCell className="py-3 font-semibold text-sm">
                          <div className="flex items-center gap-2">
                            <TagSimple className="size-4 text-primary" weight="bold" />
                            <span>{topic.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                          /topic/{topic.slug}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground max-w-xs truncate">
                          {topic.description || "-"}
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs font-mono">
                          {(topic.articleCount || 0).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-7 rounded-none" onClick={() => openEdit(topic)}>
                              <PencilSimple className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteItem(topic)}
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
            <DialogTitle>{editing ? "Edit Topik" : "Tambah Topik Baru"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui informasi topik berita." : "Buat topik baru untuk pengelompokan artikel."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="topic-name">Nama Topik</Label>
              <Input
                id="topic-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="cth: Pemilu 2029"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-slug">Slug URL</Label>
              <Input
                id="topic-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="cth: pemilu-2029"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-desc">Deskripsi</Label>
              <Textarea
                id="topic-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Deskripsi singkat topical authority topik ini..."
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
              {editing ? "Simpan Perubahan" : "Buat Topik"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus topik ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Topik &quot;{deleteItem?.name}&quot; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
