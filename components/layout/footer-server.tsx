"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";

const sections = [
  {
    title: "Kategori",
    links: [
      { label: "Bisnis", href: "/bisnis" },
      { label: "Olahraga", href: "/olahraga" },
      { label: "Pendidikan", href: "/pendidikan" },
      { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
      { label: "Dunia", href: "/dunia" },
      { label: "Teknologi", href: "/teknologi" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "/tentang-kami" },
      { label: "Tim Editorial", href: "/tim-editorial" },
      { label: "Hubungi Kami", href: "/hubungi-kami" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Kebijakan Privasi", href: "/tentang-kami" },
      { label: "Syarat & Ketentuan", href: "/tentang-kami" },
      { label: "Kontak", href: "/hubungi-kami" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Facebook", href: "https://facebook.com/metrikmediaid" },
      { label: "Twitter", href: "https://twitter.com/metrikmediaid" },
      { label: "Instagram", href: "https://instagram.com/metrikmediaid" },
      { label: "YouTube", href: "https://youtube.com/@metrikmediaid" },
      { label: "LinkedIn", href: "https://linkedin.com/company/metrikmediaid" },
    ],
  },
];

export function FooterServer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-gray-100 bg-white pb-20 sm:pb-0">
      <div className="mx-auto max-w-3xl px-5 py-12">
        {/* Newsletter */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
            Dapatkan berita terkini
            <br />
            langsung di inbox Anda
          </h2>
          <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1.5 transition-colors focus-within:border-foreground focus-within:bg-white">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent px-4 text-sm text-foreground placeholder:text-gray-400 outline-none"
            />
            <button className="shrink-0 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Subscribe
            </button>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="mt-12 space-y-0">
          {sections.map((section) => (
            <AccordionSection key={section.title} section={section} />
          ))}
        </div>

        {/* Logo + Copyright */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <Image src="/logo-metrik.png" alt={SITE_CONFIG.shortName} fill className="object-contain" />
          </div>
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>

        {/* Bottom Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
          <Link href="/tentang-kami" className="transition-colors hover:text-foreground">Kebijakan Privasi</Link>
          <Link href="/tentang-kami" className="transition-colors hover:text-foreground">Syarat & Ketentuan</Link>
          <Link href="/hubungi-kami" className="transition-colors hover:text-foreground">Kontak</Link>
        </div>
      </div>
    </footer>
  );
}

function AccordionSection({ section }: { section: { title: string; links: { label: string; href: string }[] } }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-[15px] font-medium text-foreground"
      >
        {section.title}
        {open ? <Minus className="size-4 shrink-0 text-gray-400" /> : <Plus className="size-4 shrink-0 text-gray-400" />}
      </button>
      {open && (
        <div className="pb-4">
          <ul className="space-y-2.5">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-500 transition-colors hover:text-foreground"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
