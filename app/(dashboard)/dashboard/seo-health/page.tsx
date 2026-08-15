import { Metadata } from "next";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "SEO Health Dashboard - Metrik Media CMS",
  description: "Dashboard kesehatan SEO teknis, sitemap, indeksasi, dan checklist pra-publikasi berita.",
};

const CHECKLIST_ITEMS = [
  { label: "Title tag & Headings terisi dan valid", status: "passed" },
  { label: "Slug URL bersih (lowercase, hyphen-separated)", status: "passed" },
  { label: "Meta description unik tersedia (150-160 karakter)", status: "passed" },
  { label: "Featured Image & Image Alt text terisi", status: "passed" },
  { label: "Author profile & Editorial role terasosiasi", status: "passed" },
  { label: "Kategori & Subkategori terdistribusi", status: "passed" },
  { label: "Topik & Entitas terhubung", status: "passed" },
  { label: "Canonical URL valid (mencegah duplicate content)", status: "passed" },
  { label: "NewsArticle JSON-LD structured data valid", status: "passed" },
  { label: "Internal links ke artikel/topik terkait tersedia", status: "warning", message: "Disarankan menambah minimal 2 internal link" },
];

export default function SeoHealthPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="border-b border-black/5 pb-4">
          <h1 className="text-xl font-bold text-foreground">SEO Health Dashboard & Pre-Publish Checklist</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluasi otomatis technical SEO, keterindeksan (indexability), kelayakan sitemap, dan Schema.org NewsArticle.
          </p>
        </div>

        {/* Health Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
            <CardContent className="p-6 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Skor Kesehatan SEO</span>
              <p className="text-3xl font-extrabold text-foreground">96 <span className="text-base font-normal text-muted-foreground">/ 100</span></p>
              <p className="text-xs text-emerald-600 font-medium">Sangat baik! Semua halaman utama indexable.</p>
            </CardContent>
          </Card>

          <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
            <CardContent className="p-6 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status Sitemap</span>
              <p className="text-2xl font-bold text-foreground">Terverifikasi</p>
              <p className="text-xs text-primary font-mono font-medium">/sitemap.xml & /news-sitemap.xml</p>
            </CardContent>
          </Card>

          <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
            <CardContent className="p-6 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Structured Data</span>
              <p className="text-2xl font-bold text-foreground">100% Valid</p>
              <p className="text-xs text-muted-foreground">NewsArticle, Breadcrumb & Organization</p>
            </CardContent>
          </Card>
        </div>

        {/* Pre-Publish Checklist Component */}
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="border-b border-black/5 px-6 py-4">
            <CardTitle className="text-base font-bold text-foreground">Content SEO Checklist Pra-Publikasi</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-black/5 rounded-none text-sm">
                <div className="flex items-center space-x-3">
                  {item.status === "passed" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" weight="fill" />
                  ) : (
                    <WarningCircle className="w-5 h-5 text-amber-600 shrink-0" weight="fill" />
                  )}
                  <span className="font-medium text-foreground text-xs sm:text-sm">{item.label}</span>
                </div>

                <div>
                  {item.status === "passed" ? (
                    <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      Passed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-600 border-amber-500/20">
                      Warning
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
