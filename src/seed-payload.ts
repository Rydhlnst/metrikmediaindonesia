import { getPayload } from "payload";
import config from "../payload.config";
import fs from "fs";
import path from "path";
import os from "os";

const IMAGES = [
  { url: "https://picsum.photos/seed/bisnis1/1200/675", alt: "Ekonomi digital Indonesia" },
  { url: "https://picsum.photos/seed/olahraga1/1200/675", alt: "Timnas Indonesia" },
  { url: "https://picsum.photos/seed/pendidikan1/1200/675", alt: "Literasi digital pelajar" },
  { url: "https://picsum.photos/seed/budaya1/1200/675", alt: "Festival budaya Nusantara" },
  { url: "https://picsum.photos/seed/startup1/1200/675", alt: "Startup EdTech" },
  { url: "https://picsum.photos/seed/badminton1/1200/675", alt: "Jonatan Christie" },
  { url: "https://picsum.photos/seed/kurikulum1/1200/675", alt: "Kurikulum Merdeka" },
  { url: "https://picsum.photos/seed/adat1/1200/675", alt: "Upacara adat Tambi" },
  { url: "https://picsum.photos/seed/bisnis2/1200/675", alt: "Investasi asing" },
  { url: "https://picsum.photos/seed/olahraga2/1200/675", alt: "Piala Dunia U-20" },
];

async function downloadImage(url: string): Promise<string> {
  const tmpDir = path.join(os.tmpdir(), "seed-images");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const filepath = path.join(tmpDir, filename);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${url}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  return filepath;
}

