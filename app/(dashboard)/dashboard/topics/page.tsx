import { Metadata } from "next";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TagSimple, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Manajemen Topik Berita - Metrik Media CMS",
  description: "Kelola daftar topik berita, deskripsi topical authority, dan pemetaan ke artikel.",
};

const MOCK_TOPICS = [
  { id: 1, name: "Pemilu 2029", slug: "pemilu-2029", articlesCount: 120, description: "Liputan isu politik nasional dan tahapan Pemilu 2029." },
  { id: 2, name: "Transformasi Digital", slug: "transformasi-digital", articlesCount: 85, description: "Isu digitalisasi, broadband, dan infrastruktur IT nasional." },
  { id: 3, name: "Piala Dunia U-20", slug: "piala-dunia-u-20", articlesCount: 64, description: "Kabar Garuda Muda dan pertandingan internasional." },
  { id: 4, name: "IHSG & Pasar Saham", slug: "ihsg-dan-pasar-saham", articlesCount: 42, description: "Perkembangan bursa efek Indonesia dan investasi modal." },
];

export default function TopicsManagementPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Topik Berita (Topical Authority)</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Membangun topical authority di Google News melalui pengelompokan entitas berita.</p>
            </div>
            <Button className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs">
              <Plus className="size-4" weight="bold" />
              Tambah Topik
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Nama Topik</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Deskripsi</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Jumlah Artikel</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TOPICS.map((topic) => (
                    <TableRow key={topic.id} className="border-black/5 hover:bg-black/2">
                      <TableCell className="py-3 font-semibold text-sm">
                        <div className="flex items-center gap-2">
                          <TagSimple className="size-4 text-primary" weight="bold" />
                          <span>{topic.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                        /topic/{topic.slug}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {topic.description}
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs font-mono">
                        {topic.articlesCount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-7 rounded-none">
                            <PencilSimple className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-7 rounded-none text-destructive hover:bg-destructive/10">
                            <Trash className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
