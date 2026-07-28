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
import { authors } from "@/lib/mock-data";
import Image from "next/image";

export default function AuthorsPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Penulis</CardTitle>
            <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
              <Plus className="size-4" />
              Penulis Baru
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="border rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted">
                    <TableHead className="h-10 text-xs font-semibold">Nama</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Role</TableHead>
                    <TableHead className="h-10 text-xs font-semibold">Bio</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authors.map((author) => (
                    <TableRow key={author.id} className="border-border/50">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            width={32}
                            height={32}
                            className="bg-muted"
                          />
                          <span className="font-medium text-sm">{author.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-news-red font-medium">
                        {author.role}
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground max-w-[200px] line-clamp-1">
                        {author.bio}
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
