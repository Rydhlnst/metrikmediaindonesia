"use client";

import { useState, useEffect, use } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FloppyDisk, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#DC2626");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setSlug(data.slug || "");
          setDescription(data.description || "");
          setColor(data.color || "#DC2626");
          setSeoTitle(data.seoTitle || "");
          setSeoDescription(data.seoDescription || "");
        } else {
          toast.error(data.message || "Kategori tidak ditemukan");
          router.push("/dashboard/categories");
        }
      } catch {
        toast.error("Gagal mengambil data kategori");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Nama dan slug kategori wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
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
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui kategori");

      toast.success("Kategori berhasil diperbarui");
      router.push("/dashboard/categories");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui kategori");
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
            <h1 className="text-lg font-bold">Edit Kategori</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <CircleNotch className="size-8 animate-spin text-news-red" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-bold">Informasi Kategori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Nama Kategori</label>
                  <Input
                    placeholder="Nama kategori"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Slug URL</label>
                  <Input
                    placeholder="slug"
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
                <CardTitle className="text-base font-bold">SEO Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">SEO Title Override</label>
                  <Input
                    placeholder="Judul SEO Kategori"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Meta Description</label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsi SEO..."
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
                Update Kategori
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
