import { Metadata } from "next";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowsLeftRight, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Redirect Manager - Metrik Media CMS",
  description: "Kelola pengalihan URL (301/302 Redirects) untuk mencegah broken link dan menjaga reputasi SEO.",
};

const MOCK_REDIRECTS = [
  { id: 1, oldUrl: "/news/old-digital-title", newUrl: "/news/indonesia-luncurkan-program-transformasi-digital-nasional-2026-2030", code: 301, status: "Active" },
  { id: 2, oldUrl: "/berita/lama-pasar-saham", newUrl: "/news/pasar-saham-indonesia-catat-rekor-tertinggi-sepanjang-sejarah", code: 301, status: "Active" },
];

export default function RedirectsManagementPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Redirect Manager (301 & 302 URL Forwarding)</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Mengalihkan URL artikel lama ke URL baru tanpa kehilangan otoritas peringkat pencarian (Link Equity).</p>
            </div>
            <Button className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs">
              <Plus className="size-4" weight="bold" />
              Tambah Redirect
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">URL Asal (Old URL)</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">URL Tujuan (New URL)</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">HTTP Status</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Status</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_REDIRECTS.map((red) => (
                    <TableRow key={red.id} className="border-black/5 hover:bg-black/2">
                      <TableCell className="py-3 font-mono text-xs text-destructive font-semibold">
                        {red.oldUrl}
                      </TableCell>
                      <TableCell className="py-3 font-mono text-xs text-emerald-600 font-semibold">
                        {red.newUrl}
                      </TableCell>
                      <TableCell className="py-3 text-xs font-mono font-bold">
                        {red.code} Permanent
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          {red.status}
                        </Badge>
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
