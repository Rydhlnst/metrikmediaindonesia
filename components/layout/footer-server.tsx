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
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

const KANAL_BERITA = [
  { label: "Nasional", href: "/nasional" },
  { label: "Politik", href: "/politik" },
  { label: "Bisnis", href: "/bisnis" },
  { label: "Teknologi", href: "/teknologi" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Entertainment", href: "/entertainment" },
  { label: "Olahraga", href: "/sports" },
  { label: "Daerah", href: "/daerah" },
];

const PORTAL_MULTIMEDIA = [
  { label: "Metrik Video HD", href: "/video" },
  { label: "Galeri Foto", href: "/foto" },
  { label: "Topik Trending", href: "/pencarian" },
  { label: "Indeks Berita", href: "/pencarian" },
  { label: "Publish Business", href: "/business-publication" },
];

const PERUSAHAAN_LEGAL = [
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Tim Editorial", href: "/tim-editorial" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
  { label: "Pedoman Siber", href: "/tentang-kami" },
  { label: "Privasi & Syarat", href: "/tentang-kami" },
];

export function FooterServer() {
  return (
    <footer className="w-full mt-16 bg-surface-container-lowest border-t border-outline-variant text-on-surface">
      
      {/* Main Footer Container */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand Profile (Full width on mobile, 4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <BrandName size="md" className="uppercase" />
            </Link>
            <p className="text-xs leading-relaxed text-on-surface-variant max-w-sm">
              Metrik Media Indonesia adalah portal berita digital profesional yang menyajikan jurnalisme terpercaya di bidang Ekonomi, Politik, Teknologi, dan Isu Nasional.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="p-2 bg-surface-container hover:bg-primary hover:text-white transition-colors"
              >
                <TwitterLogo className="size-4" weight="fill" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2 bg-surface-container hover:bg-primary hover:text-white transition-colors"
              >
                <FacebookLogo className="size-4" weight="fill" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 bg-surface-container hover:bg-primary hover:text-white transition-colors"
              >
                <InstagramLogo className="size-4" weight="fill" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="p-2 bg-surface-container hover:bg-primary hover:text-white transition-colors"
              >
                <YoutubeLogo className="size-4" weight="fill" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2 bg-surface-container hover:bg-primary hover:text-white transition-colors"
              >
                <LinkedinLogo className="size-4" weight="fill" />
              </a>
            </div>
          </div>

          {/* Quick Links Grid (2 columns on mobile, 3 columns on desktop) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
            
            {/* Column: Kategori */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface border-b-2 border-primary pb-1.5 inline-block">
                Kanal Berita
              </h4>
              <ul className="space-y-2 text-xs font-medium">
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

            {/* Column: Portal & Media */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface border-b-2 border-amber-600 pb-1.5 inline-block">
                Portal Media
              </h4>
              <ul className="space-y-2 text-xs font-medium">
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

            {/* Column: Perusahaan & Legal */}
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface border-b-2 border-outline-variant pb-1.5 inline-block">
                Redaksi & Legal
              </h4>
              <ul className="space-y-2 text-xs font-medium">
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

        </div>

        {/* Contact & Legal Siber Info */}
        <div className="mt-10 pt-6 border-t border-outline-variant grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-on-surface-variant">
          <div className="flex items-start gap-2.5">
            <MapPin className="size-4 shrink-0 text-amber-700 mt-0.5" />
            <span>Gedung Press Center Jakarta, Jl. Jend. Sudirman No. 45, Jakarta Pusat</span>
          </div>
          <div className="flex items-start gap-2.5">
            <EnvelopeSimple className="size-4 shrink-0 text-amber-700 mt-0.5" />
            <span>Redaksi: redaksi@metrikmediaindonesia.id</span>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="size-4 shrink-0 text-amber-700 mt-0.5" />
            <span>Tunduk pada Pedoman Media Siber Dewan Pers Indonesia</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-surface-container-low border-t border-outline-variant py-4 mb-14 md:mb-0">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-[11px] text-on-surface-variant">
          <div>
            &copy; {new Date().getFullYear()} <strong>METRIK MEDIA INDONESIA</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-3 uppercase font-bold tracking-wider text-[10px] flex-wrap justify-center">
            <Link href="/tentang-kami" className="hover:text-primary transition-colors">
              Pedoman Siber
            </Link>
            <span>•</span>
            <Link href="/tentang-kami" className="hover:text-primary transition-colors">
              Privasi
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
