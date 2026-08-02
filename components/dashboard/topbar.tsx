"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowClockwise, User, Gear, SignOut } from "@phosphor-icons/react/dist/ssr";

function formatAdminDate(date: Date): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function AdminClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now
    ? now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-gray-600">
      Jam Admin: {time}
    </span>
  );
}

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

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="flex min-h-16 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="shrink-0 lg:hidden" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-gray-50">
              <Avatar className="size-10 shrink-0">
                <AvatarImage src="/avatar-admin.png" alt={userName} />
                <AvatarFallback className="bg-gray-200 text-sm font-semibold text-gray-600">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-[15px] font-bold leading-tight text-foreground">
                  Halo, {userName.toUpperCase()}
                </span>
                <span className="text-[12px] text-gray-400">
                  {formatAdminDate(new Date())}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                <User className="size-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                <Gear className="size-4" />
                Pengaturan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
              <SignOut className="size-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <AdminClock />
        <span className="h-5 w-px bg-gray-200" />
        <button
          onClick={handleRefresh}
          className="flex size-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-50 hover:text-foreground"
          title="Refresh"
        >
          <ArrowClockwise className="size-5" />
        </button>
      </div>
    </header>
  );
}
