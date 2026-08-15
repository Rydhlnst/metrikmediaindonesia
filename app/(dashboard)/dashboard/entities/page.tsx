import { Metadata } from "next";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Manajemen Entitas Berita - Metrik Media CMS",
  description: "Kelola entitas (Person, Organization, Place) untuk content relationship graph.",
};

const MOCK_ENTITIES = [
  { id: 1, name: "Pemerintah RI", type: "organization", slug: "pemerintah-ri", desc: "Lembaga eksekutif pemerintahan republik Indonesia.", count: 240 },
  { id: 2, name: "Menteri Kominfo", type: "person", slug: "menteri-kominfo", desc: "Pejabat pimpinan kementerian komunikasi.", count: 85 },
  { id: 3, name: "PT Telkom Indonesia", type: "organization", slug: "pt-telkom-indonesia", desc: "BUMN penyedia layanan telekomunikasi.", count: 62 },
  { id: 4, name: "Stadion Gelora Bung Karno", type: "place", slug: "gbk-jakarta", desc: "Kompleks olahraga serbaguna nasional di Jakarta.", count: 45 },
];

export default function EntitiesManagementPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Entitas Berita (Entity Relationship System)</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Hubungan antar-konten melalui Tokoh (Person), Organisasi (Organization), dan Tempat (Place).</p>
            </div>
            <Button className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs">
              <Plus className="size-4" weight="bold" />
              Tambah Entitas
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Nama Entitas</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Tipe Entitas</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Slug URL</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Deskripsi / Bio</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Berita Terkait</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ENTITIES.map((entity) => (
                    <TableRow key={entity.id} className="border-black/5 hover:bg-black/2">
                      <TableCell className="py-3 font-semibold text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-primary" weight="bold" />
                          <span>{entity.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold tracking-wider bg-black/5 text-foreground border-black/10">
                          {entity.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                        /entity/{entity.slug}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {entity.desc}
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs font-mono">
                        {entity.count.toLocaleString("id-ID")}
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
