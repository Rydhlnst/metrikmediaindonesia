import { Metadata } from "next";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, MapPin, PencilSimple, Trash, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Manajemen Wilayah & Lokasi - Metrik Media CMS",
  description: "Kelola hirarki wilayah (Provinsi, Kota/Kabupaten, Kecamatan) untuk berita daerah.",
};

const MOCK_LOCATIONS = [
  { id: 1, name: "Jawa Barat", level: "Provinsi", slug: "jawa-barat", parent: "Indonesia", count: 420 },
  { id: 2, name: "Bandung", level: "Kota", slug: "bandung", parent: "Jawa Barat", count: 180 },
  { id: 3, name: "Karawang", level: "Kabupaten", slug: "karawang", parent: "Jawa Barat", count: 95 },
  { id: 4, name: "Jawa Tengah", level: "Provinsi", slug: "jawa-tengah", parent: "Indonesia", count: 310 },
  { id: 5, name: "Jawa Timur", level: "Provinsi", slug: "jawa-timur", parent: "Indonesia", count: 280 },
];

export default function LocationsManagementPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Hirarki Wilayah & Berita Daerah</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center flex-wrap gap-1">
                <span>Struktur hirarki wilayah liputan: Indonesia</span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span>Provinsi</span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span>Kota/Kabupaten</span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span>Kecamatan.</span>
              </p>
            </div>
            <Button className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs">
              <Plus className="size-4" weight="bold" />
              Tambah Wilayah
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Nama Wilayah</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Tingkat / Level</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Induk Wilayah</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Artikel Terkait</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_LOCATIONS.map((loc) => (
                    <TableRow key={loc.id} className="border-black/5 hover:bg-black/2">
                      <TableCell className="py-3 font-semibold text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-primary" weight="bold" />
                          <span>{loc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-xs font-medium text-muted-foreground">
                        {loc.level}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground">
                        {loc.parent}
                      </TableCell>
                      <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                        /location/{loc.slug}
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs font-mono">
                        {loc.count.toLocaleString("id-ID")}
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
