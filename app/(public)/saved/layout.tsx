import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tersimpan",
  robots: { index: false, follow: false },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
