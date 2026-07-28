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

const advertisements = [
  { id: "1", title: "Banner Header", position: "Header", status: "active" as const, startDate: "2026-07-01", endDate: "2026-07-31" },
  { id: "2", title: "Sidebar Promosi", position: "Sidebar", status: "active" as const, startDate: "2026-07-15", endDate: "2026-08-15" },
  { id: "3", title: "Interstitial Mobile", position: "Interstitial", status: "paused" as const, startDate: "2026-06-01", endDate: "2026-06-30" },
  { id: "4", title: "Footer Banner", position: "Footer", status: "expired" as const, startDate: "2026-05-01", endDate: "2026-05-31" },
];

const statusConfig = {
  active: { label: "Active", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  paused: { label: "Paused", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

export default function AdvertisementsPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Iklan & Banner</CardTitle>
            <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
              <Plus className="size-4" />
              Iklan Baru
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Judul</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Posisi</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Status</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Periode</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advertisements.map((ad) => {
                    const status = statusConfig[ad.status];
                    return (
                      <TableRow key={ad.id} className="border-border/50">
                        <TableCell className="py-3 font-medium text-sm">{ad.title}</TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground">{ad.position}</TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className={`text-[10px] font-medium rounded-none ${status.className}`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground">
                          {ad.startDate} - {ad.endDate}
                        </TableCell>
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
