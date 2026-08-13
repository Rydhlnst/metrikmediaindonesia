import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: `Hubungi tim redaksi ${SITE_CONFIG.name} untuk pertanyaan, masukan, atau kerja sama.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/hubungi-kami`,
  },
  openGraph: {
    title: `Hubungi Kami | ${SITE_CONFIG.name}`,
    description: `Hubungi tim redaksi ${SITE_CONFIG.name} untuk pertanyaan, masukan, atau kerja sama.`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
