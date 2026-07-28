"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Pencil, Trash } from "lucide-react";
import { articles } from "@/lib/mock-data";

export default function ArticlesPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Semua Artikel</CardTitle>
            <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
              <Plus className="size-4" />
              Artikel Baru
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Judul</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Kategori</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Penulis</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Views</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id} className="border-border/50">
                      <TableCell className="py-3">
                        <span className="line-clamp-1 font-medium text-sm">
                          {article.title}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: article.category.color }}
                        >
                          {article.category.name}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground">
                        {article.author.name}
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs text-muted-foreground">
                        {article.viewCount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-7">
                            <Eye className="size-3.5" />
                          </Button>
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
