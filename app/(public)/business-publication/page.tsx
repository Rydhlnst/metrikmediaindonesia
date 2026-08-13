import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Building2, CheckCircle2, Send, ShieldCheck, Zap, Globe, FileText } from "lucide-react";

export const metadata: Metadata = generateMetadata({
  title: "Publish Your Business - Layanan Publikasi Bisnis & Press Release",
  description: "Dapatkan exposure bisnis, tingkatkan kredibilitas brand, dan jangkau jutaan pembaca profesional di Metrik Media Indonesia melalui layanan Siaran Pers Berbayar & Content Partnership.",
  canonical: `${SITE_CONFIG.url}/business-publication`,
});

export default function BusinessPublicationPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase rounded-full tracking-wider inline-flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> Publish Your Business
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            Publikasikan Siaran Pers & Liputan Bisnis Anda
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Tingkatkan kredibilitas organisasi, brand, dan lini bisnis Anda melalui publikasi resmi yang terstruktur, cepat, dan terindeks di media berita profesional Metrik Media Indonesia.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Zap className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Proses Peninjauan Cepat</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tim editor profesional kami akan meninjau draft siaran pers Anda dalam 1x24 jam kerja.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Globe className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Tervalidasi & Terindeks SEO</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Artikel bisnis diterbitkan dengan struktur Schema.org NewsArticle & tag khusus Sponsored Content.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-purple-600" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Laporan Analitik Transparan</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pantau performa pembaca, statistik tayangan, dan engagement artikel Anda via Customer Dashboard.
            </p>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-lg space-y-8">
          <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Formulir Pengajuan Publikasi Bisnis
            </h2>
            <p className="text-xs text-slate-500">
              Isi data perusahaan dan naskah siaran pers di bawah ini untuk memulai peninjauan editorial.
            </p>
          </div>

          <form className="space-y-6" action="#">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Nama Perusahaan / Organisasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Inovasi Solusi Digital"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Website Perusahaan
                </label>
                <input
                  type="url"
                  placeholder="https://perusahaan.co.id"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Email Kontak Person *
                </label>
                <input
                  type="email"
                  required
                  placeholder="corporate@perusahaan.co.id"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Nomor WhatsApp / Telepon *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Judul Artikel / Siaran Pers *
              </label>
              <input
                type="text"
                required
                placeholder="Judul berita utama yang ingin dipublikasikan..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Isi Naskah Berita / Content Press Release *
              </label>
              <textarea
                rows={6}
                required
                placeholder="Tuliskan isi lengkap artikel siaran pers Anda di sini..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Kirimkan untuk Peninjauan Editorial
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
