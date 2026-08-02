import { HeaderServer } from "@/components/layout/header-server";
import { FooterServer } from "@/components/layout/footer-server";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <HeaderServer />
      {/*
        Mobile: pt-[96px] (h-14 + h-10), pb-16 (bottom nav)
        sm+:    pt-[112px] (h-8 + h-14), pb-0 (no bottom nav), ml-[240px] (sidebar)
        lg:     pt-[128px] (h-8 + h-16), ml-[260px] (wider sidebar)
      */}
      <main className="min-h-screen pt-[96px] pb-16 sm:ml-[240px] sm:pt-[112px] sm:pb-0 lg:ml-[260px] lg:pt-[128px]">
        <div className="mx-auto px-4 sm:px-5 lg:px-6" style={{ maxWidth: "1280px" }}>
          {children}
        </div>
      </main>
      <div className="sm:ml-[240px] lg:ml-[260px]">
        <FooterServer />
      </div>
    </div>
  );
}
