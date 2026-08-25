export const SITE_CONFIG = {
  name: "Metrik Media Indonesia",
  shortName: "Metrik Media",
  tagline: "Media Berita Digital Terpercaya Indonesia",
  description: "Platform media berita digital profesional yang menyediakan berita aktual, informatif, dan terstruktur berdasarkan kategori, topik, wilayah, serta entitas di Indonesia.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://metrikmediaindonesia.id",
  ogImage: "/og-image.jpg",
  twitterHandle: "@metrikmediaid",
  company: "PT Metrik Media Indonesia",
} as const;

export const NAVIGATION = {
  main: [
    { label: "Beranda", href: "/" },
    { label: "Nasional", href: "/nasional" },
    { label: "Politik", href: "/politik" },
    { label: "Bisnis", href: "/bisnis" },
    { label: "Teknologi", href: "/teknologi" },
    { label: "Lifestyle", href: "/lifestyle" },
    { label: "Entertainment", href: "/entertainment" },
    { label: "Sports", href: "/sports" },
    { label: "Daerah", href: "/daerah" },
    { label: "Video", href: "/video" },
    { label: "Foto", href: "/foto" },
  ],
  footer: {
    berita: [
      { label: "Nasional", href: "/nasional" },
      { label: "Politik", href: "/politik" },
      { label: "Bisnis", href: "/bisnis" },
      { label: "Teknologi", href: "/teknologi" },
      { label: "Sports", href: "/sports" },
      { label: "Daerah", href: "/daerah" },
    ],
    perusahaan: [
      { label: "Tentang Kami", href: "/tentang-kami" },
      { label: "Tim Editorial", href: "/tim-editorial" },
      { label: "Hubungi Kami", href: "/hubungi-kami" },
      { label: "Publish Business", href: "/business-publication" },
    ],
    layanan: [
      { label: "Beranda", href: "/" },
      { label: "Pencarian", href: "/pencarian" },
      { label: "News Sitemap", href: "/news-sitemap.xml" },
      { label: "XML Sitemap", href: "/sitemap.xml" },
    ],
  },
  social: [
    { label: "Facebook", href: "https://facebook.com/metrikmediaid", icon: "facebook" },
    { label: "Twitter", href: "https://twitter.com/metrikmediaid", icon: "twitter" },
    { label: "Instagram", href: "https://instagram.com/metrikmediaid", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com/@metrikmediaid", icon: "youtube" },
    { label: "LinkedIn", href: "https://linkedin.com/company/metrikmediaid", icon: "linkedin" },
  ],
} as const;

export const CATEGORIES = [
  { id: "1", name: "Nasional", slug: "nasional", color: "#1D4ED8" },
  { id: "2", name: "Politik", slug: "politik", color: "#B91C1C" },
  { id: "3", name: "Bisnis", slug: "bisnis", color: "#2563EB" },
  { id: "4", name: "Teknologi", slug: "teknologi", color: "#DC2626" },
  { id: "5", name: "Lifestyle", slug: "lifestyle", color: "#DB2777" },
  { id: "6", name: "Entertainment", slug: "entertainment", color: "#9333EA" },
  { id: "7", name: "Sports", slug: "sports", color: "#059669" },
  { id: "8", name: "Daerah", slug: "daerah", color: "#D97706" },
] as const;

export const BREAKING_NEWS = [
  "Pemerintah Meluncurkan Program Transformasi Digital Nasional 2026-2030",
  "Pasar Saham Indonesia (IHSG) Menembus Level Rekor Baru",
  "Peluncuran Satelit Komunikasi Nusantara Utama Sukses Dilakukan",
  "Kebijakan Baru Ekonomi Daerah Siap Diberlakukan Semester Ini",
] as const;
