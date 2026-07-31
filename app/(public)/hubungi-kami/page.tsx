"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  EnvelopeSimple,
  Phone,
  MapPin,
  Clock,
  PaperPlaneRight,
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";

const socialLinks = [
  { icon: FacebookLogo, href: "https://facebook.com/metrikmediaid", label: "Facebook" },
  { icon: TwitterLogo, href: "https://twitter.com/metrikmediaid", label: "Twitter" },
  { icon: InstagramLogo, href: "https://instagram.com/metrikmediaid", label: "Instagram" },
  { icon: YoutubeLogo, href: "https://youtube.com/@metrikmediaid", label: "YouTube" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="container-responsive py-6">
      <Breadcrumb items={[{ label: "Hubungi Kami" }]} />

      <div className="mt-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Hubungi Kami</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Punya pertanyaan, masukan, atau kerja sama? Jangan ragu untuk menghubungi kami.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="border border-border bg-muted p-8 text-center">
              <h3 className="text-lg font-bold">
                Pesan Terkirim!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Terima kasih telah menghubungi kami. Kami akan merespon segera.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium">Subjek</label>
                <input
                  type="text"
                  required
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                  placeholder="Subjek pesan"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium">Pesan</label>
                <textarea
                  rows={5}
                  required
                  className="w-full resize-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                  placeholder="Tulis pesan Anda..."
                />
              </div>
              <Button
                type="submit"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <PaperPlaneRight className="mr-2 size-4" weight="fill" />
                Kirim Pesan
              </Button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <div className="border border-border p-6">
            <h3 className="mb-4 font-bold">Informasi Kontak</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-brand" />
                <div>
                  <p className="text-sm font-medium">Alamat</p>
                  <p className="text-xs text-muted-foreground">
                    Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <EnvelopeSimple className="mt-0.5 size-4 text-brand" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">redaksi@metrikmediaindonesia.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-brand" />
                <div>
                  <p className="text-sm font-medium">Telepon</p>
                  <p className="text-xs text-muted-foreground">+62 21 1234 5678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 text-brand" />
                <div>
                  <p className="text-sm font-medium">Jam Operasional</p>
                  <p className="text-xs text-muted-foreground">
                    Senin - Jumat: 08:00 - 17:00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="border border-border p-6">
            <h3 className="mb-4 font-bold">Ikuti Kami</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <social.icon className="size-4" weight="fill" />
                </a>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="flex aspect-[4/3] items-center justify-center border border-border bg-muted">
            <span className="text-xs text-muted-foreground">Google Maps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
