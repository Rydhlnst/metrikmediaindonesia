"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Image, Video, FileText, Trash, MagnifyingGlass, List } from "@phosphor-icons/react/dist/ssr";
import NextImage from "next/image";

interface MediaItem {
  id: number;
  url: string;
  type: string;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  caption: string | null;
  credit: string | null;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  image: <Image className="size-5" aria-hidden="true" alt="" />,
  video: <Video className="size-5" aria-hidden="true" />,
  file: <FileText className="size-5" aria-hidden="true" />,
};

const typeLabels: Record<string, string> = {
  image: "Gambar",
  video: "Video",
  file: "File",
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.set("type", filterType);
      params.set("limit", "50");

      const res = await fetch(`/api/media?${params}`);
      const data = await res.json();
      if (res.ok) {
        setMedia(data.data || []);
      }
    } catch {
      toast.error("Gagal memuat data media");
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    queueMicrotask(() => fetchMedia());
  }, [fetchMedia]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus media ini?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Media berhasil dihapus");
        setMedia((prev) => prev.filter((m) => m.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.message || "Gagal menghapus media");
      }
    } catch {
      toast.error("Gagal menghapus media");
    } finally {
      setDeleting(null);
    }
  };

  const filteredMedia = media.filter((item) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        (item.alt || "").toLowerCase().includes(q) ||
        (item.caption || "").toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/5 pb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Media Library</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola gambar, video, dan file yang diunggah
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="size-8"
              onClick={() => setViewMode("grid")}
            >
              <MagnifyingGlass className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="size-8"
              onClick={() => setViewMode("list")}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {["", "image", "video", "file"].map((t) => (
              <Button
                key={t}
                variant={filterType === t ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(t)}
              >
                {t ? typeLabels[t] : "Semua"}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className={viewMode === "grid" ? "aspect-square rounded-lg" : "h-16 rounded-lg"} />
            ))}
          </div>
        ) : filteredMedia.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Image className="size-12 text-muted-foreground mb-3" aria-hidden="true" alt="" />
              <p className="text-muted-foreground">Belum ada media yang diunggah</p>
              <p className="text-sm text-muted-foreground mt-1">
                Media akan muncul di sini setelah diunggah melalui form artikel
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="group overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  {item.type === "image" ? (
                    <NextImage
                      src={item.url}
                      alt={item.alt || ""}
                      width={640}
                      height={640}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {typeIcons[item.type] || <FileText className="size-8" />}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-8"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {item.alt || item.url.split("/").pop()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1">
                      {typeLabels[item.type] || item.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {formatSize(item.size)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMedia.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 p-3">
                  <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                    {item.type === "image" ? (
                      <NextImage
                        src={item.url}
                        alt={item.alt || ""}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        {typeIcons[item.type] || <FileText className="size-5" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.alt || item.url.split("/").pop()}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] px-1">
                        {typeLabels[item.type] || item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatSize(item.size)} · {item.width && item.height ? `${item.width}×${item.height}` : ""}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                  >
                    <Trash className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
