import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Buildings, PaperPlaneRight, ShieldCheck, Lightning, Globe, FileText } from "@phosphor-icons/react/dist/ssr";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = generateMetadata({
  title: "Publish Your Business - Layanan Publikasi Bisnis & Siaran Pers",
  description: "Dapatkan exposure bisnis, tingkatkan kredibilitas brand, dan jangkau jutaan pembaca profesional di Metrik Media Indonesia melalui layanan Siaran Pers & Content Partnership.",
  canonical: `${SITE_CONFIG.url}/business-publication`,
});

export default function BusinessPublicationPage() {
  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Standardized Reusable Header */}
        <PublicPageHeader
          title="Publish Business"
          description="Tingkatkan kredibilitas organisasi, brand, dan inovasi korporasi Anda melalui publikasi resmi yang terstruktur, cepat, dan terindeks di media berita profesional Metrik Media Indonesia."
        />

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-none border border-black/10 space-y-3">
            <Lightning className="size-7 text-primary" weight="fill" />
            <h3 className="font-bold text-foreground text-base">Peninjauan Cepat 1x24 Jam</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tim editor berpengalaman kami akan menelaah draf siaran pers dan keselarasan fakta dalam 1x24 jam kerja.
            </p>
          </div>
          <div className="p-6 bg-white rounded-none border border-black/10 space-y-3">
            <Globe className="size-7 text-emerald-600" weight="fill" />
            <h3 className="font-bold text-foreground text-base">Teroptimasi & Terindeks SEO</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Artikel bisnis diterbitkan dengan struktur Schema.org NewsArticle dan meta tags optimal untuk mesin pencari.
            </p>
          </div>
          <div className="p-6 bg-white rounded-none border border-black/10 space-y-3">
            <ShieldCheck className="size-7 text-gold" weight="fill" />
            <h3 className="font-bold text-foreground text-base">Standar Kredibilitas Tinggi</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Memenuhi Pedoman Pemberitaan Media Siber untuk menjaga integritas nama baik perusahaan Anda.
            </p>
          </div>
        </div>

        {/* Section Header */}
        <SectionHeader
          title="FORMULIR PENGAJUAN PUBLIKASI"
          icon={<FileText className="size-4" weight="bold" />}
        />

        {/* Submission Form */}
        <div className="bg-white rounded-none border border-black/10 p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5 border-b border-black/10 pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="size-5 text-gold-deep" weight="bold" />
              Formulir Siaran Pers & Kemitraan Konten
            </h2>
            <p className="text-xs text-muted-foreground">
              Lengkapi data perusahaan dan naskah siaran pers di bawah ini untuk memulai proses editorial.
            </p>
          </div>

          <form className="space-y-6" action="#">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Nama Perusahaan / Organisasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Inovasi Digital Nusantara"
                  className="w-full px-3.5 py-2.5 rounded-none border border-black/15 bg-white text-foreground text-xs font-medium focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Website Perusahaan
                </label>
                <input
                  type="url"
                  placeholder="https://perusahaan.co.id"
                  className="w-full px-3.5 py-2.5 rounded-none border border-black/15 bg-white text-foreground text-xs font-medium focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Email Kontak Narahubung *
                </label>
                <input
                  type="email"
                  required
                  placeholder="corporate@perusahaan.co.id"
                  className="w-full px-3.5 py-2.5 rounded-none border border-black/15 bg-white text-foreground text-xs font-medium focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Nomor WhatsApp / Telepon *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2.5 rounded-none border border-black/15 bg-white text-foreground text-xs font-medium focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Judul Siaran Pers / Artikel Bisnis *
              </label>
              <input
                type="text"
                required
                placeholder="Judul siaran pers yang ingin dipublikasikan..."
                className="w-full px-3.5 py-2.5 rounded-none border border-black/15 bg-white text-foreground text-xs font-medium focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Isi Naskah Siaran Pers (Press Release) *
              </label>
              <textarea
                rows={6}
                required
                placeholder="Tuliskan naskah lengkap berita siaran pers perusahaan Anda di sini..."
                className="w-full px-3.5 py-2.5 rounded-none border border-black/15 bg-white text-foreground text-xs font-medium focus:outline-none focus:border-gold resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-black/90 text-white font-bold uppercase tracking-wider text-xs rounded-none transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PaperPlaneRight className="size-4" weight="bold" />
              Kirimkan untuk Peninjauan Redaksi
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
