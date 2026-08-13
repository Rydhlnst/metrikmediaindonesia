"use client";

import { useState, useEffect } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, PencilSimple, Trash, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { toast } from "sonner";

interface Role {
  id: number;
  name: string;
  description: string | null;
  userCount?: number;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<Role | null>(null);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      if (res.ok) {
        setRoles(data || []);
      } else {
        toast.error("Gagal mengambil data roles");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetch(`/api/roles/${deleteItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus role");
      }

      toast.success("Role berhasil dihapus");
      setDeleteItem(null);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus role");
    }
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Role & Pengaturan Akses</CardTitle>
            <Link href="/dashboard/roles/new">
              <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
                <Plus className="size-4" />
                Role Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Nama Role</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Deskripsi Akses</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Jumlah Pengguna</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-news-red" />
                      </TableCell>
                    </TableRow>
                  ) : roles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        Belum ada role khusus. Klik "Role Baru" untuk membuat.
                      </TableCell>
                    </TableRow>
                  ) : (
                    roles.map((role) => (
                      <TableRow key={role.id} className="border-border/50">
                        <TableCell className="py-3 font-semibold text-sm text-news-red">{role.name}</TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground max-w-[300px]">
                          {role.description || "-"}
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs text-muted-foreground font-mono">
                          {role.userCount || 0}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/roles/${role.id}/edit`}>
                              <Button variant="ghost" size="icon" className="size-7">
                                <PencilSimple className="size-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive"
                              onClick={() => setDeleteItem(role)}
                            >
                              <Trash className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Role</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus role <strong>{deleteItem?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
