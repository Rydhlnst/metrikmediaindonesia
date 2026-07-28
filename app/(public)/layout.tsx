import { HeaderServer } from "@/components/layout/header-server";
import { FooterServer } from "@/components/layout/footer-server";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar offset */}
      <div className="lg:ml-[240px]">
        <HeaderServer />
        {/* pt for fixed mobile header: h-14 + h-11 = 100px, desktop: h-12 = 48px */}
        <main className="min-h-screen pt-[100px] pb-16 lg:pt-12 lg:pb-0">
          {children}
        </main>
        <FooterServer />
      </div>
    </div>
  );
}
