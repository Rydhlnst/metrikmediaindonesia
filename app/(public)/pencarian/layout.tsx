import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pencarian",
  description: `Cari berita terbaru dari ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/pencarian`,
  },
  openGraph: {
    title: `Pencarian | ${SITE_CONFIG.name}`,
    description: `Cari berita terbaru dari ${SITE_CONFIG.name}.`,
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
