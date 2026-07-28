"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash } from "lucide-react";

const tags = [
  { id: "1", name: "Bisnis", slug: "bisnis", articleCount: 45 },
  { id: "2", name: "Olahraga", slug: "olahraga", articleCount: 38 },
  { id: "3", name: "Pendidikan", slug: "pendidikan", articleCount: 52 },
  { id: "4", name: "Sosial & Budaya", slug: "sosial-dan-budaya", articleCount: 30 },
  { id: "5", name: "Indonesia", slug: "indonesia", articleCount: 65 },
  { id: "6", name: "Global", slug: "global", articleCount: 28 },
  { id: "7", name: "Breaking News", slug: "breaking-news", articleCount: 15 },
  { id: "8", name: "Exclusive", slug: "exclusive", articleCount: 8 },
];

export default function TagsPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Tags</CardTitle>
            <Button className="gap-2 rounded-none bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="size-4" />
              Tag Baru
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Nama</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Slug</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Artikel</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id} className="border-border/50">
                      <TableCell className="py-3 font-medium text-sm">{tag.name}</TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                        {tag.slug}
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs text-muted-foreground">
                        {tag.articleCount}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-7">
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-7 text-destructive">
                            <Trash className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
