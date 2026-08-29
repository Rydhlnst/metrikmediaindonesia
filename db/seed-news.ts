import { config } from "dotenv";
import { resolve } from "path";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";
import { IMAGE_PLACEHOLDER } from "../lib/utils";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const connectionString = process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/metrikmedia";
const client = postgres(connectionString);
const db = drizzle(client, { schema });
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://metrikmediaindonesia.beres.io";

const tempoEditorialNote =
  "Sample editorial fixture. Ringkasan ditulis ulang untuk demo Metrik Media; artikel asli tetap menjadi milik Tempo.co dan wajib diverifikasi editor sebelum publikasi produksi.";

const categories = [
  { name: "Nasional", slug: "nasional", color: "#1D4ED8", description: "Berita utama isu nasional dan pemerintahan Indonesia." },
  { name: "Politik", slug: "politik", color: "#B91C1C", description: "Kabar politik, parlemen, dan kebijakan publik." },
  { name: "Bisnis", slug: "bisnis", color: "#2563EB", description: "Berita ekonomi, keuangan, bursa, dan dunia usaha." },
  { name: "Teknologi", slug: "teknologi", color: "#DC2626", description: "Perkembangan teknologi, AI, dan ekonomi digital." },
  { name: "Lifestyle", slug: "lifestyle", color: "#DB2777", description: "Gaya hidup, budaya, kesehatan, dan tren masyarakat." },
  { name: "Entertainment", slug: "entertainment", color: "#9333EA", description: "Dunia hiburan, musik, seni, dan perfilman." },
  { name: "Sports", slug: "sports", color: "#059669", description: "Berita olahraga nasional dan internasional." },
  { name: "Daerah", slug: "daerah", color: "#D97706", description: "Kabar regional dan dinamika daerah di Indonesia." },
] as const;

const tags = [
  ["Tempo.co", "tempo-co"],
  ["Indonesia", "indonesia"],
  ["Data Publik", "data-publik"],
  ["Kebijakan", "kebijakan"],
  ["Ekonomi", "ekonomi"],
  ["Kecerdasan Buatan", "kecerdasan-buatan"],
  ["Budaya", "budaya"],
  ["Olahraga", "olahraga"],
] as const;

