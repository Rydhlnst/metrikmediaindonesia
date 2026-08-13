"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  UploadSimple,
  Trash,
  Copy,
  Image,
  File,
  X,
  CircleNotch,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: number;
  url: string;
  type: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  caption: string | null;
  createdAt: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/upload?page=${p}&limit=20`);
      const data = await res.json();
      setMedia(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(page);
  }, [page]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload gagal");
      fetchMedia(page);
    } catch {
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus media ini?")) return;
    try {
      await fetch(`/api/upload/${id}`, { method: "DELETE" });
      fetchMedia(page);
      setSelectedMedia(null);
    } catch {
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto grid gap-4">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg font-bold">Media</CardTitle>
              <Badge variant="outline" className="text-xs">{total} file</Badge>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                size="sm"
                className="gap-2 rounded-none"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <CircleNotch className="size-4 animate-spin" />
                ) : (
                  <UploadSimple className="size-4" />
                )}
                {uploading ? "Mengunggah..." : "Upload"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded bg-muted/30" />
                ))}
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Image className="mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Belum ada media</p>
                <p className="text-xs text-muted-foreground/70">Upload gambar untuk memulai</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {media.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMedia(item)}
                      className="group relative aspect-square overflow-hidden border border-border/50 bg-muted/10 transition-colors hover:border-foreground/20"
                    >
                      <img
                        src={item.url}
                        alt={item.alt || ""}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40">
                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="text-[10px] text-white line-clamp-1">{item.alt || "image"}</p>
                          <p className="text-[10px] text-white/70">{formatFileSize(item.size)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Halaman {page} dari {totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="size-8 rounded-none p-0"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <CaretLeft className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="size-8 rounded-none p-0"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        <CaretRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
          <DialogContent className="max-w-2xl rounded-none">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Detail Media</DialogTitle>
            </DialogHeader>
            {selectedMedia && (
              <div className="space-y-4">
                <div className="overflow-hidden border border-border/50">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.alt || ""}
                    className="w-full object-contain"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ukuran:</span>{" "}
                    {formatFileSize(selectedMedia.size)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipe:</span>{" "}
                    {selectedMedia.mimeType}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dimensi:</span>{" "}
                    {selectedMedia.width && selectedMedia.height
                      ? `${selectedMedia.width} × ${selectedMedia.height}`
                      : "-"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Diunggah:</span>{" "}
                    {new Date(selectedMedia.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">URL:</span>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={selectedMedia.url}
                      className="h-9 flex-1 border border-outline-variant bg-muted px-3 text-xs font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 rounded-none"
                      onClick={() => handleCopyUrl(selectedMedia.url)}
                    >
                      <Copy className="size-3" />
                      {copied ? "Tersalin!" : "Salin"}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1 rounded-none"
                    onClick={() => handleDelete(selectedMedia.id)}
                  >
                    <Trash className="size-3" />
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
