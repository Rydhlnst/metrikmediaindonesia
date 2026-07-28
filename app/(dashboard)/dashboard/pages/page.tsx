"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash } from "lucide-react";

const pages = [
  { id: "1", title: "Tentang Kami", slug: "tentang-kami", status: "published" as const, updatedAt: "2026-07-20" },
  { id: "2", title: "Tim Editorial", slug: "tim-editorial", status: "published" as const, updatedAt: "2026-07-18" },
  { id: "3", title: "Hubungi Kami", slug: "hubungi-kami", status: "published" as const, updatedAt: "2026-07-15" },
  { id: "4", title: "Kebijakan Privasi", slug: "kebijakan-privasi", status: "draft" as const, updatedAt: "2026-07-10" },
  { id: "5", title: "Syarat & Ketentuan", slug: "syarat-ketentuan", status: "draft" as const, updatedAt: "2026-07-10" },
];

const statusConfig = {
  published: { label: "Published", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
};

export default function PagesPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Halaman Statis</CardTitle>
            <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
              <Plus className="size-4" />
              Halaman Baru
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Judul</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Slug</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Status</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Terakhir Diubah</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => {
                    const status = statusConfig[page.status];
                    return (
                      <TableRow key={page.id} className="border-border/50">
                        <TableCell className="py-3 font-medium text-sm">{page.title}</TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">/{page.slug}</TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className={`text-[10px] font-medium rounded-none ${status.className}`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground">{page.updatedAt}</TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-7">
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-7 text-destructive">
                              <Trash className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
