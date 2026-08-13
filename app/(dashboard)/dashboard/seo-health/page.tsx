import { Metadata } from "next";
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Search, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "SEO Health Dashboard - Metrik Media CMS",
  description: "Dashboard kesehatan SEO teknis, sitemap, indeksasi, dan checklist pra-publikasi berita.",
};

const CHECKLIST_ITEMS = [
  { label: "Title tag & Headings terisi dan valid", status: "passed" },
  { label: "Slug URL bersih (lowercase, hyphen-separated)", status: "passed" },
  { label: "Meta description unik tersedia (150-160 karakter)", status: "passed" },
  { label: "Featured Image & Image Alt text terisi", status: "passed" },
  { label: "Author profile & Editorial role terasosiasi", status: "passed" },
  { label: "Kategori & Subkategori terdistribusi", status: "passed" },
  { label: "Topik & Entitas terhubung", status: "passed" },
  { label: "Canonical URL valid (mencegah duplicate content)", status: "passed" },
  { label: "NewsArticle JSON-LD structured data valid", status: "passed" },
  { label: "Internal links ke artikel/topik terkait tersedia", status: "warning", message: "Disarankan menambah minimal 2 internal link" },
];

export default function SeoHealthPage() {
  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          SEO Health Dashboard & Pre-Publish Checklist
        </h1>
        <p className="text-xs text-slate-500">
          Evaluasi otomatis technical SEO, keterindeksan (indexability), kelayakan sitemap, dan Schema.org.
        </p>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase">Skor Kesehatan SEO</span>
          <p className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">96 / 100</p>
          <p className="text-xs text-emerald-600">Sangat baik! Semua halaman utama indexable.</p>
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase">Status Sitemap</span>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">Terverifikasi</p>
          <p className="text-xs text-blue-600">/sitemap.xml & /news-sitemap.xml aktif</p>
        </div>

        <div className="p-6 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-purple-700 uppercase">Structured Data</span>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">100% Valid</p>
          <p className="text-xs text-purple-600">NewsArticle, Breadcrumb & Organization</p>
        </div>
      </div>

      {/* Pre-Publish Checklist Component */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Content SEO Checklist Pra-Publikasi
        </h2>

        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                {item.status === "passed" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                )}
                <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
              </div>

              <div>
                {item.status === "passed" ? (
                  <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 rounded-full">
                    Passed
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 rounded-full">
                    Warning
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
