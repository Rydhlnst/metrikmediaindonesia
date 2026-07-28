"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface Role {
  id: number;
  name: string;
  description: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  roleId: number | null;
  isActive: boolean;
  roleName: string | null;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSuccess: () => void;
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!user;

  useEffect(() => {
    if (open) {
      fetchRoles();
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPassword("");
        setRoleId(user.roleId?.toString() || "");
        setAvatar(user.avatar);
        setIsActive(user.isActive);
      } else {
        resetForm();
      }
    }
  }, [open, user]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRoleId("");
    setAvatar(null);
    setIsActive(true);
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      setRoles(data.data || []);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAvatar(data.data.url);
      toast.success("Avatar berhasil diunggah");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const body: any = {
        name,
        email,
        roleId: roleId ? parseInt(roleId) : null,
        avatar,
        isActive,
      };

      if (!isEditing || password) {
        body.password = password;
      }

      const url = isEditing ? `/api/users/${user!.id}` : "/api/users";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(isEditing ? "Pengguna berhasil diperbarui" : "Pengguna berhasil dibuat");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Pengguna" : "Pengguna Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={avatar || undefined} />
              <AvatarFallback className="bg-news-red text-white text-lg">
                {name ? getInitials(name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <label className="text-xs font-medium">Avatar</label>
              <div className="mt-1 flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-none gap-1"
                    disabled={isUploading}
                    asChild
                  >
                    <span>
                      <Upload className="size-3" />
                      {isUploading ? "Upload..." : "Upload"}
                    </span>
                  </Button>
                </label>
                {avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-none gap-1 text-destructive"
                    onClick={() => setAvatar(null)}
                  >
                    <X className="size-3" />
                    Hapus
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Nama</label>
            <Input
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-none"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Email</label>
            <Input
              type="email"
              placeholder="email@metrikmedia.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-medium">
              Password {isEditing && "(kosongkan jika tidak ingin mengubah)"}
            </label>
            <Input
              type="password"
              placeholder={isEditing ? "••••••••" : "Minimal 8 karakter"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none"
              minLength={isEditing ? 0 : 8}
              required={!isEditing}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Role</label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4"
            />
            <label htmlFor="isActive" className="text-xs font-medium">
              Aktif
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-none bg-news-red text-white hover:bg-news-red/90"
            >
              {isSaving ? "Menyimpan..." : isEditing ? "Simpan" : "Buat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
