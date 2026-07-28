"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DashboardTopbar() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4">
      <div className="flex items-center gap-2 w-full max-w-sm">
        <SidebarTrigger className="lg:hidden shrink-0" />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Cari"
            className="h-9 rounded-none border-border bg-muted pl-9 text-sm w-full"
            placeholder="Cari artikel, kategori..."
          />
        </div>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Button variant="outline" className="h-9 gap-2 rounded-none">
          <Plus className="size-4" />
          Artikel Baru
        </Button>
      </div>
    </header>
  );
}
