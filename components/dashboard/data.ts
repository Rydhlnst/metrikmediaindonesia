import {
  SquaresFour,
  NewspaperClipping,
  FolderOpen,
  TagSimple,
  Users,
  Image,
  ChatCircleText,
  Megaphone,
  FileText,
  UserCircle,
  Shield,
  Gear,
  ChartBar,
  Lightning,
} from "@phosphor-icons/react/dist/ssr";

export const navSections = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: SquaresFour, href: "/dashboard", active: true },
      { label: "Analytics", icon: ChartBar, href: "/dashboard/analytics" },
    ],
  },
  {
    title: "Editorial & Konten",
    items: [
      { label: "Editorial Workflow Board", icon: Lightning, href: "/dashboard/editorial" },
      { label: "Artikel", icon: NewspaperClipping, href: "/dashboard/articles" },
      { label: "Topik Berita", icon: TagSimple, href: "/dashboard/topics" },
      { label: "Wilayah & Lokasi", icon: FolderOpen, href: "/dashboard/locations" },
      { label: "Entitas (Relationship)", icon: Users, href: "/dashboard/entities" },
      { label: "Kategori", icon: FolderOpen, href: "/dashboard/categories" },
      { label: "Tags", icon: TagSimple, href: "/dashboard/tags" },
      { label: "Penulis", icon: Users, href: "/dashboard/authors" },
    ],
  },
  {
    title: "SEO & Manajemen",
    items: [
      { label: "SEO Health Dashboard", icon: Shield, href: "/dashboard/seo-health" },
      { label: "Redirect Manager (301)", icon: FileText, href: "/dashboard/redirects" },
      { label: "Media Library", icon: Image, href: "/dashboard/media" },
      { label: "Komentar", icon: ChatCircleText, href: "/dashboard/comments" },
      { label: "Iklan & Sponsored", icon: Megaphone, href: "/dashboard/advertisements" },
      { label: "Halaman Static", icon: FileText, href: "/dashboard/pages" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "Pengguna", icon: UserCircle, href: "/dashboard/users" },
      { label: "Role & Akses (RBAC)", icon: Shield, href: "/dashboard/roles" },
      { label: "Pengaturan System", icon: Gear, href: "/dashboard/settings" },
    ],
  },
];

export const chartData = [
  { month: "Jan", articles: 45, views: 120000 },
  { month: "Feb", articles: 52, views: 145000 },
  { month: "Mar", articles: 61, views: 180000 },
  { month: "Apr", articles: 48, views: 160000 },
  { month: "May", articles: 72, views: 210000 },
  { month: "Jun", articles: 65, views: 195000 },
  { month: "Jul", articles: 80, views: 240000 },
];

export const categoryData = [
  { name: "Politik", count: 320, color: "#DC2626" },
  { name: "Ekonomi", count: 280, color: "#2563EB" },
  { name: "Teknologi", count: 245, color: "#7C3AED" },
  { name: "Olahraga", count: 198, color: "#059669" },
  { name: "Hiburan", count: 120, color: "#D97706" },
  { name: "Lifestyle", count: 85, color: "#EC4899" },
];

export const recentArticles = [
  {
    id: "1",
    title: "Indonesia Luncurkan Program Transformasi Digital Nasional",
    category: "Teknologi",
    categoryColor: "#7C3AED",
    author: "Budi Santoso",
    status: "published" as const,
    views: 15420,
    publishedAt: "2026-07-25",
  },
  {
    id: "2",
    title: "Pasar Saham Indonesia Catat Rekor Tertinggi Sepanjang Sejarah",
    category: "Ekonomi",
    categoryColor: "#2563EB",
    author: "Siti Nurhaliza",
    status: "published" as const,
    views: 12300,
    publishedAt: "2026-07-25",
  },
  {
    id: "3",
    title: "Timnas Indonesia Tampil Gemilang di Piala Dunia U-20",
    category: "Olahraga",
    categoryColor: "#059669",
    author: "Reza Firmansyah",
    status: "published" as const,
    views: 28500,
    publishedAt: "2026-07-25",
  },
  {
    id: "4",
    title: "Film Indonesia Raih Penghargaan di Festival Film Cannes 2026",
    category: "Hiburan",
    categoryColor: "#D97706",
    author: "Maya Putri",
    status: "draft" as const,
    views: 0,
    publishedAt: "2026-07-24",
  },
  {
    id: "5",
    title: "Tips Productivity: Cara Efektif Mengelola Waktu",
    category: "Lifestyle",
    categoryColor: "#EC4899",
    author: "Maya Putri",
    status: "scheduled" as const,
    views: 0,
    publishedAt: "2026-07-26",
  },
];

export const recentComments = [
  {
    id: "1",
    article: "Indonesia Luncurkan Program Transformasi Digital",
    user: "Ahmad Fauzi",
    content: "Artikel yang sangat informatif! Semoga program ini berjalan lancar.",
    status: "approved" as const,
    createdAt: "2026-07-25T10:30:00Z",
  },
  {
    id: "2",
    article: "Pasar Saham Indonesia Catat Rekor Tertinggi",
    user: "Dewi Sartika",
    content: "IHSG makin monster! Tapi tetap waspada ya.",
    status: "pending" as const,
    createdAt: "2026-07-25T09:15:00Z",
  },
  {
    id: "3",
    article: "Timnas Indonesia Tampil Gemilang",
    user: "Rizky Pratama",
    content: "GARUDA! Semoga bisa terus berprestasi di level internasional.",
    status: "approved" as const,
    createdAt: "2026-07-25T08:00:00Z",
  },
  {
    id: "4",
    article: "Startup AI Indonesia Raih Pendanaan",
    user: "Putri Wulandari",
    content: "Bangga dengan startup lokal! Semoga semakin banyak bermunculan.",
    status: "spam" as const,
    createdAt: "2026-07-24T16:45:00Z",
  },
];
