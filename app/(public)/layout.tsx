import { HeaderServer } from "@/components/layout/header-server";
import { FooterServer } from "@/components/layout/footer-server";
import { BreakingNewsTicker } from "@/components/layout/breaking-news-ticker";
import { BottomNavMobile } from "@/components/layout/bottom-nav-mobile";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <HeaderServer />
      <BreakingNewsTicker />
      <main className="min-h-screen">
        {children}
      </main>
      <FooterServer />
      <BottomNavMobile />
    </div>
  );
}
