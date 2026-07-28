import {
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  Tags,
  Users,
  Image,
  MessageSquare,
  Megaphone,
  FileText,
  UserCircle,
  Shield,
  Settings,
  BarChart3,
  Zap,
} from "lucide-react";

export const navSections = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    ],
  },
  {
    title: "Konten",
    items: [
      { label: "Artikel", icon: Newspaper, href: "/dashboard/articles" },
      { label: "Kategori", icon: FolderOpen, href: "/dashboard/categories" },
      { label: "Tags", icon: Tags, href: "/dashboard/tags" },
      { label: "Penulis", icon: Users, href: "/dashboard/authors" },
    ],
  },
  {
    title: "Manajemen",
    items: [
      { label: "Media", icon: Image, href: "/dashboard/media" },
      { label: "Komentar", icon: MessageSquare, href: "/dashboard/comments" },
      { label: "Iklan", icon: Megaphone, href: "/dashboard/advertisements" },
      { label: "Halaman", icon: FileText, href: "/dashboard/pages" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "Pengguna", icon: UserCircle, href: "/dashboard/users" },
      { label: "Role", icon: Shield, href: "/dashboard/roles" },
      { label: "Pengaturan", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

export const stats = [
  {
    label: "Total Artikel",
    value: "1,248",
    detail: "+12.5%",
    icon: Newspaper,
    tone: "bg-news-red",
  },
  {
    label: "Total Views",
    value: "2.4M",
    detail: "+8.3%",
    icon: BarChart3,
    tone: "bg-blue-500",
  },
  {
    label: "Penulis Aktif",
    value: "24",
    detail: "+2 bulan ini",
    icon: Users,
    tone: "bg-emerald-500",
  },
  {
    label: "Kategori",
    value: "18",
    detail: "6 aktif",
    icon: FolderOpen,
    tone: "bg-purple-500",
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
