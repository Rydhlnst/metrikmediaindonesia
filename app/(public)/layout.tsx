import { HeaderServer } from "@/components/layout/header-server";
import { FooterServer } from "@/components/layout/footer-server";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <HeaderServer />
      {/* 
        Mobile header: h-12 + h-10 = 88px 
        Desktop header: h-14 + ~48px (row2) = ~104px 
      */}
      <main className="min-h-screen pt-[84px] pb-16 lg:pt-[120px] lg:pb-0">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1280px" }}>
          {children}
        </div>
      </main>
      <FooterServer />
    </div>
  );
}
