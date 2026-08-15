import type { Metadata } from "next";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SITE_CONFIG } from "@/lib/constants";
import {
  Target,
  Eye,
  Lightning,
  Users,
  ShieldCheck,
  GlobeHemisphereWest,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: `Mengenal lebih dekat ${SITE_CONFIG.name}, portal berita terpercaya Indonesia.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/tentang-kami`,
  },
  openGraph: {
    title: `Tentang Kami | ${SITE_CONFIG.name}`,
    description: `Mengenal lebih dekat ${SITE_CONFIG.name}, portal berita terpercaya Indonesia.`,
  },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Independen",
    description: "Berita yang disajikan tanpa pengaruh pihak manapun, murni berdasarkan fakta dan data.",
  },
  {
    icon: Target,
    title: "Akurat",
    description: "Setiap informasi melalui proses verifikasi ketat sebelum dipublikasikan.",
  },
  {
    icon: Lightning,
    title: "Cepat & Terkini",
    description: "Menghadirkan informasi terkini secara real-time dari dalam dan luar negeri.",
  },
  {
    icon: Users,
    title: "Untuk Publik",
    description: "Berkomitmen menyajikan berita yang dapat diakses oleh semua lapisan masyarakat.",
  },
  {
    icon: GlobeHemisphereWest,
    title: "Lokal & Global",
    description: "Menyajikan perspektif lokal Indonesia dalam konteks global yang lebih luas.",
  },
  {
    icon: Eye,
    title: "Transparan",
    description: "Terbuka dalam proses editorial dan bertanggung jawab atas setiap konten yang diterbitkan.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <Breadcrumb items={[{ label: "Tentang Kami" }]} />

      <PublicPageHeader
        className="mt-6"
        title={`Tentang ${SITE_CONFIG.name}`}
        description="Portal berita digital terpercaya yang hadir untuk menyajikan informasi akurat, terkini, dan berimbang bagi masyarakat Indonesia."
      />

      {/* Story */}
      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Cerita Kami</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              {SITE_CONFIG.name} merupakan portal berita digital yang berada di bawah naungan {SITE_CONFIG.company}.
              Didirikan pada tahun 2024 dengan visi sederhana: menyediakan akses informasi yang berkualitas dan dapat
              dipercaya bagi setiap warga negara Indonesia.
            </p>
            <p>
              Dimulai dari sebuah ruang kecil dengan tim yang bersemangat, kini kami telah berkembang menjadi salah satu
              portal berita digital terdepan di Indonesia. Dengan jaringan reporter yang tersebar di berbagai daerah,
              kami berkomitmen untuk menghadirkan berita langsung dari lokasi kejadian.
            </p>
            <p>
              Kami percaya bahwa jurnalisme yang berkualitas adalah fondasi dari demokrasi yang sehat. Oleh karena itu,
              kami selalu berusaha menjaga standar editorial tertinggi dalam setiap konten yang kami produksi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="border border-black/10 bg-white p-6">
            <span className="text-3xl font-bold text-gold-deep">50+</span>
            <p className="mt-1 text-sm text-muted-foreground">Jurnalis & Tim</p>
          </div>
          <div className="border border-black/10 bg-white p-6">
            <span className="text-3xl font-bold text-gold-deep">1M+</span>
            <p className="mt-1 text-sm text-muted-foreground">Pembaca Bulanan</p>
          </div>
          <div className="border border-black/10 bg-white p-6">
            <span className="text-3xl font-bold text-gold-deep">34</span>
            <p className="mt-1 text-sm text-muted-foreground">Kantor Daerah</p>
          </div>
          <div className="border border-black/10 bg-white p-6">
            <span className="text-3xl font-bold text-gold-deep">24/7</span>
            <p className="mt-1 text-sm text-muted-foreground">Liputan Non-Stop</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mt-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Nilai-Nilai Kami</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="border border-black/10 bg-white p-6">
              <value.icon className="size-6 text-gold-deep" weight="bold" />
              <h3 className="mt-3 font-bold text-foreground">{value.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="mt-16 border border-black/10 bg-surface-container-low p-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Misi Kami</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 size-1.5 shrink-0 bg-gold" />
            Menyajikan berita yang akurat, berimbang, dan dapat dipertanggungjawabkan.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 size-1.5 shrink-0 bg-gold" />
            Menggunakan teknologi terkini untuk mendistribusikan informasi secara efisien.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 size-1.5 shrink-0 bg-gold" />
            Memberdayakan jurnalis lokal untuk mengangkat isu-isu daerah.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 size-1.5 shrink-0 bg-gold" />
            Membangun komunitas pembaca yang kritis dan informan.
          </li>
        </ul>
      </div>
    </div>
  );
}
