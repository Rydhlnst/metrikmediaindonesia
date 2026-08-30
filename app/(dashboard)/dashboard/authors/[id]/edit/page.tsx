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
          toast.error(getErrorMessage(new Error(data.message || ""), "Penulis tidak ditemukan"));
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal mengunggah foto"), { id: toastId });
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memperbarui penulis"));
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
            <Link href="/dashboard/authors">
              <Button variant="ghost" size="icon" className="size-8 rounded-none">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Edit Penulis</h1>
              <p className="text-xs text-muted-foreground">Perbarui profil, role redaksi, dan kontak tim redaksi.</p>
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
                <CardTitle className="text-base font-bold text-foreground">Profil Penulis / Reporter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Nama Lengkap</label>
                  <Input
                    placeholder="Nama penulis"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</label>
                    <Input
                      placeholder="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Role Redaksi</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-none border border-black/15 bg-white px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-[#B8860B]"
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
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Bio / Deskripsi Profil</label>
                  <textarea
                    rows={3}
                    placeholder="Bio penulis..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full resize-none rounded-none border border-black/15 bg-white p-3 text-sm outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">URL Foto Avatar</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                    />
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    <Button type="button" variant="outline" className="shrink-0 gap-2 rounded-none text-xs" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      <ImageIcon className="size-4" />
                      {isUploading ? "Mengunggah..." : "Unggah"}
                    </Button>
                    {avatar ? (
                      <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-none" aria-label="Hapus avatar" onClick={() => setAvatar("")}>
                        <Trash className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Media Sosial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <Input
                  placeholder="Twitter / X handle (@username)"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="rounded-none border-black/15 bg-white text-xs focus:border-[#B8860B]"
                />
                <Input
                  placeholder="Instagram handle (@username)"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="rounded-none border-black/15 bg-white text-xs focus:border-[#B8860B]"
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="rounded-none border-black/15 bg-white text-xs focus:border-[#B8860B]"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Link href="/dashboard/authors">
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
                Update Penulis
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
