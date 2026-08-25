import { config } from "dotenv";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

config({ path: resolve(process.cwd(), ".env.local") });

const connectionString = process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/metrikmedia";
const client = postgres(connectionString);
const db = drizzle(client, { schema });

function htmlContent(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
}

async function seed() {
  console.log("🚀 Seeding database Metrik Media Indonesia dengan konten lengkap...");

  // 1. Roles (PRD Section 4)
  await db.insert(schema.roles).values([
    { name: "user", description: "Registered reader account" },
    { name: "reporter", description: "Can create and manage owned article drafts" },
    { name: "admin", description: "System administration access" },
    { name: "super_admin", description: "Akses penuh terhadap seluruh sistem" },
    { name: "administrator", description: "Mengelola operasional platform & media" },
    { name: "editor_in_chief", description: "Mengontrol konten editorial, approve, reject, & publish" },
    { name: "editor", description: "Review, edit, add references, & manage tags" },
    { name: "journalist", description: "Membuat artikel, liputan lapangan, & upload media" },
    { name: "contributor", description: "Membuat draft artikel terbatas" },
    { name: "seo_manager", description: "Manage metadata, redirects, & sitemap configuration" },
    { name: "advertisement_manager", description: "Manage ad campaigns & business publications" },
  ]).onConflictDoNothing();

  const permissionDefinitions = [
    ["dashboard.view", "View protected dashboards"],
    ["articles.create", "Create articles"],
    ["articles.edit_own", "Edit owned articles"],
    ["articles.edit_any", "Edit any article"],
    ["articles.publish", "Publish articles"],
    ["articles.delete", "Delete articles"],
    ["submissions.create", "Create submissions"],
    ["submissions.review", "Review submissions"],
    ["media.upload", "Upload media"],
    ["media.edit_any", "Edit any media"],
    ["media.delete_any", "Delete any media"],
    ["taxonomy.manage", "Manage taxonomy"],
    ["users.manage", "Manage users"],
    ["ads.manage", "Manage advertisements"],
    ["analytics.view", "View analytics"],
    ["audit_logs.view", "View audit logs"],
    ["settings.manage", "Manage settings"],
    ["roles.manage", "Manage roles and permissions"],
  ] as const;
  await db.insert(schema.permissions).values(
    permissionDefinitions.map(([key, description]) => ({ key, description }))
  ).onConflictDoNothing();

  const seededRoles = await db.select().from(schema.roles);
  const seededPermissions = await db.select().from(schema.permissions);
  const allPermissionKeys = permissionDefinitions.map(([key]) => key);
  const rolePermissionKeys: Record<string, string[]> = {
    super_admin: allPermissionKeys,
    administrator: allPermissionKeys,
    admin: allPermissionKeys,
    editor_in_chief: ["dashboard.view", "articles.create", "articles.edit_any", "articles.publish", "articles.delete", "submissions.review", "media.upload", "media.edit_any", "media.delete_any", "taxonomy.manage", "analytics.view"],
    editor: ["dashboard.view", "articles.create", "articles.edit_any", "articles.publish", "submissions.review", "media.upload", "media.edit_any", "taxonomy.manage", "analytics.view"],
    seo_manager: ["dashboard.view", "articles.edit_any", "taxonomy.manage", "analytics.view"],
    advertisement_manager: ["dashboard.view", "ads.manage"],
    contributor: ["dashboard.view", "articles.create", "articles.edit_own", "submissions.create", "media.upload", "analytics.view"],
    reporter: ["dashboard.view", "articles.create", "articles.edit_own", "submissions.create", "media.upload"],
    journalist: ["dashboard.view", "articles.create", "articles.edit_own", "submissions.create", "media.upload"],
    user: ["submissions.create"],
  };
  const permissionIdByKey = new Map(seededPermissions.map((permission) => [permission.key, permission.id]));
  const rolePermissionRows = seededRoles.flatMap((role) =>
    (rolePermissionKeys[role.name] || []).flatMap((key) => {
      const permissionId = permissionIdByKey.get(key);
      return permissionId ? [{ roleId: role.id, permissionId }] : [];
    })
  );
  if (rolePermissionRows.length > 0) {
    await db.insert(schema.rolePermissions).values(rolePermissionRows).onConflictDoNothing();
  }

  // 2. Categories (PRD Section 6 & 12)
  await db.insert(schema.categories).values([
    { name: "Nasional", slug: "nasional", color: "#1D4ED8", description: "Berita utama isu nasional dan pemerintahan Indonesia." },
    { name: "Politik", slug: "politik", color: "#B91C1C", description: "Kabar politik, parlemen, dan pemilu." },
    { name: "Bisnis", slug: "bisnis", color: "#2563EB", description: "Berita ekonomi, keuangan, bursa efek, dan bisnis." },
    { name: "Teknologi", slug: "teknologi", color: "#DC2626", description: "Berita teknologi, AI, digitalisasi, dan startup." },
    { name: "Lifestyle", slug: "lifestyle", color: "#DB2777", description: "Gaya hidup, kesehatan, dan tren masyarakat." },
    { name: "Entertainment", slug: "entertainment", color: "#9333EA", description: "Dunia hiburan, seni, dan perfilman." },
    { name: "Sports", slug: "sports", color: "#059669", description: "Berita olahraga nasional dan internasional." },
    { name: "Daerah", slug: "daerah", color: "#D97706", description: "Kabar regional dan dinamika kabupaten/kota." },
  ]).onConflictDoNothing();

  // 3. Topics (PRD Section 13)
  await db.insert(schema.topics).values([
    { name: "Pemilu 2029", slug: "pemilu-2029", description: "Liputan mendalam seputar persiapan dan dinamika politik Pemilu 2029." },
    { name: "Transformasi Digital 2030", slug: "transformasi-digital-2030", description: "Perkembangan jaringan broadband, AI, dan kedaulatan data Indonesia." },
    { name: "Piala Dunia U-20", slug: "piala-dunia-u-20", description: "Rekam jejak dan perjuangan Garuda Muda di panggung internasional." },
    { name: "IHSG & Ekonomi Makro", slug: "ihsg-dan-ekonomi-makro", description: "Analisis bursa efek, suku bunga BI, dan tren investasi nasional." },
    { name: "Kebijakan Daerah 2026", slug: "kebijakan-daerah-2026", description: "Inovasi pelayanan publik di tingkat pemerintah provinsi dan daerah." },
  ]).onConflictDoNothing();

  // 4. Locations (PRD Section 15)
  await db.insert(schema.locations).values([
    { name: "Indonesia", slug: "indonesia", level: "country", description: "Wilayah Negara Kesatuan Republik Indonesia" },
    { name: "DKI Jakarta", slug: "dki-jakarta", level: "province", description: "Ibu kota dan pusat ekonomi Indonesia" },
    { name: "Jawa Barat", slug: "jawa-barat", level: "province", description: "Provinsi Jawa Barat" },
    { name: "Bandung", slug: "bandung", level: "city", description: "Kota Bandung" },
    { name: "Karawang", slug: "karawang", level: "district", description: "Kabupaten Karawang" },
    { name: "Jawa Tengah", slug: "jawa-tengah", level: "province", description: "Provinsi Jawa Tengah" },
    { name: "Jawa Timur", slug: "jawa-timur", level: "province", description: "Provinsi Jawa Timur" },
  ]).onConflictDoNothing();

  // 5. Entities (PRD Section 14)
  await db.insert(schema.entities).values([
    { name: "Pemerintah RI", slug: "pemerintah-ri", type: "organization", bioOrDesc: "Lembaga eksekutif pemerintahan republik Indonesia." },
    { name: "Kementerian Kominfo", slug: "kementerian-kominfo", type: "organization", bioOrDesc: "Kementerian bidang komunikasi dan informatika." },
    { name: "PT Telkom Indonesia", slug: "pt-telkom-indonesia", type: "organization", bioOrDesc: "BUMN penyelenggara jasa telekomunikasi terbesar." },
    { name: "Stadion Gelora Bung Karno", slug: "gbk-jakarta", type: "place", bioOrDesc: "Kompleks pusat olahraga nasional di Jakarta." },
  ]).onConflictDoNothing();

  // 6. Authors
  const authorData = [
    { name: "Ahmad Rizky Pratama", slug: "ahmad-rizky-pratama", bio: "Senior journalist dengan pengalaman 10 tahun liputan bisnis nasional.", role: "Chief Editor" },
    { name: "Siti Nurhaliza", slug: "siti-nurhaliza", bio: "Reporter pendidikan & isu nasional.", role: "Senior Reporter font-bold" },
    { name: "Budi Santoso", slug: "budi-santoso", bio: "Jurnalis budaya dan gaya hidup.", role: "Culture Editor" },
    { name: "Reza Firmansyah", slug: "reza-firmansyah", bio: "Jurnalis olahraga nasional.", role: "Sports Reporter" },
  ];
  await db.insert(schema.authors).values(authorData).onConflictDoNothing();

  // Fetch created categories and authors
  const allAuthors = await db.select().from(schema.authors);
  const allCategories = await db.select().from(schema.categories);
  const authorBySlug = Object.fromEntries(allAuthors.map((a) => [a.slug, a]));
  const catBySlug = Object.fromEntries(allCategories.map((c) => [c.slug, c]));

  // Comprehensive articles across ALL categories
  const articleSeed = [
    {
      title: "Pemerintah Resmikan Peta Jalan Pertumbuhan Ekonomi 8 Persen 2026-2030",
      slug: "pemerintah-resmikan-peta-jalan-pertumbuhan-ekonomi-8-persen",
      subtitle: "Fokus utama pada hilirisasi industri, energi hijau, dan digitalisasi UMKM.",
      excerpt: "Pemerintah meluncurkan target pertumbuhan ekonomi nasional sebesar 8 persen yang didukung efisiensi birokrasi dan investasi strategis.",
      category: "nasional", author: "ahmad-rizky-pratama", views: 24500, featured: true, breaking: true,
      content: htmlContent([
        "Pemerintah secara resmi menetapkan Peta Jalan Pertumbuhan Ekonomi Nasional 8 Persen periode 2026-2030.",
        "Target ini optimis dicapai melalui penguatan hilirisasi komoditas unggulan dan percepatan adopsi kecerdasan buatan di sektor manufaktur.",
      ]),
    },
    {
      title: "Dinamika Koalisi Parlemen dan Pembahasan RUU Pemilu 2029 Mulai Bergulir",
      slug: "dinamika-koalisi-parlemen-dan-pembahasan-ruu-pemilu-2029",
      subtitle: "Fraksi-fraksi di DPR mulai menyepakati poin krusial ambang batas parlemen.",
      excerpt: "Pembahasan RUU Pemilu 2029 resmi dimulai di Senayan dengan fokus penyempurnaan sistem pemungutan suara elektronik.",
      category: "politik", author: "siti-nurhaliza", views: 18900, featured: true, breaking: false,
      content: htmlContent([
        "Komisi II DPR RI menggelar rapat dengar pendapat umum bersama para pakar hukum tata negara terkait revisi Undang-Undang Pemilihan Umum.",
        "Sejumlah pasal krusial yang dibahas mencakup digitalisasi rekapitulasi suara dan keterwakilan perempuan di parlemen.",
      ]),
    },
    {
      title: "Pasar Saham Indonesia Catat Rekor Tertinggi Sepanjang Sejarah Tembus 8.000",
      slug: "pasar-saham-indonesia-catat-rekor-tertinggi-sepanjang-sejarah",
      subtitle: "IHSG bergerak menguat didorong aksi beli bersih investor asing.",
      excerpt: "Indeks Harga Saham Gabungan (IHSG) menembus level psikologis 8.000 didorong optimisme pertumbuhan ekonomi domestik.",
      category: "bisnis", author: "ahmad-rizky-pratama", views: 31200, featured: true, breaking: true,
      content: htmlContent([
        "Bursa Efek Indonesia mengukir sejarah baru setelah IHSG ditutup menguat signifikan di level 8.025.",
        "Sektor perbankan dan teknologi menjadi penopang utama penguatan indeks bursa saham hari ini.",
      ]),
    },
    {
      title: "Kedaulatan Data dan Kebijakan Pengembangan Artificial Intelligence Indonesia",
      slug: "kedaulatan-data-dan-kebijakan-pengembangan-ai-indonesia",
      subtitle: "Pemerintah merilis standar etika dan keamanan data nasional untuk adopsi AI.",
      excerpt: "Pedoman nasional penggunaan AI dirilis guna memastikan perlindungan data pribadi konsumen dan etika algoritma.",
      category: "teknologi", author: "ahmad-rizky-pratama", views: 19800, featured: false, breaking: false,
      content: htmlContent([
        "Pemerintah Indonesia menerbitkan pedoman etika penggunaan kecerdasan buatan bagi industri dan lembaga pemerintah.",
        "Kebijakan ini mewajibkan pemrosesan data sensitif dilakukan di pusat data domestik yang terverifikasi.",
      ]),
    },
    {
      title: "Tren Gaya Hidup Sehat Urban: Kesadaran Nutrisi Organik dan Olahraga Teratur",
      slug: "tren-gaya-hidup-sehat-urban-kesadaran-nutrisi-organik",
      subtitle: "Masyarakat perkotaan kian aktif mengadopsi pola makan seimbang.",
      excerpt: "Kesadaran akan kesehatan mental dan fisik mendorong gaya hidup berbasis pangan lokal organik dan olahraga komunitas.",
      category: "lifestyle", author: "budi-santoso", views: 14200, featured: false, breaking: false,
      content: htmlContent([
        "Gaya hidup sehat menjadi prioritas utama generasi muda perkotaan di Indonesia.",
        "Permintaan akan produk makanan organik lokal dan fasilitas olahraga komunitas meningkat pesat dalam kurun dua tahun terakhir.",
      ]),
    },
    {
      title: "Film Karya Sutradara Muda Indonesia Berhasil Tembus Festival Film Cannes",
      slug: "film-karya-sutradara-muda-indonesia-berhasil-tembus-cannes",
      subtitle: "Apresiasi tinggi dari kritikus film internasional untuk perfilman tanah air.",
      excerpt: "Karya sineas muda tanah air berkompetisi di kategori utama Festival Film Internasional Cannes.",
      category: "entertainment", author: "budi-santoso", views: 22100, featured: false, breaking: false,
      content: htmlContent([
        "Dunia perfilman Indonesia kembali bangga setelah karya sutradara berbakat berhasil masuk jajaran kompetisi utama Festival Film Cannes.",
        "Film berdurasi 120 menit ini mengupas keindahan budaya lokal dengan pendekatan naratif visual modern.",
      ]),
    },
    {
      title: "Timnas Garuda Muda Tampil Gemilang di Kualifikasi Piala Dunia U-20",
      slug: "timnas-garuda-muda-tampil-gemilang-di-kualifikasi-piala-dunia-u-20",
      subtitle: "Kemenangan dramatis 2-1 menegaskan kesiapan tim nasional di kancah dunia.",
      excerpt: "Garuda Muda mengamankan tiket fase gugur setelah menaklukkan tim kuat dalam laga ketat di Stadion GBK.",
      category: "sports", author: "reza-firmansyah", views: 34000, featured: true, breaking: true,
      content: htmlContent([
        "Tim Nasional Indonesia U-20 sukses melaju ke babak selanjutnya setelah menumbangkan tim lawan 2-1 di hadapan puluhan ribu pendukung.",
        "Dua gol penentu dicetak melalui eksekusi bola mati memukau pada menit-menit akhir pertandingan.",
      ]),
    },
    {
      title: "Pemerintah Daerah Jawa Barat Luncurkan Pusat Inovasi Pelayanan Publik Digital",
      slug: "pemerintah-daerah-jawa-barat-luncurkan-pusat-inovasi-pelayanan-publik",
      subtitle: "Layanan perizinan dan administrasi warga kini dapat diakses dalam satu aplikasi terpadu.",
      excerpt: "Inovasi sistem digitalisasi Pemprov Jabar memangkas waktu pengurusan izin usaha menjadi hanya beberapa menit.",
      category: "daerah", author: "siti-nurhaliza", views: 16700, featured: false, breaking: false,
      content: htmlContent([
        "Pemerintah Provinsi Jawa Barat meresmikan Pusat Inovasi Pelayanan Publik Digital di Bandung.",
        "Integrasi sistem ini memungkinkan warga dan pelaku usaha mengurus administrasi secara transparan dan bebas pungli.",
      ]),
    },
  ];

  const now = new Date();
  for (let i = 0; i < articleSeed.length; i++) {
    const a = articleSeed[i];
    const cat = catBySlug[a.category] || allCategories[0];
    const auth = authorBySlug[a.author] || allAuthors[0];

    const [createdArticle] = await db
      .insert(schema.articles)
      .values({
        title: a.title,
        slug: a.slug,
        subtitle: a.subtitle,
        excerpt: a.excerpt,
        content: a.content,
        thumbnail: "/placeholder.png",
        status: "published",
        publishedAt: new Date(now.getTime() - i * 7200 * 1000),
        categoryId: cat.id,
        authorId: auth.id,
        viewCount: a.views,
        readingTime: 5,
        featured: a.featured,
        breaking: a.breaking,
        seoTitle: a.title,
        seoDescription: a.excerpt,
        canonicalUrl: `https://metrikmediaindonesia.id/news/${a.slug}`,
      })
      .onConflictDoNothing()
      .returning();

    if (createdArticle) {
      await db.insert(schema.articleRevisions).values({
        articleId: createdArticle.id,
        versionNumber: 1,
        title: a.title,
        content: a.content,
        changeSummary: "Versi pertama terbit.",
      });
    }
  }
  console.log("✓ Artikel Berita lengkap untuk SEMUA KATEGORI berhasil diseed!");

  // 7. Advertisements
  await db.insert(schema.advertisements).values([
    { title: "Banner Promo Cloud VPS Indonesia", advertiserName: "PT Cloud Hosting Pro", position: "header", status: "active", link: "https://example.com" },
    { title: "Iklan Sidebar Investment App", advertiserName: "Securities App", position: "sidebar", status: "active", link: "https://example.com" },
  ]).onConflictDoNothing();

  // 8. Business Publications
  await db.insert(schema.businessPublications).values([
    { companyName: "PT Inovasi Solusi Digital", contactEmail: "corp@inovasi.co.id", articleTitle: "Peluncuran Platform SaaS Manajemen Usaha 2026", status: "published", amount: 2500000, paymentStatus: "paid" },
  ]).onConflictDoNothing();

  console.log("\n✅ Database seeding selesai 100%! Seluruh Kategori Berita kini terisi konten proporsional.");
  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
