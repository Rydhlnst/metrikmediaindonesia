import { Metadata } from "next";
import { UserCheck, Plus, Edit, Trash2, Building, User, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Manajemen Entitas Berita - Metrik Media CMS",
  description: "Kelola entitas (Person, Organization, Place) untuk content relationship graph.",
};

const MOCK_ENTITIES = [
  { id: 1, name: "Pemerintah RI", type: "organization", slug: "pemerintah-ri", desc: "Lembaga eksekutif pemerintahan republik Indonesia.", count: 240 },
  { id: 2, name: "Menteri Kominfo", type: "person", slug: "menteri-kominfo", desc: "Pejabat pimpinan kementerian komunikasi.", count: 85 },
  { id: 3, name: "PT Telkom Indonesia", type: "organization", slug: "pt-telkom-indonesia", desc: "BUMN penyedia layanan telekomunikasi.", count: 62 },
  { id: 4, name: "Stadion Gelora Bung Karno", type: "place", slug: "gbk-jakarta", desc: "Kompleks olahraga serbaguna nasional di Jakarta.", count: 45 },
];

export default function EntitiesManagementPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-600" />
            Manajemen Entitas (Entity Relationship System)
          </h1>
          <p className="text-xs text-slate-500">
            Membangun hubungan antar-konten melalui entitas: Tokoh (Person), Organisasi (Organization), dan Tempat (Place).
          </p>
        </div>

        <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Tambah Entitas Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase border-b border-slate-200 dark:border-slate-800 font-bold">
              <th className="p-4">Nama Entitas</th>
              <th className="p-4">Tipe Entitas</th>
              <th className="p-4">Slug URL</th>
              <th className="p-4">Deskripsi / Bio</th>
              <th className="p-4">Berita Terkait</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {MOCK_ENTITIES.map((entity) => (
              <tr key={entity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  {entity.name}
                </td>
                <td className="p-4 text-xs font-semibold capitalize text-purple-600">
                  <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {entity.type}
                  </span>
                </td>
                <td className="p-4 text-xs font-mono text-slate-500">/entity/{entity.slug}</td>
                <td className="p-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">{entity.desc}</td>
                <td className="p-4 text-xs font-semibold">{entity.count} artikel</td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-2 text-slate-500 hover:text-purple-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
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