const sampleArticles = [
  {
    category: "nasional",
    sourceUrl: "https://interaktif.tempo.co/",
    title: "Tren Kriminalitas dan Tantangan Keamanan Ruang Publik",
    slug: "tren-kriminalitas-dan-tantangan-keamanan-ruang-publik",
    subtitle: "Membaca data kriminalitas dan pertanyaan tentang rasa aman masyarakat.",
    excerpt: "Data kriminalitas menjadi pintu masuk untuk melihat bagaimana keamanan ruang publik dibentuk oleh kebijakan, kondisi sosial, dan partisipasi warga.",
    paragraphs: [
      "Data yang dihimpun Tempo menunjukkan bahwa pembahasan keamanan publik tidak cukup dilihat dari satu angka. Pola kejadian, lokasi, dan kelompok yang terdampak perlu dibaca bersama agar respons kebijakan tidak berhenti pada penindakan.",
      "Bagi pemerintah daerah, temuan tersebut menegaskan pentingnya transparansi data, pencegahan berbasis komunitas, serta evaluasi berkala terhadap penerangan, transportasi, dan layanan pengaduan warga.",
    ],
    tags: ["Tempo.co", "Indonesia", "Data Publik", "Kebijakan"],
    publishedAt: "2026-08-25T06:30:00+07:00",
    featured: true,
  },
  {
    category: "politik",
    sourceUrl: "https://interaktif.tempo.co/?page=7",
    title: "Kecerdasan Buatan Mulai Mengubah Percakapan Kampanye Politik",
    slug: "kecerdasan-buatan-mulai-mengubah-percakapan-kampanye-politik",
    subtitle: "Teknologi membuka peluang komunikasi politik sekaligus risiko baru bagi pemilih.",
    excerpt: "Penggunaan kecerdasan buatan dalam kampanye politik menuntut aturan transparansi, literasi digital, dan perlindungan pemilih dari manipulasi informasi.",
    paragraphs: [
      "Perkembangan kecerdasan buatan membuat produksi pesan politik menjadi lebih cepat dan terukur. Di sisi lain, kemampuan menghasilkan konten sintetis menambah tantangan dalam membedakan informasi resmi, opini, dan materi manipulatif.",
      "Praktik kampanye yang bertanggung jawab membutuhkan penandaan konten buatan AI, pengungkapan sumber pembiayaan, dan mekanisme koreksi yang dapat diakses publik.",
    ],
    tags: ["Tempo.co", "Kebijakan", "Kecerdasan Buatan", "Indonesia"],
    publishedAt: "2026-08-24T09:15:00+07:00",
    featured: false,
  },
  {
    category: "bisnis",
    sourceUrl: "https://event.tempo.co/read/2105533/statista-dan-tempo-umumkan-perusahaan-terbaik-indonesia-2026",
    title: "Survei Tempat Kerja Menyoroti Standar Baru Pengalaman Karyawan",
    slug: "survei-tempat-kerja-menyoroti-standar-baru-pengalaman-karyawan",
    subtitle: "Riset Indonesia’s Best Employers 2026 memetakan persepsi pekerja terhadap perusahaan.",
    excerpt: "Survei kolaborasi Tempo dan Statista menempatkan pengalaman, kepuasan, inovasi, serta peluang karier sebagai bagian penting dari daya saing perusahaan.",
    paragraphs: [
      "Riset Indonesia’s Best Employers 2026 menilai perusahaan melalui pengalaman dan persepsi pekerja. Selain kesediaan merekomendasikan tempat kerja, survei juga memperhatikan inovasi, inklusi, keseimbangan hidup, dan peluang karier.",
      "Bagi perusahaan, hasil ini menunjukkan bahwa reputasi pemberi kerja tidak hanya dibangun oleh kompensasi. Kualitas kepemimpinan, kejelasan pengembangan karier, dan rasa adil ikut menentukan daya tarik organisasi.",
    ],
    tags: ["Tempo.co", "Ekonomi", "Indonesia", "Data Publik"],
    publishedAt: "2026-08-23T11:00:00+07:00",
    featured: true,
  },
  {
    category: "teknologi",
    sourceUrl: "https://business.tempo.co/top-emerging-markets-every-investor-should-watch-in-2026/",
    title: "Infrastruktur Digital dan AI Menjadi Pengungkit Ekonomi Indonesia",
    slug: "infrastruktur-digital-dan-ai-menjadi-pengungkit-ekonomi-indonesia",
    subtitle: "Skala pasar domestik dan transformasi digital memperkuat daya tarik Indonesia.",
    excerpt: "Investasi infrastruktur digital, adopsi AI, dan hilirisasi menjadi tiga tema yang membentuk peluang pertumbuhan ekonomi Indonesia.",
    paragraphs: [
      "Analisis Tempo menempatkan skala pasar, konsumsi domestik, dan investasi digital sebagai keunggulan Indonesia di antara pasar berkembang. Peluang tersebut tetap bergantung pada kualitas regulasi dan kesiapan talenta.",
      "Adopsi AI perlu berjalan bersama tata kelola data, keamanan siber, serta peningkatan kemampuan pekerja. Dengan fondasi tersebut, teknologi dapat menjadi pengungkit produktivitas, bukan sekadar tren investasi.",
    ],
    tags: ["Tempo.co", "Ekonomi", "Kecerdasan Buatan", "Indonesia"],
    publishedAt: "2026-08-22T14:00:00+07:00",
    featured: false,
  },
  {
    category: "lifestyle",
    sourceUrl: "https://interaktif.tempo.co/?page=7",
    title: "Selera Musik Indonesia Tumbuh di Tengah Perubahan Platform Digital",
    slug: "selera-musik-indonesia-tumbuh-di-tengah-perubahan-platform-digital",
    subtitle: "Perubahan cara mendengar musik ikut membentuk ekosistem kreatif baru.",
    excerpt: "Perjalanan musik Indonesia memperlihatkan hubungan antara kebiasaan pendengar, teknologi distribusi, dan keberagaman karya lokal.",
    paragraphs: [
      "Perubahan platform digital membuat pendengar lebih mudah menemukan musik dari berbagai daerah dan generasi. Algoritma membantu penemuan karya, namun kurasi manusia tetap penting untuk menjaga konteks dan keberagaman.",
      "Bagi musisi, tantangan berikutnya adalah membangun hubungan langsung dengan pendengar melalui pertunjukan, komunitas, dan karya yang konsisten.",
    ],
    tags: ["Tempo.co", "Budaya", "Indonesia"],
    publishedAt: "2026-08-21T16:30:00+07:00",
    featured: false,
  },
  {
    category: "entertainment",
    sourceUrl: "https://event.tempo.co/",
    title: "Panggung Pertunjukan Beradaptasi ke Ekosistem Digital",
    slug: "panggung-pertunjukan-beradaptasi-ke-ekosistem-digital",
    subtitle: "Musik, teater, dan distribusi digital memperluas cara publik menikmati karya.",
    excerpt: "Perkembangan pertunjukan digital menunjukkan bagaimana karya seni dapat menemukan penonton baru tanpa kehilangan pengalaman panggung.",
    paragraphs: [
      "Perpindahan sebagian pengalaman pertunjukan ke platform digital memperluas jangkauan karya dan membuka ruang kolaborasi lintas disiplin. Namun, nilai utama pertunjukan tetap berada pada kualitas cerita dan keterlibatan penonton.",
      "Pelaku industri perlu memikirkan model distribusi, hak cipta, dan pengalaman pengguna secara bersamaan agar ekosistem kreatif tumbuh berkelanjutan.",
    ],
    tags: ["Tempo.co", "Budaya", "Indonesia"],
    publishedAt: "2026-08-20T18:00:00+07:00",
    featured: false,
  },
  {
    category: "sports",
    sourceUrl: "https://interaktif.tempo.co/",
    title: "Konsistensi Klub Menjadi Kunci di Balik Hattrick Juara",
    slug: "konsistensi-klub-menjadi-kunci-di-balik-hattrick-juara",
    subtitle: "Prestasi beruntun lahir dari pembinaan, kedalaman skuad, dan manajemen pertandingan.",
    excerpt: "Kesuksesan Persib mencatat sejarah hattrick juara memperlihatkan pentingnya konsistensi strategi di dalam dan luar lapangan.",
    paragraphs: [
      "Prestasi beruntun sebuah klub tidak hanya ditentukan oleh satu pertandingan. Kedalaman skuad, kualitas pembinaan, dan kemampuan menjaga fokus sepanjang musim menjadi faktor yang menentukan.",
      "Dari sisi industri olahraga, capaian tersebut juga memperkuat nilai komersial klub dan mendorong standar baru bagi pengelolaan sepak bola profesional di Indonesia.",
    ],
    tags: ["Tempo.co", "Olahraga", "Indonesia"],
    publishedAt: "2026-08-19T20:00:00+07:00",
    featured: false,
  },
  {
    category: "daerah",
    sourceUrl: "https://interaktif.tempo.co/",
    title: "Dampak El Nino Menuntut Adaptasi Daerah yang Lebih Terukur",
    slug: "dampak-el-nino-menuntut-adaptasi-daerah-yang-lebih-terukur",
    subtitle: "Perubahan iklim terasa berbeda di setiap wilayah dan membutuhkan solusi lokal.",
    excerpt: "Laporan khusus Tempo tentang dampak El Nino memperlihatkan pentingnya data wilayah, kesiapan pangan, dan kolaborasi masyarakat.",
    paragraphs: [
      "Dampak El Nino tidak hadir dengan pola yang sama di seluruh Indonesia. Perubahan curah hujan, tekanan terhadap pertanian, dan risiko kebakaran membutuhkan peta risiko yang disusun berdasarkan karakter setiap wilayah.",
      "Pemerintah daerah dapat memperkuat ketahanan dengan memperbaiki sistem peringatan dini, menjaga sumber air, dan melibatkan komunitas dalam pemantauan lingkungan.",
    ],
    tags: ["Tempo.co", "Data Publik", "Indonesia", "Kebijakan"],
    publishedAt: "2026-08-18T08:00:00+07:00",
    featured: false,
  },
] as const;

