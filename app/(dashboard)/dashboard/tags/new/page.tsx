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

export default function NewTagPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
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
      toast.error("Nama dan slug tag wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat tag");

      toast.success("Tag berhasil dibuat");
      router.push("/dashboard/tags");
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat tag");
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
            <Link href="/dashboard/tags">
              <Button variant="ghost" size="icon" className="size-8 rounded-none">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tag Baru</h1>
              <p className="text-xs text-muted-foreground">Tambah tag artikel berita baru untuk tagging lintas topik.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
            <CardHeader className="border-b border-black/5 px-6 py-4">
              <CardTitle className="text-base font-bold text-foreground">Informasi Tag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Nama Tag</label>
                <Input
                  placeholder="Contoh: Breaking News, Pilpres 2026"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Slug Tag</label>
                <Input
                  placeholder="breaking-news"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Link href="/dashboard/tags">
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
              Simpan Tag
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
