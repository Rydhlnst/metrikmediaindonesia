import { Metadata } from "next";
import { ArrowRightLeft, Plus, Trash2, Edit } from "lucide-react";

export const metadata: Metadata = {
  title: "Redirect Manager - Metrik Media CMS",
  description: "Kelola pengalihan URL (301/302 Redirects) untuk mencegah unbroken link dan menjaga reputasi SEO.",
};

const MOCK_REDIRECTS = [
  { id: 1, oldUrl: "/news/old-digital-title", newUrl: "/news/indonesia-luncurkan-program-transformasi-digital-nasional-2026-2030", code: 301, status: "Active" },
  { id: 2, oldUrl: "/berita/lama-pasar-saham", newUrl: "/news/pasar-saham-indonesia-catat-rekor-tertinggi-sepanjang-sejarah", code: 301, status: "Active" },
];

export default function RedirectsManagementPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-blue-600" />
            Redirect Manager (301 & 302 URL Forwarding)
          </h1>
          <p className="text-xs text-slate-500">
            Mengalihkan URL artikel lama atau diubah ke URL baru tanpa kehilangan otoritas pencarian (SEO Link Equity).
          </p>
        </div>

        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Tambah Aturan Redirect Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase border-b border-slate-200 dark:border-slate-800 font-bold">
              <th className="p-4">URL Asal (Old URL)</th>
              <th className="p-4">URL Tujuan (New URL)</th>
              <th className="p-4">HTTP Status</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {MOCK_REDIRECTS.map((red) => (
              <tr key={red.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono text-xs text-red-500 font-semibold">{red.oldUrl}</td>
                <td className="p-4 font-mono text-xs text-emerald-600 font-semibold">{red.newUrl}</td>
                <td className="p-4 text-xs font-bold">{red.code} Permanent</td>
                <td className="p-4 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {red.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
