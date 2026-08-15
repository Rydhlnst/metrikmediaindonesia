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
        <div className="mx-auto size-6 animate-spin rounded-full border-2 border-black/10 border-t-black" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-editorial flex min-h-[calc(100vh-200px)] items-center justify-center py-12 text-center">
        <div className="max-w-md w-full border border-black/10 bg-white p-8 space-y-6">
          <div className="mx-auto flex size-16 items-center justify-center bg-gold/10 border border-gold/30">
            <UserCircle className="size-8 text-gold-deep" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">Profil Pembaca</h1>
            <p className="mt-2 text-xs text-muted-foreground">Masuk ke akun Anda untuk mengelola preferensi dan mengakses artikel tersimpan.</p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/login" className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-black/90">
              <SignIn className="size-4" /> Masuk
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 border border-black/15 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-black/40 hover:bg-black/5">
              Daftar Akun
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <div className="border border-black/10 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-16 items-center justify-center bg-black/5 text-xl font-bold text-foreground">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Nama</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-10 w-full border border-black/10 bg-white px-3 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-black/90 disabled:opacity-50"
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
                    className="border border-black/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-black/40 hover:text-foreground"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-foreground">{user.name}</h1>
                  <button
                    onClick={startEditing}
                    className="flex size-6 items-center justify-center text-muted-foreground hover:text-gold-deep"
                    title="Edit nama"
                  >
                    <PencilSimple className="size-3.5" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.role && (
                  <span className="mt-2 inline-block bg-black/5 px-3 py-1 text-xs font-medium text-muted-foreground">{user.role}</span>
                )}
              </>
            )}
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 border border-black/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-black/40 hover:text-foreground hover:text-foreground">
            <SignOut className="size-4" /> Logout
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BookmarkSimple className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Artikel Tersimpan</h2>
        </div>
        <Link
          href="/saved"
          className="block border border-black/10 bg-white py-12 text-center transition-colors hover:border-gold/50"
        >
          <BookmarkSimple className="mx-auto mb-4 size-10 text-muted-foreground/50" />
          <p className="font-medium text-foreground">Lihat Artikel Tersimpan</p>
          <p className="mt-1 text-sm text-muted-foreground">Akses bookmark Anda di sini</p>
        </Link>
      </div>
    </div>
  );
}
