"use client";

import { useState, useEffect } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Calendar, ArrowLeft, FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface Profile {
  id: number;
  name: string;
  slug: string;
  email: string | null;
  bio: string | null;
  avatar: string | null;
  role: string | null;
  status: string;
  joinedAt: string;
  totalArticles: number;
  totalViews: number;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  } | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
          setName(data.name || "");
          setBio(data.bio || "");
          setAvatar(data.avatar || "");
          setTwitter(data.socialLinks?.twitter || "");
          setInstagram(data.socialLinks?.instagram || "");
          setLinkedin(data.socialLinks?.linkedin || "");
          setFacebook(data.socialLinks?.facebook || "");
        } else {
          toast.error(data.message || "Gagal memuat profil");
        }
      } catch {
        toast.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim() || null,
          avatar: avatar.trim() || null,
          socialLinks: {
            twitter: twitter.trim() || undefined,
            instagram: instagram.trim() || undefined,
            linkedin: linkedin.trim() || undefined,
            facebook: facebook.trim() || undefined,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profil berhasil diperbarui!");
      } else {
        toast.error(data.message || "Gagal memperbarui profil");
      }
    } catch {
      toast.error("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
        <DashboardTopbar />
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
        <DashboardTopbar />
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          <p className="text-muted-foreground">Profil tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-black/5 pb-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="size-8 rounded-none border border-black/10 bg-white hover:bg-black/5">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Profil Saya</h1>
            <p className="text-sm text-muted-foreground mt-1">Kelola informasi profil Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <User className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.name}</p>
                  <Badge variant="outline" className="text-xs">{profile.role || "Kontributor"}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{profile.totalArticles}</p>
                  <p className="text-xs text-muted-foreground">Artikel</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{profile.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <Calendar className="size-3" />
                <span>Bergabung {new Date(profile.joinedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Edit Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ceritakan tentang diri Anda..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Sosial Media</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Twitter/X URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                  <Input placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                  <Input placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                  <Input placeholder="Facebook URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleSave} disabled={saving}>
                  <FloppyDisk className="size-4 mr-2" />
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
