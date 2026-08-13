"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/use-session";
import { UserCircle, SignIn, SignOut, BookmarkSimple, PencilSimple, CircleNotch, Check } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isLoading, signOut, refresh } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const startEditing = () => {
    setName(user?.name || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui profil");
      
      toast.success("Profil berhasil diperbarui");
      setIsEditing(false);
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto size-6 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 text-center md:min-h-[calc(100vh-48px)]">
        <div>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center bg-surface-container">
            <UserCircle className="size-8 text-on-surface-variant" />
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary">Profil Anda</h1>
          <p className="mt-2 font-label-md text-label-md text-on-surface-variant">Login untuk mengakses profil dan artikel tersimpan</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary hover:text-on-secondary">
              <SignIn className="size-4" /> Login
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 border border-outline-variant px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-container-low">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <div className="border border-outline-variant p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-16 items-center justify-center bg-surface-container text-xl font-bold text-on-surface-variant">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-on-surface">Nama</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-10 w-full border border-outline-variant bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 bg-primary text-on-primary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-on-secondary disabled:opacity-50"
                  >
                    {isSaving ? (
                      <CircleNotch className="size-3 animate-spin" />
                    ) : (
                      <Check className="size-3" />
                    )}
                    Simpan
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-on-surface">{user.name}</h1>
                  <button
                    onClick={startEditing}
                    className="flex size-6 items-center justify-center text-muted-foreground hover:text-primary"
                    title="Edit nama"
                  >
                    <PencilSimple className="size-3.5" />
                  </button>
                </div>
                <p className="text-sm text-on-surface-variant">{user.email}</p>
                {user.role && (
                  <span className="mt-2 inline-block bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant">{user.role}</span>
                )}
              </>
            )}
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface">
            <SignOut className="size-4" /> Logout
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BookmarkSimple className="size-5 text-on-surface-variant" />
          <h2 className="text-lg font-semibold text-on-surface">Artikel Tersimpan</h2>
        </div>
        <Link
          href="/saved"
          className="block border border-outline-variant py-12 text-center transition-colors hover:bg-surface-container-low"
        >
          <BookmarkSimple className="mx-auto mb-4 size-10 text-on-surface-variant/50" />
          <p className="font-medium text-on-surface">Lihat Artikel Tersimpan</p>
          <p className="mt-1 text-sm text-on-surface-variant">Akses bookmark Anda di sini</p>
        </Link>
      </div>
    </div>
  );
}
