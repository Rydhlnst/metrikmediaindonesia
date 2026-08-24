"use client";

import { useState, useEffect } from "react";
import { getInitials } from "@/lib/utils";
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
import { UploadSimple, X } from "@phosphor-icons/react/dist/ssr";
import { requestJson, toastApiError } from "@/lib/api-client";

interface Role {
  id: number;
  name: string;
  description: string | null;
}

interface User {
  id: string;
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
      const data = await requestJson<{ data?: Role[] }>("/api/roles");
      setRoles(data.data || []);
    } catch (error) {
      toastApiError(error);
    }
  };

  useEffect(() => {
    if (open) {
      queueMicrotask(() => fetchRoles());
      if (user) {
        queueMicrotask(() => {
          setName(user.name);
          setEmail(user.email);
          setPassword("");
          setRoleId(user.roleId?.toString() || "");
          setAvatar(user.avatar);
          setIsActive(user.isActive);
        });
      } else {
        queueMicrotask(() => resetForm());
      }
    }
  }, [open, user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await requestJson<{ data: { url: string } }>("/api/upload", {
        method: "POST",
        body: formData,
      });

      setAvatar(data.data.url);
      toast.success("Avatar berhasil diunggah");
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const body: Record<string, string | number | boolean | null> = {
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

      await requestJson(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      toast.success(isEditing ? "Pengguna berhasil diperbarui" : "Pengguna berhasil dibuat");
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none border border-black/10 bg-white">
        <DialogHeader className="border-b border-black/5 pb-4">
          <DialogTitle className="text-base font-bold text-foreground">
            {isEditing ? "Edit Pengguna Redaksi" : "Tambah Pengguna Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="size-14 rounded-none border border-black/10">
              <AvatarImage src={avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-base rounded-none">
                {name ? getInitials(name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface">Avatar Foto</label>
              <div className="mt-1.5 flex items-center gap-2">
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
                    className="rounded-none gap-1.5 text-xs border-black/15"
                    disabled={isUploading}
                    asChild
                  >
                    <span>
                      <UploadSimple className="size-3.5" />
                      {isUploading ? "Upload..." : "Upload"}
                    </span>
                  </Button>
                </label>
                {avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-none gap-1 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => setAvatar(null)}
                  >
                    <X className="size-3.5" />
                    Hapus
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface">Nama Lengkap</label>
            <Input
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface">Email Redaksi</label>
            <Input
              type="email"
              placeholder="email@metrikmedia.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface">
              Password {isEditing && "(kosongkan jika tidak ingin mengubah)"}
            </label>
            <Input
              type="password"
              placeholder={isEditing ? "••••••••" : "Minimal 8 karakter"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
              minLength={isEditing ? 0 : 8}
              required={!isEditing}
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface">Role Redaksi (RBAC)</label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="rounded-none border-black/15 bg-white text-xs">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-black/10">
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()} className="text-xs">
                    {role.name.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 rounded-none accent-[#B8860B]"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer">
              Akun Aktif (Dapat Login)
            </label>
          </div>

          <DialogFooter className="pt-2 border-t border-black/5">
            <Button
              type="button"
              variant="outline"
              className="rounded-none text-xs"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-5 py-2 shadow-2xs"
            >
              {isSaving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Buat Pengguna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
