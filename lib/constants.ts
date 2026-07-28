export const SITE_CONFIG = {
  name: "Metrik Media Indonesia",
  shortName: "Metrik Media Indonesia",
  tagline: "Portal Berita Terpercaya",
  description: "Portal berita terpercaya, terkini, dan akurat dari Metrik Media Indonesia",
  url: "https://metrikmediaindonesia.id",
  ogImage: "/og-image.jpg",
  twitterHandle: "@metrikmediaid",
  company: "PT Prima Mutiara Media",
} as const;

export const NAVIGATION = {
  main: [
    { label: "Beranda", href: "/" },
    { label: "Bisnis", href: "/bisnis" },
    { label: "Olahraga", href: "/olahraga" },
    { label: "Pendidikan", href: "/pendidikan" },
    { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
  ],
  footer: {
    berita: [
      { label: "Bisnis", href: "/bisnis" },
      { label: "Olahraga", href: "/olahraga" },
      { label: "Pendidikan", href: "/pendidikan" },
      { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
    ],
    perusahaan: [
      { label: "Tentang Kami", href: "/tentang-kami" },
      { label: "Tim Editorial", href: "/tim-editorial" },
      { label: "Hubungi Kami", href: "/hubungi-kami" },
    ],
    layanan: [
      { label: "Beranda", href: "/" },
      { label: "Pencarian", href: "/pencarian" },
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
  { id: "1", name: "Bisnis", slug: "bisnis", color: "#2563EB" },
  { id: "2", name: "Olahraga", slug: "olahraga", color: "#059669" },
  { id: "3", name: "Pendidikan", slug: "pendidikan", color: "#7C3AED" },
  { id: "4", name: "Sosial & Budaya", slug: "sosial-dan-budaya", color: "#D97706" },
] as const;

export const BREAKING_NEWS = [
  "Pertumbuhan Ekonomi Digital Indonesia Meningkat 15% di Q1 2026",
  "Timnas Indonesia Meraih Medali Emas di ASEAN Games 2026",
  "Program Literasi Digital Pemerintah Sasar 10 Juta Pelajar",
  "Festival Budaya Nusantara Hadirkan 34 Provinsi di Jakarta",
  "Startup EdTech Indonesia Raih Pendanaan Seri B Senilai $50 Juta",
] as const;
