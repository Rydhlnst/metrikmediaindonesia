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
import { getErrorMessage } from "@/lib/error-message";

export default function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(`/api/roles/${id}`);
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setDescription(data.description || "");
        } else {
          toast.error(getErrorMessage(new Error(data.message || ""), "Role tidak ditemukan"));
          router.push("/dashboard/roles");
        }
      } catch {
        toast.error("Gagal mengambil data role");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Nama role wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui role");

      toast.success("Role berhasil diperbarui");
      router.push("/dashboard/roles");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memperbarui role"));
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
            <Link href="/dashboard/roles">
              <Button variant="ghost" size="icon" className="size-8 rounded-none">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Edit Role</h1>
              <p className="text-xs text-muted-foreground">Perbarui informasi nama dan batasan hak akses role pengguna.</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <CircleNotch className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Informasi Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Nama Role</label>
                  <Input
                    placeholder="Nama role"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Deskripsi Akses & Hak</label>
                  <textarea
                    rows={4}
                    placeholder="Deskripsi hak akses..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full resize-none rounded-none border border-black/15 bg-white p-3 text-sm outline-none focus:border-[#B8860B]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Link href="/dashboard/roles">
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
                Update Role
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
