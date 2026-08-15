import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ClockCounterClockwise, WarningCircle, Clock, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Histori Revisi & Catatan Koreksi - Metrik Media CMS",
  description: "Lihat perbedaan revisi artikel dan catat koreksi jurnalistik resmi.",
};

export default function ArticleRevisionsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/articles">
              <Button variant="ghost" size="icon" className="size-8 rounded-none">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ClockCounterClockwise className="size-5 text-[#B8860B]" weight="bold" />
                Histori Perubahan Artikel & Correction Notice
              </h1>
              <p className="text-xs text-muted-foreground">
                Audit trail transparansi redaksi dan catatan koreksi fakta publik sesuai pedoman siber.
              </p>
            </div>
          </div>
        </div>

        {/* Published Correction Form */}
        <Card className="rounded-none border border-amber-300 bg-amber-50/50 shadow-2xs">
          <CardHeader className="border-b border-amber-200/60 px-6 py-4">
            <CardTitle className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <WarningCircle className="size-4 text-amber-600" weight="fill" />
              Terbitkan Catatan Koreksi Publik (Correction Notice)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-xs text-amber-800">
              Setiap perbaikan fakta signifikan wajib menyertakan catatan penjelasan transparan yang dapat dilihat oleh pembaca publik pada bagian akhir artikel.
            </p>
            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="Contoh: Koreksi: Artikel ini diperbarui pada 13 Agustus 2026 untuk memperbaiki informasi nilai investasi awal."
                className="w-full resize-none rounded-none border border-amber-300 bg-white p-3 text-sm outline-none focus:border-[#B8860B]"
              />
              <Button className="rounded-none bg-amber-700 hover:bg-amber-800 text-white font-bold uppercase tracking-wider text-xs px-4 py-2 shadow-2xs">
                Simpan & Lampirkan Catatan Koreksi ke Artikel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Revision History Log */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">
            Log Riwayat Versi (Revision Logs)
          </h2>

          <div className="space-y-4">
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="rounded-none uppercase tracking-wider text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  >
                    Revisi #3 (Dipublikasikan)
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3.5" /> 13 Agustus 2026, 10:42 WIB
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  Diubah oleh: Editor Andi (Editor-in-Chief)
                </p>
                <p className="text-xs text-muted-foreground">
                  Catatan: Memperbarui data anggaran broadband dan menyelaraskan dengan rilis kementerian resmi.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="rounded-none uppercase tracking-wider text-[10px] font-bold bg-blue-500/10 text-blue-600 border-blue-500/20"
                  >
                    Revisi #2 (Review Editor)
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3.5" /> 13 Agustus 2026, 09:15 WIB
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  Diubah oleh: Ahmad Rizky Pratama (Jurnalis)
                </p>
                <p className="text-xs text-muted-foreground">
                  Catatan: Memperbaiki ejaan judul dan menyisipkan 2 foto liputan lokasi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
