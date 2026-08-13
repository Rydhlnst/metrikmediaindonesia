"use client";

import { useState, useEffect } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloppyDisk, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

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
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan pengaturan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Pengaturan Situs & SEO Global</h1>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <CircleNotch className="size-8 animate-spin text-news-red" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-bold">Identitas Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Nama Media</label>
                  <Input
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="rounded-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Tagline Redaksi</label>
                  <Input
                    value={siteTagline}
                    onChange={(e) => setSiteTagline(e.target.value)}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Email Redaksi / Kontak</label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="rounded-none font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-bold">Default SEO Global (Google & Social Metadata)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Default Meta Title</label>
                  <Input
                    value={defaultMetaTitle}
                    onChange={(e) => setDefaultMetaTitle(e.target.value)}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Default Meta Description</label>
                  <textarea
                    rows={3}
                    value={defaultMetaDesc}
                    onChange={(e) => setDefaultMetaDesc(e.target.value)}
                    className="w-full resize-none rounded-none border border-border bg-background px-3 py-2 text-sm outline-none focus:border-news-red"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-bold">Media Sosial Resmi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6">
                <Input
                  placeholder="Facebook URL"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="rounded-none font-mono text-xs"
                />
                <Input
                  placeholder="Twitter / X URL"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  className="rounded-none font-mono text-xs"
                />
                <Input
                  placeholder="Instagram URL"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="rounded-none font-mono text-xs"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
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
                Simpan Pengaturan
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
