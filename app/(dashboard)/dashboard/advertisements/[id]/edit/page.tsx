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
import { getErrorMessage } from "@/lib/error-message";
import { MediaImage } from "@/components/shared/media-image";

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
          toast.error(getErrorMessage(new Error(data.message || ""), "Iklan tidak ditemukan"));
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal mengunggah gambar"), { id: toastId });
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memperbarui iklan"));
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
            <Link href="/dashboard/advertisements">
              <Button variant="ghost" size="icon" className="size-8 rounded-none">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Edit Banner Iklan</h1>
              <p className="text-xs text-muted-foreground">Perbarui materi kampanye, link tujuan, dan status slot iklan.</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <CircleNotch className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Informasi Banner Iklan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Judul Iklan / Kampanye</label>
                  <Input
                    placeholder="Judul iklan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Target URL Link</label>
                  <Input
                    placeholder="https://client-website.com/promo"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Posisi Slot Banner</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full rounded-none border border-black/15 bg-white px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-[#B8860B]"
                    >
                      <option value="header">Header Top Banner (728x90)</option>
                      <option value="sidebar">Sidebar Banner (300x250)</option>
                      <option value="inline">Inline Article Banner</option>
                      <option value="footer">Footer Banner</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Status Tayang</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-none border border-black/15 bg-white px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-[#B8860B]"
                    >
                      <option value="active">Active (Tayang)</option>
                      <option value="inactive">Inactive (Nonaktif)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Materi Banner Gambar</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {image ? (
                    <div className="relative border border-black/10 bg-muted overflow-hidden">
                      <MediaImage src={image} alt="Banner Preview" fill={false} width={640} height={360} className="max-h-48 w-full object-contain" />
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
                      className="flex aspect-video cursor-pointer flex-col items-center justify-center border-2 border-dashed border-black/15 bg-white transition-colors hover:border-[#B8860B]"
                    >
                      {isUploading ? (
                        <CircleNotch className="size-8 animate-spin text-primary" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto size-8 text-muted-foreground/50" />
                          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-foreground">
                            Klik untuk upload banner gambar
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
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
                Update Iklan
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
