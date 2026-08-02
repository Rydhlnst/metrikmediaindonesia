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
        Mobile: pt-[56px] (h-14), pb-20 (bottom nav)
        sm+:    ml-[240px] (sidebar), pt-[64px] (h-16 header), pb-0
        lg:     ml-[260px] (wider sidebar)
      */}
      <main className="min-h-screen pt-14 pb-20 sm:ml-[240px] sm:pt-0 sm:pb-0 lg:ml-[260px]">
        <div className="mx-auto px-4 sm:px-5 lg:px-6" style={{ maxWidth: "1320px" }}>
          {children}
        </div>
      </main>
      <div className="sm:ml-[240px] lg:ml-[260px]">
        <FooterServer />
      </div>
    </div>
  );
}
