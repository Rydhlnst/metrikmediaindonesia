"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { DashboardTopbar } from "@/components/dashboard/topbar";
const TiptapEditor = dynamic(
  () => import("@/components/dashboard/tiptap-editor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-muted/30 animate-pulse border border-black/10" /> }
);
import { SeoTracker } from "@/components/dashboard/seo-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FloppyDisk,
  PaperPlaneRight,
  ArrowLeft,
  Plus,
  X,
  Image,
  CircleNotch,
  Trash,
  Sparkle,
  User,
  Star,
  Lightning,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("1");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [imageCaption, setImageCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [seoScore, setSeoScore] = useState(0);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [authorsList, setAuthorsList] = useState<any[]>([]);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch Authors
    fetch("/api/authors")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAuthorsList(data);
          setSelectedAuthor(String(data[0].id));
        } else {
          // Fallback mock authors
          setAuthorsList([
            { id: 1, name: "Ahmad Rizky Pratama", role: "Chief Editor" },
            { id: 2, name: "Siti Nurhaliza", role: "Senior Reporter" },
            { id: 3, name: "Budi Santoso", role: "Jurnalis Investigasi" },
          ]);
          setSelectedAuthor("1");
        }
      })
      .catch(() => {
        setAuthorsList([
          { id: 1, name: "Ahmad Rizky Pratama", role: "Chief Editor" },
          { id: 2, name: "Siti Nurhaliza", role: "Senior Reporter" },
          { id: 3, name: "Budi Santoso", role: "Jurnalis Investigasi" },
        ]);
        setSelectedAuthor("1");
      });
  }, []);

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

  // Live word and reading time calculation
  const plainText = content.replace(/<[^>]*>/g, " ").trim();
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const calculatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSaveArticle = async (status: "draft" | "published") => {
    if (!title || !slug) {
      toast.error("Judul dan slug artikel wajib diisi");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading(status === "published" ? "Mempublikasikan artikel..." : "Menyimpan draft...");

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          subtitle: subtitle.trim() || null,
          excerpt: excerpt.trim() || null,
          content,
          thumbnail: thumbnailUrl || null,
          imageCaption: imageCaption.trim() || null,
          status,
          categoryId: selectedCategory || null,
          authorId: selectedAuthor ? parseInt(selectedAuthor) : null,
          locationId: selectedLocation ? parseInt(selectedLocation) : null,
          featured: isFeatured,
          breaking: isBreaking,
          readingTime: calculatedReadingTime,
          seoTitle: seoTitle.trim() || title,
          seoDescription: seoDescription.trim() || excerpt.trim() || null,
          seoKeywords: seoKeywords.trim() || null,
          focusKeyword: focusKeyword.trim() || null,
          seoScore,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan artikel");

      toast.success(status === "published" ? "Artikel berhasil dipublikasikan!" : "Draft berhasil disimpan!", { id: toastId });
      router.push("/dashboard/articles");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan artikel", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/5 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/articles">
              <Button variant="ghost" size="icon" className="size-8 rounded-none border border-black/10 bg-white hover:bg-black/5">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Artikel Baru</h1>
              <p className="text-xs text-muted-foreground">Tulis, verifikasi SEO, dan terbitkan liputan berita terkini.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-none text-xs border-black/15 bg-white hover:bg-black/5"
              disabled={isSaving}
              onClick={() => handleSaveArticle("draft")}
            >
              {isSaving ? <CircleNotch className="size-4 animate-spin" /> : <FloppyDisk className="size-4" weight="bold" />}
              Simpan Draft
            </Button>
            <Button
              disabled={isSaving}
              onClick={() => handleSaveArticle("published")}
              className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-5 py-2.5 shadow-2xs"
            >
              {isSaving ? <CircleNotch className="size-4 animate-spin" /> : <PaperPlaneRight className="size-4" weight="bold" />}
              Publish Berita
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Title & Subtitle Card */}
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Judul Utama Berita (Headline)
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik judul artikel berita di sini..."
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-transparent text-xl font-bold outline-none placeholder:text-muted-foreground/60 text-foreground border-b border-black/10 pb-2 focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Sub-Headline / Deck (Ringkasan Poin Kritis Berita)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tulis sub-judul 1-2 baris yang memperjelas sudut pandang berita..."
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full resize-none bg-transparent text-xs font-medium outline-none placeholder:text-muted-foreground/60 text-foreground border border-black/10 p-2.5 focus:border-[#B8860B]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <div className="flex border-b border-black/10 bg-white px-4 pt-2">
              <button
                onClick={() => setActiveTab("content")}
                className={`border-b-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === "content"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Konten & Naskah Berita
              </button>
              <button
                onClick={() => setActiveTab("seo")}
                className={`border-b-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  activeTab === "seo"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkle className="size-3.5" weight="bold" />
                Pengaturan SEO & Analisis
                {seoScore > 0 && (
                  <Badge className={`ml-1 text-[10px] rounded-none px-1.5 py-0 ${seoScore >= 70 ? 'bg-emerald-600' : 'bg-[#B8860B]'}`}>
                    {seoScore}/100
                  </Badge>
                )}
              </button>
            </div>

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="space-y-4">
                <TiptapEditor content={content} onChange={setContent} />
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="space-y-6">
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

                <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
                  <CardHeader className="border-b border-black/5 px-6 py-4">
                    <CardTitle className="text-base font-bold text-foreground">Metadata Pencarian (Meta Tags)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">SEO Title Override</label>
                      <Input
                        placeholder="Judul untuk mesin pencari (opsional)"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                      />
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {seoTitle.length}/65 karakter (kosongkan jika ingin menggunakan judul utama)
                      </p>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Meta Description</label>
                      <textarea
                        rows={3}
                        placeholder="Deskripsi ringkas untuk Google Search & Social Preview"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full resize-none rounded-none border border-black/15 bg-white p-3 text-sm outline-none focus:border-[#B8860B]"
                      />
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {seoDescription.length}/160 karakter
                      </p>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">Keywords (Kata Kunci SEO)</label>
                      <Input
                        placeholder="keyword1, keyword2, keyword3"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        className="rounded-none border-black/15 bg-white text-sm focus:border-[#B8860B]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar Settings Column */}
          <div className="space-y-6">
            {/* Editorial Toggles Card */}
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Status & Posisi Berita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <label className="flex items-start gap-3 cursor-pointer p-2.5 border border-black/10 hover:bg-black/[0.02] transition-colors">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="mt-0.5 size-4 accent-[#B8860B]"
                  />
                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Star className="size-3.5 text-[#B8860B]" weight="fill" />
                      Headline Utama (Lead Story)
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Tampilkan di posisi teratas halaman beranda portal berita.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 border border-black/10 hover:bg-black/[0.02] transition-colors">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="mt-0.5 size-4 accent-news-red"
                  />
                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-news-red">
                      <Lightning className="size-3.5" weight="fill" />
                      Breaking News Ticker
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Munculkan di bilah informasi cepat Breaking News paling atas.
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Author & Taxonomy Card */}
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Atribusi & Klasifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {/* Author Dropdown */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface">
                    <User className="size-3.5 text-primary" />
                    Penulis / Reporter
                  </label>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full rounded-none border border-black/15 bg-white px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-[#B8860B]"
                  >
                    <option value="">Pilih reporter / penulis</option>
                    {authorsList.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name} ({author.role || "Redaksi"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">
                    Rubrik Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-none border border-black/15 bg-white px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-[#B8860B]"
                  >
                    <option value="">Pilih rubrik kategori</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Dropdown */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface">
                    <MapPin className="size-3.5 text-primary" />
                    Wilayah Liputan
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full rounded-none border border-black/15 bg-white px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-[#B8860B]"
                  >
                    <option value="1">Nasional (Pusat)</option>
                    <option value="2">DKI Jakarta</option>
                    <option value="3">Ibu Kota Nusantara (IKN)</option>
                    <option value="4">Jawa Barat</option>
                    <option value="5">Jawa Timur</option>
                    <option value="6">Sumatera Utara</option>
                    <option value="7">Bali & Nusa Tenggara</option>
                  </select>
                </div>

                {/* Slug URL */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">
                    Slug URL
                  </label>
                  <Input
                    placeholder="url-artikel"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-none border-black/15 bg-white font-mono text-xs focus:border-[#B8860B]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface">
                    Tags Berita
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambah tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="rounded-none border-black/15 bg-white text-xs focus:border-[#B8860B]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-9 shrink-0 rounded-none border-black/15"
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
                          className="gap-1 rounded-none text-[10px] border-black/15 bg-black/5"
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

            {/* Featured Image & Photo Credit Card */}
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Foto Utama & Kredit (Hero Image)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
                {thumbnailUrl ? (
                  <div className="relative aspect-video overflow-hidden border border-black/10 bg-muted">
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
                    className="flex aspect-video cursor-pointer flex-col items-center justify-center border-2 border-dashed border-black/15 bg-white transition-colors hover:border-[#B8860B]"
                  >
                    {isUploadingThumbnail ? (
                      <CircleNotch className="size-8 animate-spin text-primary" />
                    ) : (
                      <div className="text-center p-3">
                        <Image className="mx-auto size-8 text-muted-foreground/50" />
                        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-foreground">
                          Klik untuk upload foto
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          WebP otomatis dikompresi (max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Sumber & Kredit Foto
                  </label>
                  <Input
                    placeholder="Contoh: Foto: Antara / Hafidz Mubarak"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="rounded-none border-black/15 text-xs bg-white focus:border-[#B8860B]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Excerpt Card */}
            <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
              <CardHeader className="border-b border-black/5 px-6 py-4">
                <CardTitle className="text-base font-bold text-foreground">Ringkasan (Excerpt)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <textarea
                  rows={3}
                  placeholder="Ringkasan singkat artikel untuk preview sosial dan feeds..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full resize-none rounded-none border border-black/15 bg-white p-3 text-xs outline-none focus:border-[#B8860B]"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
