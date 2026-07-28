"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image, File, Trash } from "lucide-react";

const mediaItems = [
  { id: "1", name: "hero-banner.jpg", type: "image", size: "2.4 MB", uploadedAt: "2026-07-25" },
  { id: "2", name: "thumbnail-article-1.jpg", type: "image", size: "1.2 MB", uploadedAt: "2026-07-24" },
  { id: "3", name: "press-release.pdf", type: "file", size: "340 KB", uploadedAt: "2026-07-24" },
  { id: "4", name: "logo-official.png", type: "image", size: "856 KB", uploadedAt: "2026-07-23" },
  { id: "5", name: "infographic-covid.jpg", type: "image", size: "3.1 MB", uploadedAt: "2026-07-22" },
  { id: "6", name: "interview-video.mp4", type: "file", size: "45.2 MB", uploadedAt: "2026-07-21" },
];

export default function MediaPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Media Manager</CardTitle>
            <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
              <Upload className="size-4" />
              Upload File
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="group border border-border p-4 transition-colors hover:border-news-red/50"
                >
                  <div className="flex aspect-square items-center justify-center bg-muted mb-3">
                    {item.type === "image" ? (
                      <Image className="size-8 text-muted-foreground/50" />
                    ) : (
                      <File className="size-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{item.size}</span>
                    <span>{item.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
