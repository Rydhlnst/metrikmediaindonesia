import Link from "next/link";
import { BrandName } from "@/components/shared/brand-name";
import {
  TwitterLogo,
  FacebookLogo,
  InstagramLogo,
  YoutubeLogo,
  LinkedinLogo,
  EnvelopeSimple,
  PhoneCall,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

const KANAL_BERITA = [
  { label: "Nasional", href: "/nasional" },
  { label: "Politik", href: "/politik" },
  { label: "Bisnis & Ekonomi", href: "/bisnis" },
  { label: "Teknologi & Digital", href: "/teknologi" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Entertainment", href: "/entertainment" },
  { label: "Olahraga", href: "/sports" },
  { label: "Kabar Daerah", href: "/daerah" },
];

const PORTAL_MULTIMEDIA = [
  { label: "Metrik Video HD", href: "/video" },
  { label: "Galeri Metrik Foto", href: "/foto" },
  { label: "Topik Isu Trending", href: "/pencarian" },
  { label: "Indeks Berita", href: "/pencarian" },
  { label: "Cek Fakta & Verifikasi", href: "/pencarian" },
];

const LAYANAN_BISNIS = [
  { label: "Publish Your Business", href: "/business-publication" },
  { label: "Siaran Pers Perusahaan", href: "/business-publication" },
  { label: "Kerjasama Media & Partner", href: "/hubungi-kami" },
  { label: "Pemasangan Iklan", href: "/business-publication" },
];

const PERUSAHAAN_LEGAL = [
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Tim Editorial & Redaksi", href: "/tim-editorial" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
  { label: "Pedoman Media Siber", href: "/tentang-kami" },
  { label: "Kebijakan Privasi", href: "/tentang-kami" },
];

export function FooterServer() {
  return (
    <footer className="w-full mt-16 bg-surface-container-lowest border-t border-outline-variant text-on-surface">
      
      {/* Upper Footer: Grid 5 Kolom */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Kolom 1: Brand & Visi Pers (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <BrandName size="md" className="uppercase" />
            </Link>
            <p className="text-xs leading-relaxed text-on-surface-variant max-w-sm">
              Metrik Media Indonesia adalah platform berita digital independen profesional yang menyajikan jurnalisme berkualitas, aktual, dan terpercaya di bidang Ekonomi, Politik, Teknologi, dan Isu Nasional.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter Metrik Media"
                className="p-2 bg-surface-container hover:bg-primary hover:text-on-primary rounded-none transition-colors"
              >
                <TwitterLogo className="size-4" weight="fill" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Metrik Media"
                className="p-2 bg-surface-container hover:bg-primary hover:text-on-primary rounded-none transition-colors"
              >
                <FacebookLogo className="size-4" weight="fill" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Metrik Media"
                className="p-2 bg-surface-container hover:bg-primary hover:text-on-primary rounded-none transition-colors"
              >
                <InstagramLogo className="size-4" weight="fill" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Metrik Media"
                className="p-2 bg-surface-container hover:bg-primary hover:text-on-primary rounded-none transition-colors"
              >
                <YoutubeLogo className="size-4" weight="fill" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Metrik Media"
                className="p-2 bg-surface-container hover:bg-primary hover:text-on-primary rounded-none transition-colors"
              >
                <LinkedinLogo className="size-4" weight="fill" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Kanal Berita (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface border-b border-outline-variant pb-2">
              Kanal Berita
            </h4>
            <ul className="space-y-2 text-xs">
              {KANAL_BERITA.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Portal & Multimedia (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface border-b border-outline-variant pb-2">
              Portal Media
            </h4>
            <ul className="space-y-2 text-xs">
              {PORTAL_MULTIMEDIA.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Layanan Bisnis (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface border-b border-outline-variant pb-2">
              Layanan Bisnis
            </h4>
            <ul className="space-y-2 text-xs">
              {LAYANAN_BISNIS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 5: Redaksi & Legal (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface border-b border-outline-variant pb-2">
              Redaksi & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              {PERUSAHAAN_LEGAL.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Informasional Kantor & Pedoman Siber */}
        <div className="mt-12 pt-6 border-t border-outline-variant grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-on-surface-variant">
          <div className="flex items-start gap-2.5">
            <MapPin className="size-4 shrink-0 text-secondary mt-0.5" />
            <span>Gedung Press Center Jakarta, Jl. Jend. Sudirman No. 45, Jakarta Pusat 10210</span>
          </div>
          <div className="flex items-start gap-2.5">
            <EnvelopeSimple className="size-4 shrink-0 text-secondary mt-0.5" />
            <span>Redaksi & Kerjasama: redaksi@metrikmediaindonesia.id</span>
          </div>
          <div className="flex items-start gap-2.5">
            <PhoneCall className="size-4 shrink-0 text-secondary mt-0.5" />
            <span>Layanan Pembaca: +62 21 555 8899</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-surface-container-low border-t border-outline-variant py-4">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-on-surface-variant">
          <div>
            &copy; {new Date().getFullYear()} <strong>METRIK MEDIA INDONESIA</strong>. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4 uppercase font-bold tracking-wider text-[10px]">
            <Link href="/tentang-kami" className="hover:text-primary transition-colors">
              Pedoman Media Siber
            </Link>
            <span>•</span>
            <Link href="/tentang-kami" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link href="/hubungi-kami" className="hover:text-primary transition-colors">
              Kontak Redaksi
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
