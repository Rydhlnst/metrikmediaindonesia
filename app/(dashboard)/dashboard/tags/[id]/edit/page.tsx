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

export default function EditTagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const res = await fetch(`/api/tags/${id}`);
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setSlug(data.slug || "");
        } else {
          toast.error(data.message || "Tag tidak ditemukan");
          router.push("/dashboard/tags");
        }
      } catch {
        toast.error("Gagal mengambil data tag");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTag();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Nama dan slug tag wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui tag");

      toast.success("Tag berhasil diperbarui");
      router.push("/dashboard/tags");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/tags">
              <Button variant="ghost" size="icon" className="size-8">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Edit Tag</h1>
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
                <CardTitle className="text-base font-bold">Informasi Tag</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Nama Tag</label>
                  <Input
                    placeholder="Nama tag"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Slug Tag</label>
                  <Input
                    placeholder="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-none font-mono text-xs"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Link href="/dashboard/tags">
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
                Update Tag
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
