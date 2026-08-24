"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FloppyDisk, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#DC2626");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Nama dan slug kategori wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          color,
          seoTitle,
          seoDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat kategori");

      toast.success("Kategori berhasil dibuat");
      router.push("/dashboard/categories");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal membuat kategori"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/categories">
              <Button variant="ghost" size="icon" className="size-8 rounded-none">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kategori Baru</h1>
              <p className="text-xs text-muted-foreground">Tambah kategori berita baru untuk pengelompokan artikel.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
            <CardHeader className="border-b border-black/5 px-6 py-4">
              <CardTitle className="text-base font-bold text-foreground">Informasi Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Nama Kategori</label>
                <Input
                  placeholder="Contoh: Teknologi, Politik, Ekonomi"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</label>
                <Input
                  placeholder="teknologi"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Deskripsi (Opsional)</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat seputar rubrik kategori ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-none border border-black/15 bg-white p-3 text-sm outline-none focus:border-[#B8860B]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Warna Identitas Rubrik</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="size-9 rounded-none border border-black/15 cursor-pointer"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-32 rounded-none border-black/15 bg-white font-mono text-xs uppercase focus:border-[#B8860B]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
            <CardHeader className="border-b border-black/5 px-6 py-4">
              <CardTitle className="text-base font-bold text-foreground">Pengaturan SEO Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">SEO Title Override</label>
                <Input
                  placeholder="Judul SEO Kategori (opsional)"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Meta Description</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi SEO untuk Google Search..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full resize-none rounded-none border border-black/15 bg-white p-3 text-sm outline-none focus:border-[#B8860B]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Link href="/dashboard/categories">
              <Button type="button" variant="outline" className="rounded-none text-xs">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-5 py-2.5 shadow-2xs"
            >
              {isSubmitting ? (
                <CircleNotch className="size-4 animate-spin" />
              ) : (
                <FloppyDisk className="size-4" weight="bold" />
              )}
              Simpan Kategori
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