async function seed() {
  const payload = await getPayload({ config });

  // Create admin user
  let admin;
  try {
    admin = await payload.create({
      collection: "users",
      data: {
        email: "admin@metrikmediaindonesia.id",
        password: "admin123",
        name: "Admin",
        role: "super-admin",
      },
    });
    console.log("Admin user created:", admin.email);
  } catch {
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: "admin@metrikmediaindonesia.id" } },
    });
    admin = existing.docs[0];
    if (!admin) {
      console.error("Failed to create/find admin");
      process.exit(1);
    }
    console.log("Using existing admin:", admin.email);
  }

  // Create categories
  const categoryData = [
    { name: "Bisnis", slug: "bisnis", color: "#2563EB" },
    { name: "Olahraga", slug: "olahraga", color: "#059669" },
    { name: "Pendidikan", slug: "pendidikan", color: "#7C3AED" },
    { name: "Sosial & Budaya", slug: "sosial-dan-budaya", color: "#D97706" },
  ];

  const categories = [];
  for (const cat of categoryData) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: cat.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      categories.push(existing.docs[0]);
      console.log(`Category "${cat.name}" exists`);
    } else {
      const created = await payload.create({ collection: "categories", data: cat });
      categories.push(created);
      console.log(`Category "${cat.name}" created`);
    }
  }

  // Create tags
  const tagData = [
    { name: "Breaking News", slug: "breaking-news" },
    { name: "Indonesia", slug: "indonesia" },
    { name: "Global", slug: "global" },
    { name: "Exclusive", slug: "exclusive" },
    { name: "Trending", slug: "trending" },
  ];

  for (const tag of tagData) {
    const existing = await payload.find({
      collection: "tags",
      where: { slug: { equals: tag.slug } },
      limit: 1,
    });
    if (existing.docs.length === 0) {
      await payload.create({ collection: "tags", data: tag });
      console.log(`Tag "${tag.name}" created`);
    } else {
      console.log(`Tag "${tag.name}" exists`);
    }
  }

  // Download and create media items
  console.log("\nDownloading images...");
  const mediaItems = [];
  for (let i = 0; i < IMAGES.length; i++) {
    const img = IMAGES[i];
    try {
      const filepath = await downloadImage(img.url);
      const media = await payload.create({
        collection: "media",
        filePath: filepath,
        data: { alt: img.alt },
      });
      mediaItems.push(media);
      console.log(`Image ${i + 1}/${IMAGES.length} uploaded: ${img.alt}`);

      // Cleanup temp file
      fs.unlinkSync(filepath);
    } catch (e: any) {
      console.error(`Image ${i + 1} failed:`, e.message);
      mediaItems.push(null);
    }
  }

  // Create articles with featured images
  const articleData = [
    { title: "Pertumbuhan Ekonomi Digital Indonesia Meningkat Signifikan", slug: "pertumbuhan-ekonomi-digital-indonesia", excerpt: "Ekonomi digital Indonesia menunjukkan pertumbuhan yang mengesankan di semester pertama 2026, didorong oleh penetrasi internet yang semakin luas dan adopsi teknologi oleh UMKM.", catSlug: "bisnis", isFeatured: true, readingTime: 5, imgIdx: 0 },
    { title: "Timnas Indonesia Raih Medali Emas di ASEAN Games 2026", slug: "timnas-indonesia-raih-medali-emas-asean-games", excerpt: "Atlet Indonesia menorehkan prestasi gemilang dengan meraih medali emas pertama di cabang bulu tangkis beregu putra.", catSlug: "olahraga", isFeatured: false, readingTime: 4, imgIdx: 1, isBreaking: true },
    { title: "Program Literasi Digital Pemerintah Sasar 10 Juta Pelajar", slug: "program-literasi-digital-10-juta-pelajar", excerpt: "Kementerian Pendidikan meluncurkan program literasi digital baru yang menyasar 10 juta pelajar di seluruh Indonesia.", catSlug: "pendidikan", isFeatured: false, readingTime: 6, imgIdx: 2 },
    { title: "Festival Budaya Nusantara Hadirkan 34 Provinsi", slug: "festival-budaya-nusantara-34-provinsi", excerpt: "Festival budaya terbesar di Indonesia kembali digelar dengan menampilkan kekayaan budaya dari 34 provinsi.", catSlug: "sosial-dan-budaya", isFeatured: false, readingTime: 5, imgIdx: 3 },
    { title: "Startup EdTech Indonesia Raih Pendanaan Seri B", slug: "startup-edtech-indonesia-pendanaan-seri-b", excerpt: "Perusahaan rintisan pendidikan teknologi asal Jakarta berhasil mengumpulkan pendanaan seri B senilai $50 juta.", catSlug: "bisnis", isFeatured: false, readingTime: 3, imgIdx: 4 },
    { title: "Jonatan Christie Juara All England Open 2026", slug: "jonatan-christie-juara-all-england-2026", excerpt: "Pebulutangkis Indonesia Jonatan Christie berhasil meraih gelar juara All England Open 2026.", catSlug: "olahraga", isFeatured: false, readingTime: 4, imgIdx: 5 },
    { title: "Kurikulum Merdeka 2026 Resmi Diterapkan", slug: "kurikulum-merdeka-2026-resmi-diterapkan", excerpt: "Kemendikbud resmi menerapkan Kurikulum Merdeka 2026 di seluruh sekolah dasar dan menengah.", catSlug: "pendidikan", isFeatured: false, readingTime: 5, imgIdx: 6 },
    { title: "Upacara Adat Tambi Tetap Lestari di Tengah Modernisasi", slug: "upacara-adt-tambi-tetap-lestari", excerpt: "Masyarakat adat di Sulawesi Selatan masih mempertahankan tradisi Tambi yang telah turun-temurun.", catSlug: "sosial-dan-budaya", isFeatured: false, readingTime: 6, imgIdx: 7 },
    { title: "Investasi Asing di Indonesia Naik 15 Persen", slug: "investasi-asing-indonesia-naik-15-persen", excerpt: "Realisasi investasi asing di Indonesia meningkat 15% dibandingkan tahun lalu, dipimpin sektor manufaktur.", catSlug: "bisnis", isFeatured: false, readingTime: 4, imgIdx: 8 },
    { title: "Indonesia Siap Tuan Rumah Piala Dunia U-20", slug: "indonesia-siap-tuan-rumah-piala-dunia-u20", excerpt: "Persiapan infrastruktur stadion dan fasilitas pendukung untuk Piala Dunia U-20 mencapai 80 persen.", catSlug: "olahraga", isFeatured: false, readingTime: 5, imgIdx: 9 },
  ];

  for (const art of articleData) {
    const existing = await payload.find({
      collection: "articles",
      where: { slug: { equals: art.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      console.log(`Article "${art.title}" exists`);
      continue;
    }

    const cat = categories.find((c) => c.slug === art.catSlug);
    if (!cat) continue;

    const media = mediaItems[art.imgIdx];

    await payload.create({
      collection: "articles",
      data: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [{ type: "text", text: art.excerpt, version: 1 }],
                version: 1,
              },
            ],
            direction: null,
            format: "",
            indent: 0,
            version: 1,
          },
        },
        category: cat.id,
        author: admin.id,
        status: "published",
        readingTime: art.readingTime,
        publishedAt: new Date().toISOString(),
        isFeatured: art.isFeatured || false,
        isBreaking: (art as any).isBreaking || false,
        ...(media ? { featuredImage: media.id } : {}),
      },
    });
    console.log(`Article "${art.title}" created`);
  }

  console.log("\nSeed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
