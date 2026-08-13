import { Metadata } from "next";
import { MapPin, Plus, Edit, Trash2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Manajemen Wilayah & Lokasi - Metrik Media CMS",
  description: "Kelola hirarki wilayah (Provinsi, Kota/Kabupaten, Kecamatan) untuk berita daerah.",
};

const MOCK_LOCATIONS = [
  { id: 1, name: "Jawa Barat", level: "province", slug: "jawa-barat", parent: "Indonesia", count: 420 },
  { id: 2, name: "Bandung", level: "city", slug: "bandung", parent: "Jawa Barat", count: 180 },
  { id: 3, name: "Karawang", level: "district", slug: "karawang", parent: "Jawa Barat", count: 95 },
  { id: 4, name: "Jawa Tengah", level: "province", slug: "jawa-tengah", parent: "Indonesia", count: 310 },
  { id: 5, name: "Jawa Timur", level: "province", slug: "jawa-timur", parent: "Indonesia", count: 280 },
];

export default function LocationsManagementPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Manajemen Hirarki Wilayah (Location System)
          </h1>
          <p className="text-xs text-slate-500">
            Struktur hirarki wilayah: Indonesia &rarr; Provinsi &rarr; Kota/Kabupaten &rarr; Kecamatan.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Tambah Lokasi Wilayah
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase border-b border-slate-200 dark:border-slate-800 font-bold">
              <th className="p-4">Nama Wilayah</th>
              <th className="p-4">Tingkat / Level</th>
              <th className="p-4">Induk Wilayah</th>
              <th className="p-4">Slug URL</th>
              <th className="p-4">Artikel Terkait</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {MOCK_LOCATIONS.map((loc) => (
              <tr key={loc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {loc.name}
                </td>
                <td className="p-4 text-xs font-semibold capitalize text-emerald-600">{loc.level}</td>
                <td className="p-4 text-xs text-slate-500">{loc.parent}</td>
                <td className="p-4 text-xs font-mono text-slate-500">/location/{loc.slug}</td>
                <td className="p-4 text-xs font-semibold">{loc.count} berita</td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-2 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
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
