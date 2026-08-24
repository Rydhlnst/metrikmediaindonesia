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
  PenNib,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";

export interface NavItem {
  label: string;
  icon: Icon;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const adminNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: SquaresFour, href: "/dashboard" },
      { label: "Analytics", icon: ChartBar, href: "/dashboard/analytics" },
    ],
  },
  {
    title: "Editorial & Konten",
    items: [
      { label: "Editorial Workflow Board", icon: Lightning, href: "/dashboard/editorial" },
      { label: "Artikel", icon: NewspaperClipping, href: "/dashboard/articles" },
      { label: "User Submissions", icon: FileText, href: "/dashboard/submissions" },
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

export const contributorNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Beranda Saya", icon: SquaresFour, href: "/dashboard" },
      { label: "Tulis Berita Baru", icon: PenNib, href: "/dashboard/articles/new" },
      { label: "Artikel Saya", icon: NewspaperClipping, href: "/dashboard/my-articles" },
    ],
  },
];

// Legacy export untuk kompatibilitas (admin view)
export const navSections = adminNavSections;
