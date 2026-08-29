"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminNavSections, contributorNavSections } from "./data";
import { cn } from "@/lib/utils";
import { CaretDown, SignOut, User } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "@/lib/use-session";

function isAdminRole(role?: string | null) {
  if (!role) return true; // default admin untuk sesi legacy/tanpa role
  return role !== "Kontributor";
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useSession();

  const isAdmin = isAdminRole(user?.role);
  const navSections = isLoading ? adminNavSections : isAdmin ? adminNavSections : contributorNavSections;
  const displayName = user?.name || "Admin";
  const initials = displayName
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar collapsible="icon" className="border-r border-black/10 overflow-hidden bg-background">
      <SidebarHeader className="h-16 px-3 flex flex-row items-center border-b border-black/10 bg-background">
        <SidebarMenu className="w-full">
          <SidebarMenuItem className="flex items-center justify-between gap-2 w-full">
            <SidebarMenuButton
              asChild
              size="lg"
              className="h-12 px-2 hover:bg-black/5 transition-colors group-data-[collapsible=icon]:p-0"
            >
              <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
                <Image
                  src="/metrikmedialogo.png"
                  alt="Metrik Media Indonesia"
                  width={32}
                  height={32}
                  className="size-8 object-contain shrink-0"
                />
                <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="font-serif text-xs sm:text-sm font-extrabold tracking-wider text-on-surface uppercase truncate leading-tight">
                    METRIK MEDIA
                  </span>
                  <span className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase leading-tight">
                    INDONESIA
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="shrink-0 text-muted-foreground hover:text-foreground" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-4 p-3">
        {navSections.map((section) => (
          <SidebarGroup key={section.title} className="p-0">
            <SidebarGroupLabel className="h-8 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className={cn(
                          "h-9 gap-3 px-3 text-sm font-medium transition-colors rounded-none",
                          isActive
                            ? "bg-[#B8860B]/10 text-[#B8860B] font-semibold border-r-2 border-[#B8860B]"
                            : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon
                            className={cn(
                              "size-4 shrink-0",
                              isActive ? "text-[#B8860B]" : "text-muted-foreground"
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="gap-3 px-3 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Kembali ke situs"
              className="h-9 gap-3 px-3 text-sm text-muted-foreground"
            >
              <Link href="/">
                <span>Kembali ke Situs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={displayName}
                  className="h-11 w-full gap-3 px-3"
                >
                  <Avatar className="size-6 shrink-0 bg-muted">
                    <AvatarFallback className="text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-left text-sm font-medium">
                    {displayName}
                  </span>
                  <CaretDown className="size-4 shrink-0 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56 rounded-none border border-black/10 bg-white p-1 shadow-md">
                <DropdownMenuItem asChild>
                  <Link href={isAdmin ? "/dashboard/settings" : "/dashboard/profile"} className="flex cursor-pointer items-center gap-2 rounded-none px-3 py-2 text-xs font-medium">
                    <User className="size-4 text-muted-foreground" />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-black/10" />
                <DropdownMenuItem onClick={() => void signOut()} className="flex cursor-pointer items-center gap-2 rounded-none px-3 py-2 text-xs font-medium text-destructive focus:text-destructive">
                  <SignOut className="size-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