function htmlContent(paragraphs: readonly string[]) {
  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n");
}

async function ensureCategory(category: (typeof categories)[number]) {
  const [existing] = await db
    .select({ id: schema.categories.id })
    .from(schema.categories)
    .where(eq(schema.categories.slug, category.slug))
    .limit(1);

  if (existing) {
    await db.update(schema.categories).set({ ...category, isActive: true, updatedAt: new Date() }).where(eq(schema.categories.id, existing.id));
    return existing.id;
  }

  const [created] = await db.insert(schema.categories).values(category).returning({ id: schema.categories.id });
  if (!created) throw new Error(`Could not create category: ${category.slug}`);
  return created.id;
}

async function ensureTag(name: string, slug: string) {
  const [existing] = await db.select({ id: schema.tags.id }).from(schema.tags).where(eq(schema.tags.slug, slug)).limit(1);
  if (existing) return existing.id;
  const [created] = await db.insert(schema.tags).values({ name, slug }).returning({ id: schema.tags.id });
  if (!created) throw new Error(`Could not create tag: ${slug}`);
  return created.id;
}

async function ensureSource(url: string) {
  const [existing] = await db.select({ id: schema.sources.id }).from(schema.sources).where(eq(schema.sources.url, url)).limit(1);
  if (existing) return existing.id;
  const [created] = await db.insert(schema.sources).values({
    name: "Tempo.co",
    url,
    type: "document",
    notes: tempoEditorialNote,
  }).returning({ id: schema.sources.id });
  if (!created) throw new Error(`Could not create source: ${url}`);
  return created.id;
}

