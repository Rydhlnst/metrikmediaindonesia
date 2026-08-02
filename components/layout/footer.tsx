"use client";

import Link from "next/link";
import Image from "next/image";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white">
      {/* Newsletter Section */}
      <div className="mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8" style={{ maxWidth: "1280px" }}>
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <Link href="/" className="mb-2 flex items-center gap-2">
              <div className="relative h-9 w-9">
                <Image
                  src="/logo-metrik.png"
                  alt="Metrik Media"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[13px] font-bold tracking-tight">{SITE_CONFIG.shortName}</span>
            </Link>
            <h3 className="text-[15px] font-bold sm:text-base">
              Berita Terkini dan Terpercaya
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              Berlangganan Newsletter
            </span>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <div className="flex items-center border border-gray-700 bg-gray-900 px-3 py-2">
                <EnvelopeSimple className="mr-2 size-3.5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="w-40 bg-transparent text-[11px] text-white placeholder:text-gray-500 outline-none sm:w-56"
                />
              </div>
              <button type="submit" className="bg-brand px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-amber-800">
                Berlangganan
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="border-t border-gray-800">
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8" style={{ maxWidth: "1280px" }}>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Left Column */}
            <div>
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Berita
              </h4>
              <ul className="space-y-1.5">
                {NAVIGATION.footer.berita.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[12px] text-gray-400 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div>
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Perusahaan
              </h4>
              <ul className="space-y-1.5">
                {NAVIGATION.footer.perusahaan.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[12px] text-gray-400 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8" style={{ maxWidth: "1280px" }}>
          <p className="text-[10px] text-gray-500">
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved. Powered by {SITE_CONFIG.company}.
          </p>
        </div>
      </div>
    </footer>
  );
}
