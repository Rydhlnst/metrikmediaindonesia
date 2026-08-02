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
        Mobile: pt-[56px] (h-14), pb-20 (bottom nav)
        sm+:    ml-[220px] (sidebar w-[220px]), pt-[56px] (h-14 header), pb-0
        lg:     ml-[240px] (sidebar w-[240px])
      */}
      <main className="min-h-screen pt-14 pb-20 sm:ml-[220px] sm:pt-14 sm:pb-0 lg:ml-[240px]">
        <div className="mx-auto px-4 sm:px-5 lg:px-6" style={{ maxWidth: "1320px" }}>
          {children}
        </div>
      </main>
      <div className="sm:ml-[220px] lg:ml-[240px]">
        <FooterServer />
      </div>
    </div>
  );
}