async function seed() {
  console.log("Seeding deterministic editorial news fixtures...");

  const categoryIds = new Map<string, number>();
  for (const category of categories) categoryIds.set(category.slug, await ensureCategory(category));

  const [author] = await db
    .select({ id: schema.authors.id })
    .from(schema.authors)
    .where(eq(schema.authors.slug, "redaksi-metrik"))
    .limit(1);
  const authorId = author
    ? author.id
    : (await db.insert(schema.authors).values({
        name: "Redaksi Metrik Media",
        slug: "redaksi-metrik",
        bio: "Tim editorial Metrik Media Indonesia.",
        role: "Redaksi",
      }).returning({ id: schema.authors.id }))[0]?.id;
  if (!authorId) throw new Error("Could not create demo author");

  const tagIds = new Map<string, number>();
  for (const [name, slug] of tags) tagIds.set(slug, await ensureTag(name, slug));

  for (const [index, article] of sampleArticles.entries()) {
    const categoryId = categoryIds.get(article.category);
    if (!categoryId) throw new Error(`Missing category: ${article.category}`);

    const sourceId = await ensureSource(article.sourceUrl);
    const articleValues = {
      title: article.title,
      slug: article.slug,
      subtitle: article.subtitle,
      excerpt: article.excerpt,
      content: htmlContent(article.paragraphs),
      // Keep demo media self-contained so production never depends on an external image host.
      thumbnail: IMAGE_PLACEHOLDER,
      imageCaption: "Ilustrasi editorial",
      imageCredit: "Metrik Media Indonesia — demo fixture",
      status: "published",
      publishedAt: new Date(article.publishedAt),
      categoryId,
      authorId,
      viewCount: 800 + (sampleArticles.length - index) * 137,
      readingTime: 3,
      seoTitle: article.title,
      seoDescription: article.excerpt,
      seoKeywords: article.tags.join(", "),
      focusKeyword: article.tags[0],
      canonicalUrl: `${siteUrl}/${article.category}/${article.slug}`,
      featured: article.featured,
      editorsChoice: index < 3,
      breaking: false,
    } as const;

    const [existing] = await db.select({ id: schema.articles.id }).from(schema.articles).where(eq(schema.articles.slug, article.slug)).limit(1);
    let articleId: number;
    if (existing) {
      await db.update(schema.articles).set({ ...articleValues, viewCount: undefined }).where(eq(schema.articles.id, existing.id));
      articleId = existing.id;
    } else {
      const [created] = await db.insert(schema.articles).values(articleValues).returning({ id: schema.articles.id });
      if (!created) throw new Error(`Could not create article: ${article.slug}`);
      articleId = created.id;
    }

    for (const tagName of article.tags) {
      const tagSlug = tags.find(([name]) => name === tagName)?.[1];
      const tagId = tagSlug ? tagIds.get(tagSlug) : undefined;
      if (tagId) await db.insert(schema.articleTags).values({ articleId, tagId }).onConflictDoNothing();
    }
    await db.insert(schema.articleSources).values({ articleId, sourceId }).onConflictDoNothing();

    const [revision] = await db.select({ id: schema.articleRevisions.id }).from(schema.articleRevisions).where(eq(schema.articleRevisions.articleId, articleId)).limit(1);
    if (!revision) {
      await db.insert(schema.articleRevisions).values({
        articleId,
        versionNumber: 1,
        title: article.title,
        content: htmlContent(article.paragraphs),
        changeSummary: "Initial demo editorial fixture.",
      });
    }
  }

  console.log(`Seeded ${sampleArticles.length} published articles across ${categories.length} categories.`);
}

seed()
  .catch((error) => {
    console.error("News seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => client.end());
