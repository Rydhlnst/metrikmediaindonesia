import { Metadata } from "next";
import { Hash, Plus, Edit, Trash2, Search, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Manajemen Topik Berita - Metrik Media CMS",
  description: "Kelola daftar topik berita, deskripsi topical authority, dan pemetaan ke artikel.",
};

const MOCK_TOPICS = [
  { id: 1, name: "Pemilu 2029", slug: "pemilu-2029", articlesCount: 120, description: "Liputan isu politik nasional dan tahapan Pemilu 2029." },
  { id: 2, name: "Transformasi Digital", slug: "transformasi-digital", articlesCount: 85, description: "Isu digitalisasi, broadband, dan infrastruktur IT nasional." },
  { id: 3, name: "Piala Dunia U-20", slug: "piala-dunia-u-20", articlesCount: 64, description: "Kabar Garuda Muda dan pertandingan internasional." },
  { id: 4, name: "IHSG & Pasar Saham", slug: "ihsg-dan-pasar-saham", articlesCount: 42, description: "Perkembangan bursa efek Indonesia dan investasi modal." },
];

export default function TopicsManagementPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Hash className="w-6 h-6 text-blue-600" />
            Manajemen Topik Berita (Topic System)
          </h1>
          <p className="text-xs text-slate-500">
            Topik membangun topical authority di Google News melalui pengelompokan entitas berita lintas kategori.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Tambah Topik Baru
        </button>
      </div>

      {/* Topics Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase border-b border-slate-200 dark:border-slate-800 font-bold">
              <th className="p-4">Nama Topik</th>
              <th className="p-4">Slug URL</th>
              <th className="p-4">Deskripsi</th>
              <th className="p-4">Jumlah Artikel</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {MOCK_TOPICS.map((topic) => (
              <tr key={topic.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-blue-600" />
                  {topic.name}
                </td>
                <td className="p-4 text-xs font-mono text-slate-500">/topic/{topic.slug}</td>
                <td className="p-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">{topic.description}</td>
                <td className="p-4 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {topic.articlesCount} artikel
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
