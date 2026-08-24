"use client";

import { useState, useEffect } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloppyDisk, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("Metrik Media Indonesia");
  const [siteTagline, setSiteTagline] = useState("Media Berita Terpercaya & Independen");
  const [defaultMetaTitle, setDefaultMetaTitle] = useState("Metrik Media Indonesia - Berita Terkini");
  const [defaultMetaDesc, setDefaultMetaDesc] = useState("Portal berita terkini Indonesia menyajikan berita politik, ekonomi, teknologi, dan olahraga.");
  const [contactEmail, setContactEmail] = useState("redaksi@metrikmediaindonesia.id");
  const [facebookUrl, setFacebookUrl] = useState("https://facebook.com/metrikmediaid");
  const [twitterUrl, setTwitterUrl] = useState("https://twitter.com/metrikmediaid");
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/metrikmediaid");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (res.ok && data) {
          if (data.siteName) setSiteName(data.siteName);
          if (data.siteTagline) setSiteTagline(data.siteTagline);
          if (data.defaultMetaTitle) setDefaultMetaTitle(data.defaultMetaTitle);
          if (data.defaultMetaDesc) setDefaultMetaDesc(data.defaultMetaDesc);
          if (data.contactEmail) setContactEmail(data.contactEmail);
          if (data.facebookUrl) setFacebookUrl(data.facebookUrl);
          if (data.twitterUrl) setTwitterUrl(data.twitterUrl);
          if (data.instagramUrl) setInstagramUrl(data.instagramUrl);
        }
      } catch {
        toast.error("Gagal mengambil pengaturan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          siteTagline,
          defaultMetaTitle,
          defaultMetaDesc,
          contactEmail,
          facebookUrl,
          twitterUrl,
          instagramUrl,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan pengaturan");

      toast.success("Pengaturan situs berhasil disimpan");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan pengaturan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Pengaturan Situs & SEO Global</h1>
            <p className="text-xs text-muted-foreground">Konfigurasi metadata redaksi, nama media, identitas, dan media sosial resmi.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <CircleNotch className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Identitas Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Nama Media</label>
                  <Input
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Tagline Redaksi</label>
                  <Input
                    value={siteTagline}
                    onChange={(e) => setSiteTagline(e.target.value)}
                    className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Email Redaksi / Kontak</label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Default SEO Global (Google & Social Metadata)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Default Meta Title</label>
                  <Input
                    value={defaultMetaTitle}
                    onChange={(e) => setDefaultMetaTitle(e.target.value)}
                    className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Default Meta Description</label>
                  <textarea
                    rows={3}
                    value={defaultMetaDesc}
                    onChange={(e) => setDefaultMetaDesc(e.target.value)}
                    className="w-full resize-none rounded-none border border-black/15 bg-white p-3 text-sm outline-none focus:border-[#B8860B]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Media Sosial Resmi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Facebook</label>
                  <Input
                    placeholder="https://facebook.com/..."
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Twitter / X</label>
                  <Input
                    placeholder="https://x.com/..."
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Instagram</label>
                  <Input
                    placeholder="https://instagram.com/..."
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
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
                Simpan Pengaturan
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
