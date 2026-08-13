"use client";

import { useState, useRef, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { DashboardTopbar } from "@/components/dashboard/topbar";
const TiptapEditor = dynamic(
  () => import("@/components/dashboard/tiptap-editor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="min-h-[300px] bg-muted/30 animate-pulse" /> }
);
import { SeoTracker } from "@/components/dashboard/seo-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, FloppyDisk, PaperPlaneRight, ArrowLeft, Plus, X, Image, CircleNotch, Trash } from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

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
  const [focusKeyword, setFocusKeyword] = useState("");
  const [seoScore, setSeoScore] = useState(0);
  const [status, setStatus] = useState("published");
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategoriesList(data);
      })
      .catch(() => {});

    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();
        if (res.ok) {
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setThumbnailUrl(data.thumbnail || "");
          setStatus(data.status || "published");
          setSelectedCategory(data.categoryId ? String(data.categoryId) : "");
          setSeoTitle(data.seoTitle || "");
          setSeoDescription(data.seoDescription || "");
          setSeoKeywords(data.seoKeywords || "");
          setFocusKeyword(data.focusKeyword || "");
          setSeoScore(data.seoScore || 0);
        } else {
          toast.error(data.message || "Artikel tidak ditemukan");
          router.push("/dashboard/articles");
        }
      } catch {
        toast.error("Gagal mengambil data artikel");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, router]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("maxWidth", "1920");

    setIsUploadingThumbnail(true);
    const toastId = toast.loading("Mengunggah dan mengkompresi gambar utama...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal mengunggah gambar");

      setThumbnailUrl(result.data.url);
      toast.success("Gambar utama berhasil diunggah (WebP)", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah gambar", { id: toastId });
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  const handleUpdateArticle = async (targetStatus?: string) => {
    if (!title || !slug) {
      toast.error("Judul dan slug artikel wajib diisi");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Memperbarui artikel...");

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          thumbnail: thumbnailUrl,
          status: targetStatus || status,
          categoryId: selectedCategory || null,
          seoTitle,
          seoDescription,
          seoKeywords,
          focusKeyword,
          seoScore,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui artikel");

      toast.success("Artikel berhasil diperbarui", { id: toastId });
      router.push("/dashboard/articles");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui artikel", { id: toastId });
    } finally {
      setIsSaving(false);
    }
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
            <h1 className="text-lg font-bold">Edit Artikel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-none"
              disabled={isSaving}
              onClick={() => handleUpdateArticle("draft")}
            >
              {isSaving ? <CircleNotch className="size-4 animate-spin" /> : <FloppyDisk className="size-4" />}
              Simpan Draft
            </Button>
            <Button
              disabled={isSaving}
              onClick={() => handleUpdateArticle("published")}
              className="gap-2 rounded-none bg-news-red text-white hover:bg-news-red/90"
            >
              {isSaving ? <CircleNotch className="size-4 animate-spin" /> : <PaperPlaneRight className="size-4" />}
              Update & Publish
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <CircleNotch className="size-8 animate-spin text-news-red" />
          </div>
        ) : (
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
                    onChange={(e) => setTitle(e.target.value)}
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
                <div className="space-y-4">
                  <SeoTracker
                    title={title}
                    slug={slug}
                    excerpt={excerpt}
                    content={content}
                    thumbnailUrl={thumbnailUrl}
                    seoTitle={seoTitle}
                    seoDescription={seoDescription}
                    seoKeywords={seoKeywords}
                    focusKeyword={focusKeyword}
                    onFocusKeywordChange={setFocusKeyword}
                    onScoreChange={setSeoScore}
                  />

                  <Card className="rounded-none bg-card ring-0 shadow-sm">
                    <CardHeader className="px-4 py-3">
                      <CardTitle className="text-sm font-bold">Metadata Pencarian (Meta Tags)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 pb-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium">SEO Title Override</label>
                        <Input
                          placeholder="Judul untuk mesin pencari (opsional)"
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          className="rounded-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium">Meta Description</label>
                        <textarea
                          rows={3}
                          placeholder="Deskripsi ringkas untuk Google Search & Social Preview"
                          value={seoDescription}
                          onChange={(e) => setSeoDescription(e.target.value)}
                          className="w-full resize-none rounded-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-news-red"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium">Keywords (Kata Kunci SEO)</label>
                        <Input
                          placeholder="keyword1, keyword2, keyword3"
                          value={seoKeywords}
                          onChange={(e) => setSeoKeywords(e.target.value)}
                          className="rounded-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="rounded-none bg-card ring-0 shadow-sm">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold">Pengaturan Artikel</CardTitle>
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
                      {(categoriesList.length > 0 ? categoriesList : CATEGORIES).map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card className="rounded-none bg-card ring-0 shadow-sm">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold">Excerpt / Ringkasan</CardTitle>
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
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                  />
                  {thumbnailUrl ? (
                    <div className="relative aspect-video overflow-hidden border border-border bg-muted">
                      <img
                        src={thumbnailUrl}
                        alt="Gambar Utama"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 size-7 rounded-none"
                        onClick={() => setThumbnailUrl("")}
                      >
                        <Trash className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="flex aspect-video cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted transition-colors hover:border-news-red/50"
                    >
                      {isUploadingThumbnail ? (
                        <CircleNotch className="size-8 animate-spin text-news-red" />
                      ) : (
                        <div className="text-center">
                          <Image className="mx-auto size-8 text-muted-foreground/50" />
                          <p className="mt-2 text-xs font-medium text-foreground">
                            Klik untuk upload gambar
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Otomatis dikonversi ke WebP dioptimasi (max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
