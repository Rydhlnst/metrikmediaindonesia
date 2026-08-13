"use client";

import { useState, useEffect, useCallback } from "react";
import { getInitials } from "@/lib/utils";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { UserDialog } from "@/components/dashboard/user-dialog";
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

      setUsers(data.data || []);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Gagal mengambil data pengguna");
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
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Pengguna</CardTitle>
            <Button
              className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90"
              onClick={() => {
                setEditingUser(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="size-4" />
              Pengguna Baru
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari pengguna..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="rounded-none pl-9"
                />
              </div>
            </div>

            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Nama</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Email</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Role</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Status</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <CircleNotch className="mx-auto size-6 animate-spin text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        Tidak ada pengguna ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="border-border/50">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-7">
                              <AvatarImage src={user.avatar || undefined} />
                              <AvatarFallback className="bg-news-red text-[10px] text-white">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-news-red font-medium">
                          {user.roleName?.replace(/_/g, " ") || "-"}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium rounded-none ${
                              user.isActive
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
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
                              className="size-7 text-destructive"
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

            {pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
                  {pagination.total} pengguna
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchUsers(pagination.page - 1, search)}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchUsers(pagination.page + 1, search)}
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
    </main>
  );
}
