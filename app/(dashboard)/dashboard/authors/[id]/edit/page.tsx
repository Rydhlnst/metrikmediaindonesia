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

export default function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [role, setRole] = useState("Redaktur");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await fetch(`/api/authors/${id}`);
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setSlug(data.slug || "");
          setRole(data.role || "Redaktur");
          setBio(data.bio || "");
          setAvatar(data.avatar || "");
          if (data.socialLinks) {
            setTwitter(data.socialLinks.twitter || "");
            setInstagram(data.socialLinks.instagram || "");
            setLinkedin(data.socialLinks.linkedin || "");
          }
        } else {
          toast.error(data.message || "Penulis tidak ditemukan");
          router.push("/dashboard/authors");
        }
      } catch {
        toast.error("Gagal mengambil data penulis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [id, router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("maxWidth", "500");

    setIsUploading(true);
    const toastId = toast.loading("Mengunggah foto profil...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal mengunggah foto");

      setAvatar(result.data.url);
      toast.success("Foto profil berhasil diunggah (WebP)", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah foto", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Nama dan slug penulis wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/authors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          role,
          bio,
          avatar,
          socialLinks: { twitter, instagram, linkedin },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui penulis");

      toast.success("Penulis berhasil diperbarui");
      router.push("/dashboard/authors");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui penulis");
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
            <Link href="/dashboard/authors">
              <Button variant="ghost" size="icon" className="size-8">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Edit Penulis</h1>
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
                <CardTitle className="text-base font-bold">Profil Penulis / Reporter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Nama Lengkap</label>
                  <Input
                    placeholder="Nama penulis"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-none"
                    required
                  />
                </div>

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
                    <label className="mb-1.5 block text-xs font-semibold">Role Redaksi</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
                    >
                      <option value="Pemred">Pemred (Editor-in-Chief)</option>
                      <option value="Redaktur">Redaktur</option>
                      <option value="Reporter">Reporter</option>
                      <option value="Jurnalis">Jurnalis</option>
                      <option value="Contributor">Contributor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Biografi Singkat</label>
                  <textarea
                    rows={3}
                    placeholder="Biografi singkat..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full resize-none rounded-none border border-border bg-background px-3 py-2 text-sm outline-none focus:border-news-red"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Foto Profil Avatar</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  {avatar ? (
                    <div className="relative size-24 border border-border bg-muted overflow-hidden">
                      <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 size-6 rounded-none"
                        onClick={() => setAvatar("")}
                      >
                        <Trash className="size-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex size-24 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted transition-colors hover:border-news-red/50"
                    >
                      {isUploading ? (
                        <CircleNotch className="size-6 animate-spin text-news-red" />
                      ) : (
                        <ImageIcon className="size-6 text-muted-foreground/50" />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-bold">Media Sosial (Opsional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6">
                <Input
                  placeholder="Twitter / X handle (@username)"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="rounded-none"
                />
                <Input
                  placeholder="Instagram handle (@username)"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="rounded-none"
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="rounded-none"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Link href="/dashboard/authors">
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
                Update Penulis
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
