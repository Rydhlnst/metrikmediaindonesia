"use client";

import Link from "next/link";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="container-responsive py-8 sm:py-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <Link href="/" className="mb-2 flex items-center gap-2">
              <span className="text-lg font-black tracking-tight">
                {SITE_CONFIG.shortName}
              </span>
            </Link>
            <h3 className="text-lg font-bold sm:text-xl">
              Latest Headlines: Breaking News and Updates
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-primary-foreground/70">
              Subscribe to Newsletter
            </span>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <div className="flex items-center border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-2">
                <EnvelopeSimple className="mr-2 size-4 text-primary-foreground/50" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-40 bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none sm:w-64"
                />
              </div>
              <button type="submit" className="bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="border-t border-primary-foreground/20">
        <div className="container-responsive py-8 sm:py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Left Column */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary-foreground/70">
                Berita
              </h4>
              <ul className="space-y-2">
                {NAVIGATION.footer.berita.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary-foreground/70">
                Perusahaan
              </h4>
              <ul className="space-y-2">
                {NAVIGATION.footer.perusahaan.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
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
      <div className="border-t border-primary-foreground/20">
        <div className="container-responsive py-4 sm:py-5">
          <p className="text-xs text-primary-foreground/50">
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved. Powered by {SITE_CONFIG.company}.
          </p>
        </div>
      </div>
    </footer>
  );
}
