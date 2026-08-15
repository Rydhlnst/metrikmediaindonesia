"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PrimaryButton } from "@/components/shared/primary-button";
import { FormInput } from "@/components/shared/form-input";
import { ContentCard } from "@/components/shared/content-card";
import { EnvelopeSimple, Phone, MapPin, Clock, PaperPlaneRight, FacebookLogo, TwitterLogo, InstagramLogo, YoutubeLogo, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

const socialLinks = [
  { icon: FacebookLogo, label: "Facebook", href: "https://facebook.com/metrikmediaid" },
  { icon: TwitterLogo, label: "Twitter", href: "https://twitter.com/metrikmediaid" },
  { icon: InstagramLogo, label: "Instagram", href: "https://instagram.com/metrikmediaid" },
  { icon: YoutubeLogo, label: "YouTube", href: "https://youtube.com/@metrikmediaid" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.message || "Terjadi kesalahan");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <Breadcrumb items={[{ label: "Hubungi Kami" }]} />

      <PublicPageHeader
        className="mt-6"
        title="Hubungi Kami"
        description="Punya pertanyaan, masukan, atau kerja sama? Jangan ragu untuk menghubungi kami."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          {submitted ? (
            <div className="border border-black/10 bg-surface-container-low p-8 text-center">
              <h3 className="text-lg font-bold text-foreground">Pesan Terkirim!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Terima kasih telah menghubungi kami. Kami akan merespon segera.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label="Nama Lengkap" id="name" name="name" type="text" required placeholder="Masukkan nama Anda" />
                <FormInput label="Email" id="email" name="email" type="email" required placeholder="Masukkan email Anda" />
              </div>
              <FormInput label="Subjek" id="subject" name="subject" type="text" required placeholder="Subjek pesan" />
              <div className="space-y-1.5">
                <label htmlFor="message" className="font-label-md text-label-md text-foreground">
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full resize-none border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold"
                  placeholder="Tulis pesan Anda..."
                />
              </div>
              <PrimaryButton type="submit" disabled={loading} className="gap-2">
                <PaperPlaneRight className="mr-2 size-4" weight="fill" />
                {loading ? "Mengirim..." : "Kirim Pesan"}
              </PrimaryButton>
            </form>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <ContentCard>
            <h3 className="mb-4 font-serif text-xl font-bold text-foreground">Informasi Kontak</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-gold-deep" />
                <div>
                  <p className="text-sm font-medium text-foreground">Alamat</p>
                  <p className="text-xs text-muted-foreground">Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <EnvelopeSimple className="mt-0.5 size-4 text-gold-deep" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground">redaksi@metrikmediaindonesia.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-gold-deep" />
                <div>
                  <p className="text-sm font-medium text-foreground">Telepon</p>
                  <p className="text-xs text-muted-foreground">+62 21 1234 5678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 text-gold-deep" />
                <div>
                  <p className="text-sm font-medium text-foreground">Jam Operasional</p>
                  <p className="text-xs text-muted-foreground">Senin - Jumat: 08:00 - 17:00 WIB</p>
                </div>
              </div>
            </div>
          </ContentCard>

          <ContentCard>
            <h3 className="mb-4 font-serif text-xl font-bold text-foreground">Ikuti Kami</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center border border-black/10 text-muted-foreground transition-colors hover:border-gold hover:text-gold-deep">
                    <Icon className="size-4" weight="fill" />
                  </a>
                );
              })}
            </div>
          </ContentCard>

          <ContentCard variant="low" className="overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.940940940941!2d106.81666667465647!3d-6.22666667644384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f19f1f1f1f1f%3A0x1234567890abcdef!2sJl.%20Sudirman%20No.123%2C%20Jakarta%20Selatan!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Metrik Media Indonesia"
            />
          </ContentCard>

          <ContentCard className="border-dashed">
            <div className="flex items-center gap-3 py-4">
              <div className="flex size-10 items-center justify-center bg-muted text-muted-foreground">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Keamanan</p>
                <p className="text-xs text-muted-foreground">Formulir ini dilindungi dari spam oleh sistem keamanan kami.</p>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
