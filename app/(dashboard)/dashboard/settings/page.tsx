"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto max-w-3xl space-y-6">
        {/* General Settings */}
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-bold">Pengaturan Umum</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium">Nama Situs</label>
              <input
                type="text"
                defaultValue="Metrik Media Indonesia"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Deskripsi</label>
              <textarea
                rows={3}
                defaultValue="Portal berita terpercaya, terkini, dan akurat dari Metrik Media Indonesia"
                className="w-full resize-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">URL</label>
              <input
                type="url"
                defaultValue="https://metrikmediaindonesia.id"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
              />
            </div>
            <Button className="rounded-none bg-news-red text-white hover:bg-news-red/90">
              Simpan Pengaturan
            </Button>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-bold">SEO & Metadata</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium">Default Title</label>
              <input
                type="text"
                defaultValue="Metrik Media Indonesia - Portal Berita Terpercaya"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Meta Description</label>
              <textarea
                rows={2}
                defaultValue="Portal berita terpercaya, terkini, dan akurat dari Metrik Media Indonesia"
                className="w-full resize-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Google Analytics ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
              />
            </div>
            <Button className="rounded-none bg-news-red text-white hover:bg-news-red/90">
              Simpan SEO
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-none bg-card ring-0 shadow-sm border-destructive/50">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-bold text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Reset Semua Data</p>
                <p className="text-xs text-muted-foreground">
                  Menghapus seluruh data artikel, komentar, dan pengguna.
                </p>
              </div>
              <Button variant="destructive" className="rounded-none">
                Reset Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
