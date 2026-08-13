"use client";

import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { DashboardTopbar } from "@/components/dashboard/topbar";
const TiptapEditor = dynamic(
  () => import("@/components/dashboard/tiptap-editor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="min-h-[300px] bg-muted/30 animate-pulse" /> }
);
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FloppyDisk, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditStaticPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/pages/${id}`);
        const data = await res.json();
        if (res.ok) {
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setStatus(data.status || "published");
          setSeoTitle(data.seoTitle || "");
          setSeoDescription(data.seoDescription || "");
        } else {
          toast.error(data.message || "Halaman tidak ditemukan");
          router.push("/dashboard/pages");
        }
      } catch {
        toast.error("Gagal mengambil data halaman");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      toast.error("Judul dan slug halaman wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          status,
          seoTitle,
          seoDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui halaman");

      toast.success("Halaman berhasil diperbarui");
      router.push("/dashboard/pages");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui halaman");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/pages">
              <Button variant="ghost" size="icon" className="size-8">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Edit Halaman Statis</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <CircleNotch className="size-8 animate-spin text-news-red" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardContent className="p-4">
                <input
                  type="text"
                  placeholder="Judul halaman"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground"
                  required
                />
              </CardContent>
            </Card>

            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-bold">Konten Halaman</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <TiptapEditor content={content} onChange={setContent} />
              </CardContent>
            </Card>

            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-bold">Pengaturan & SEO Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
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
                    <label className="mb-1.5 block text-xs font-semibold">Status Halaman</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">SEO Title Override</label>
                  <Input
                    placeholder="Judul SEO Halaman"
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
              <Link href="/dashboard/pages">
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
                Update Halaman
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
