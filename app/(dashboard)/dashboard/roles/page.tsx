"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash } from "lucide-react";

const roles = [
  { id: "1", name: "Super Admin", description: "Akses penuh ke seluruh sistem", userCount: 1 },
  { id: "2", name: "Editor", description: "Mengelola konten dan mempublikasikan artikel", userCount: 2 },
  { id: "3", name: "Author", description: "Menulis dan mengirim artikel untuk review", userCount: 5 },
  { id: "4", name: "Reporter", description: "Meliput dan menulis berita di lapangan", userCount: 8 },
  { id: "5", name: "Viewer", description: "Melihat konten dashboard saja", userCount: 3 },
];

export default function RolesPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Role & Akses</CardTitle>
            <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
              <Plus className="size-4" />
              Role Baru
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Nama Role</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Deskripsi</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Pengguna</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} className="border-border/50">
                      <TableCell className="py-3 font-medium text-sm">{role.name}</TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground max-w-[300px]">
                        {role.description}
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs text-muted-foreground">
                        {role.userCount}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-7"><Pencil className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="size-7 text-destructive"><Trash className="size-3.5" /></Button>
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
    </main>
  );
}
