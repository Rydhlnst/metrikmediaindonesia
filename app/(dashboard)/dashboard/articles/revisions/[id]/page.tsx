import { Metadata } from "next";
import { History, AlertCircle, FileCheck, CheckCircle2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Histori Revisi & Catatan Koreksi - Metrik Media CMS",
  description: "Lihat perbedaan revisi artikel dan catat koreksi jurnalistik resmi.",
};

export default function ArticleRevisionsPage() {
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-blue-600" />
          Histori Perubahan Artikel & Correction Notice
        </h1>
        <p className="text-xs text-slate-500">
          Artikel ID #101: Indonesia Luncurkan Program Transformasi Digital Nasional 2026-2030
        </p>
      </div>

      {/* Published Correction Form */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          Terbitkan Catatan Koreksi Publik (Correction Notice)
        </h2>
        <p className="text-xs text-amber-800 dark:text-amber-300">
          Setiap perbaikan fakta signifikan wajib menyertakan catatan penjelasan transparan yang dapat dilihat oleh pembaca publik.
        </p>
        <div className="space-y-3">
          <textarea
            rows={3}
            placeholder="Contoh: Koreksi: Artikel ini diperbarui pada 13 Agustus 2026 untuk memperbaiki informasi nilai investasi awal."
            className="w-full p-3 text-sm rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          ></textarea>
          <button className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-colors">
            Simpan & Lampirkan Catatan Koreksi ke Artikel
          </button>
        </div>
      </div>

      {/* Revision History Log */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Log Riwayat Versi (Revisions)
        </h2>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                Revisi #3 (Dipublikasikan)
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 13 Agustus 2026, 10:42 WIB
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Diubah oleh: Editor Andi (Editor-in-Chief)
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Catatan: Memperbarui data anggaran broadband dan menyelaraskan dengan rilis kementerian resmi.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                Revisi #2 (Review Editor)
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 13 Agustus 2026, 09:15 WIB
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Diubah oleh: Ahmad Rizky Pratama (Jurnalis)
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Catatan: Memperbaiki ejaan judul dan menyisipkan 2 foto liputan lokasi.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
