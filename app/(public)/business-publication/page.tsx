import { Metadata } from "next";
import { BusinessPublicationForm } from "@/components/business/business-publication-form";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { generateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = generateMetadata({
  title: "Publish Your Business",
  description: "Submit a press release or content partnership request for editorial review.",
  canonical: `${SITE_CONFIG.url}/business-publication`,
});

export default function BusinessPublicationPage() {
  return (
    <main className="container-editorial max-w-5xl py-8 pb-20">
      <PublicPageHeader title="Publish Business" description="Submit a press release or content partnership proposal to Metrik Media Indonesia." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <BusinessPublicationForm />
        <aside className="border border-black/10 bg-black p-6 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Editorial process</p><ol className="mt-4 space-y-4 text-sm text-white/75"><li><strong className="text-white">01.</strong> Submit your material.</li><li><strong className="text-white">02.</strong> Editorial review and verification.</li><li><strong className="text-white">03.</strong> Revision, approval, or publication decision.</li></ol></aside>
      </div>
    </main>
  );
}
