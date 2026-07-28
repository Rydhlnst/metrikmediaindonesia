"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiptapEditor } from "@/components/dashboard/tiptap-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Save, Send, ArrowLeft, Plus, X, Image } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/articles">
              <Button variant="ghost" size="icon" className="size-8">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Artikel Baru</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 rounded-none">
              <Eye className="size-4" />
              Preview
            </Button>
            <Button variant="outline" className="gap-2 rounded-none">
              <Save className="size-4" />
              Simpan Draft
            </Button>
            <Button className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90">
              <Send className="size-4" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-4">
            {/* Title */}
            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardContent className="p-4">
                <input
                  type="text"
                  placeholder="Judul artikel"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground"
                />
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("content")}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "content"
                    ? "border-news-red text-news-red"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Konten
              </button>
              <button
                onClick={() => setActiveTab("seo")}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "seo"
                    ? "border-news-red text-news-red"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                SEO Settings
              </button>
            </div>

            {/* Content Tab */}
            {activeTab === "content" && (
              <Card className="rounded-none bg-card ring-0 shadow-sm">
                <CardContent className="p-4">
                  <TiptapEditor content={content} onChange={setContent} />
                </CardContent>
              </Card>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <Card className="rounded-none bg-card ring-0 shadow-sm">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold">SEO & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 pb-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium">SEO Title</label>
                    <Input
                      placeholder="Judul untuk mesin pencari"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="rounded-none"
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {seoTitle.length}/60 karakter
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium">Meta Description</label>
                    <textarea
                      rows={3}
                      placeholder="Deskripsi untuk mesin pencari"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="w-full resize-none rounded-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {seoDescription.length}/160 karakter
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium">Keywords</label>
                    <Input
                      placeholder="keyword1, keyword2, keyword3"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium">Canonical URL</label>
                    <Input
                      placeholder="https://metrikmediaindonesia.id/..."
                      className="rounded-none"
                      disabled
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Auto-generated dari slug
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish Settings */}
            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-sm font-bold">Pengaturan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Slug</label>
                  <Input
                    placeholder="url-artikel"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-none font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
                  >
                    <option value="">Pilih kategori</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambah tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="rounded-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-9 shrink-0 rounded-none"
                      onClick={addTag}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="gap-1 rounded-none text-[10px]"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-0.5 text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-2.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-sm font-bold">Excerpt</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <textarea
                  rows={4}
                  placeholder="Ringkasan singkat artikel..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full resize-none rounded-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
                />
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="rounded-none bg-card ring-0 shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-sm font-bold">Gambar Utama</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex aspect-video items-center justify-center border-2 border-dashed border-border bg-muted">
                  <div className="text-center">
                    <Image className="mx-auto size-8 text-muted-foreground/50" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      JPG, PNG, WebP (max 5MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
