"use client";

import { useState, useEffect, useRef, use } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FloppyDisk, CircleNotch, Image as ImageIcon, Trash } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditAdvertisementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [position, setPosition] = useState("header");
  const [status, setStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`/api/advertisements/${id}`);
        const data = await res.json();
        if (res.ok) {
          setTitle(data.title || "");
          setImage(data.image || "");
          setLink(data.link || "");
          setPosition(data.position || "header");
          setStatus(data.status || "active");
        } else {
          toast.error(data.message || "Iklan tidak ditemukan");
          router.push("/dashboard/advertisements");
        }
      } catch {
        toast.error("Gagal mengambil data iklan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAd();
  }, [id, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("maxWidth", "1200");

    setIsUploading(true);
    const toastId = toast.loading("Mengunggah dan mengkompresi banner iklan...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal mengunggah gambar");

      setImage(result.data.url);
      toast.success("Banner iklan berhasil diunggah (WebP)", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah gambar", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Judul iklan wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/advertisements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          image,
          link,
          position,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui iklan");

      toast.success("Iklan berhasil diperbarui");
      router.push("/dashboard/advertisements");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui iklan");
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
            <Link href="/dashboard/advertisements">
              <Button variant="ghost" size="icon" className="size-8">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Edit Banner Iklan</h1>
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
                <CardTitle className="text-base font-bold">Informasi Banner Iklan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Judul Iklan / Kampanye</label>
                  <Input
                    placeholder="Judul iklan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Target URL Link</label>
                  <Input
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="rounded-none font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold">Posisi Slot Banner</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
                    >
                      <option value="header">Header Top Banner (728x90)</option>
                      <option value="sidebar">Sidebar Banner (300x250)</option>
                      <option value="inline">Inline Article Banner</option>
                      <option value="footer">Footer Banner</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold">Status Tayang</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
                    >
                      <option value="active">Active (Tayang)</option>
                      <option value="inactive">Inactive (Nonaktif)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Gambar Banner Iklan</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {image ? (
                    <div className="relative aspect-video overflow-hidden border border-border bg-muted">
                      <img src={image} alt="Banner" className="h-full w-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 size-7 rounded-none"
                        onClick={() => setImage("")}
                      >
                        <Trash className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex aspect-video cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted transition-colors hover:border-news-red/50"
                    >
                      {isUploading ? (
                        <CircleNotch className="size-8 animate-spin text-news-red" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto size-8 text-muted-foreground/50" />
                          <p className="mt-2 text-xs font-medium text-foreground">
                            Klik untuk upload banner gambar
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Otomatis dikonversi ke WebP dioptimasi (JPG, PNG, WebP)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Link href="/dashboard/advertisements">
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
                Update Iklan
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
