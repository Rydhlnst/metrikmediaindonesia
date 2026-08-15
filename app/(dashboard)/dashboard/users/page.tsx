"use client";

import { useState, useEffect, useCallback } from "react";
import { getInitials } from "@/lib/utils";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { UserDialog } from "@/components/dashboard/user-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Plus, PencilSimple, Trash, MagnifyingGlass, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  roleId: number | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  roleName: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();

      setUsers(data?.data || []);
      setPagination(
        data?.pagination || {
          page: 1,
          limit: 10,
          total: data?.data?.length || 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      toast.error("Gagal mengambil data pengguna");
      setUsers([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => {
      fetchUsers(1, value);
    }, 300);
    return () => clearTimeout(timeout);
  };

  const handleDelete = async () => {
    if (!deleteUser) return;

    try {
      const res = await fetch(`/api/users/${deleteUser.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Pengguna berhasil dihapus");
      setDeleteUser(null);
      fetchUsers(pagination.page, search);
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus pengguna");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Pengguna & Staf Redaksi</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Kelola akun staf, hak akses, dan status login redaksi.</p>
            </div>
            <Button
              className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-4 py-2 shadow-2xs"
              onClick={() => {
                setEditingUser(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="size-4" weight="bold" />
              Tambah Pengguna
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 rounded-none border-black/15 bg-white text-xs"
                />
              </div>
            </div>

            <div className="border border-black/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Pengguna</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Email</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Role</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface">Status</TableHead>
                    <TableHead className="h-10 text-xs font-bold uppercase tracking-wider text-on-surface text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <CircleNotch className="size-4 animate-spin text-primary" />
                          Memuat data pengguna...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="p-8 text-center">
                        <EmptyState
                          compact
                          title="Tidak Ada Pengguna"
                          description={
                            search
                              ? `Tidak ditemukan hasil untuk "${search}". Coba kata kunci lain.`
                              : "Belum ada data pengguna redaksi yang terdaftar."
                          }
                          actionLabel="Tambah Pengguna Baru"
                          onAction={() => {
                            setEditingUser(null);
                            setDialogOpen(true);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="border-black/5 hover:bg-black/[0.02]">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 rounded-none border border-black/10">
                              <AvatarImage src={user.avatar || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-none">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-xs text-foreground">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                          {user.email}
                        </TableCell>
                        <TableCell className="py-3 text-xs font-bold text-primary uppercase">
                          {user.roleName?.replace(/_/g, " ") || "STAF"}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold rounded-none uppercase tracking-wider ${
                              user.isActive
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {user.isActive ? "Aktif" : "Non-Aktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none"
                              onClick={() => {
                                setEditingUser(user);
                                setDialogOpen(true);
                              }}
                            >
                              <PencilSimple className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-none text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteUser(user)}
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

            {(pagination?.totalPages || 0) > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Menampilkan {((pagination?.page || 1) - 1) * (pagination?.limit || 10) + 1} -{" "}
                  {Math.min((pagination?.page || 1) * (pagination?.limit || 10), pagination?.total || 0)} dari{" "}
                  {pagination?.total || 0} pengguna
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none text-xs"
                    disabled={(pagination?.page || 1) <= 1}
                    onClick={() => fetchUsers((pagination?.page || 1) - 1, search)}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none text-xs"
                    disabled={(pagination?.page || 1) >= (pagination?.totalPages || 1)}
                    onClick={() => fetchUsers((pagination?.page || 1) + 1, search)}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSuccess={() => fetchUsers(pagination.page, search)}
      />

      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{deleteUser?.name}</strong>? Tindakan ini
              tidak dapat dibatalkan.
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
    </div>
  );
}
