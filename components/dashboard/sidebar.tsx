"use client";

import Link from "next/link";
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
import { navSections } from "./data";
import { cn } from "@/lib/utils";
import { Zap, ChevronDown } from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r overflow-hidden">
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              size="lg"
              className="h-11 px-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:hidden"
            >
              <Link href="/dashboard">
                <div className="flex size-8 items-center justify-center bg-news-red text-white">
                  <Zap className="size-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">Metrik Media Indonesia</span>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger />
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
                          "h-9 gap-3 px-3 text-sm font-medium",
                          isActive
                            ? "bg-news-red/10 text-news-red"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon
                            className={cn(
                              "size-4",
                              isActive ? "text-news-red" : ""
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
            <SidebarMenuButton
              asChild
              tooltip="Payload Admin"
              className="h-9 gap-3 px-3 text-sm text-muted-foreground"
            >
              <Link href="/admin" target="_blank">
                <span>Payload Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex items-center gap-0">
            <SidebarMenuButton
              asChild
              tooltip="Admin"
              className="h-11 flex-1 gap-3 px-3"
            >
              <Link href="/dashboard/settings">
                <Avatar className="size-6 shrink-0 bg-muted">
                  <AvatarFallback className="text-[10px]">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-sm font-medium">
                  Admin
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
