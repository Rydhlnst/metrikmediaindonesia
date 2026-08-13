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
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/categories">
              <Button variant="ghost" size="icon" className="size-8">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Kategori Baru</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="rounded-none bg-card ring-0 shadow-sm">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-base font-bold">Informasi Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Nama Kategori</label>
                <Input
                  placeholder="Contoh: Teknologi, Politik, Ekonomi"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="rounded-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold">Slug URL</label>
                <Input
                  placeholder="teknologi"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="rounded-none font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold">Warna Badge</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="size-9 cursor-pointer border border-border bg-transparent p-1"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-32 rounded-none font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi kategori..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-none border border-border bg-background px-3 py-2 text-sm outline-none focus:border-news-red"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none bg-card ring-0 shadow-sm">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-base font-bold">SEO Metadata (Kategori Page)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">SEO Title Override</label>
                <Input
                  placeholder="Judul SEO Kategori (opsional)"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="rounded-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Meta Description</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi SEO untuk Google Search..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full resize-none rounded-none border border-border bg-background px-3 py-2 text-sm outline-none focus:border-news-red"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Link href="/dashboard/categories">
              <Button type="button" variant="outline" className="rounded-none">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90"
            >
              {isSubmitting ? (
                <CircleNotch className="size-4 animate-spin" />
              ) : (
                <FloppyDisk className="size-4" />
              )}
              Simpan Kategori
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
