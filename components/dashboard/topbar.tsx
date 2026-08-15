"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User, Gear, SignOut, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";

export function DashboardTopbar() {
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    fetch("/api/auth/get-session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.name) setUserName(data.user.name.split(" ")[0]);
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between border-b border-black/10 bg-white px-4 sm:px-6 lg:px-8 w-full shrink-0">
      {/* Left: Mobile Sidebar Trigger + System Title */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="shrink-0 lg:hidden text-muted-foreground hover:text-foreground" />
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground">Sistem Manajemen Berita</span>
          <span className="text-black/20">•</span>
          <span className="text-[#B8860B]">Panel Redaksi</span>
        </div>
      </div>

      {/* Right: Portal Link + User Profile Dropdown (Alinged to the FAR RIGHT) */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          <span>Kunjungi Situs</span>
          <ArrowSquareOut className="size-3.5" />
        </Link>

        <div className="h-4 w-px bg-black/10 hidden md:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-none p-1 transition-colors hover:bg-black/5 outline-none cursor-pointer">
              <Avatar className="size-9 shrink-0 rounded-none border border-black/10">
                <AvatarImage src="/avatar-admin.png" alt={userName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-none">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start text-left sm:flex">
                <span className="text-xs font-bold leading-tight text-foreground">
                  {userName}
                </span>
                <span className="text-[10px] font-semibold text-[#B8860B] uppercase tracking-wider leading-tight">
                  Panel Admin
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-none border border-black/10 bg-white shadow-md p-1">
            <div className="px-3 py-2 border-b border-black/5 mb-1">
              <p className="text-xs font-bold text-foreground">{userName}</p>
              <p className="text-[10px] text-muted-foreground font-mono">admin@metrikmedia.id</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer text-xs font-medium px-3 py-2 rounded-none hover:bg-black/5">
                <User className="size-4 text-muted-foreground" />
                Profil Saya
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer text-xs font-medium px-3 py-2 rounded-none hover:bg-black/5">
                <Gear className="size-4 text-muted-foreground" />
                Pengaturan Sistem
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black/10 my-1" />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-xs font-medium px-3 py-2 rounded-none text-destructive hover:bg-destructive/10 focus:text-destructive">
              <SignOut className="size-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
