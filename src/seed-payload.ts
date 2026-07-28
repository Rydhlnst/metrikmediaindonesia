import { getPayload } from "payload";
import config from "../../payload.config";

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
  } catch (e: any) {
    console.log("Admin user might already exist, finding...");
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: "admin@metrikmediaindonesia.id" } },
    });
    admin = existing.docs[0];
    if (!admin) {
      console.error("Failed to create/find admin:", e.message);
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
    try {
      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: cat.slug } },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        categories.push(existing.docs[0]);
        console.log(`Category "${cat.name}" exists, skipping.`);
      } else {
        const created = await payload.create({
          collection: "categories",
          data: cat,
        });
        categories.push(created);
        console.log(`Category "${cat.name}" created.`);
      }
    } catch (e: any) {
      console.error(`Category "${cat.name}" error:`, e.message);
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
    try {
      const existing = await payload.find({
        collection: "tags",
        where: { slug: { equals: tag.slug } },
        limit: 1,
      });
      if (existing.docs.length === 0) {
        await payload.create({ collection: "tags", data: tag });
        console.log(`Tag "${tag.name}" created.`);
      } else {
        console.log(`Tag "${tag.name}" exists, skipping.`);
      }
    } catch (e: any) {
      console.error(`Tag "${tag.name}" error:`, e.message);
    }
  }

  // Create sample articles
  const articleData = [
    {
      title: "Pertumbuhan Ekonomi Digital Indonesia Meningkat Signifikan",
      slug: "pertumbuhan-ekonomi-digital-indonesia",
      excerpt: "Ekonomi digital Indonesia menunjukkan pertumbuhan yang mengesankan di semester pertama 2026, didorong oleh penetrasi internet yang semakin luas.",
      categorySlug: "bisnis",
      isFeatured: true,
      isBreaking: false,
      readingTime: 5,
    },
    {
      title: "Timnas Indonesia Raih Medali Emas di ASEAN Games 2026",
      slug: "timnas-indonesia-raih-medali-emas-asean-games",
      excerpt: "Atlet Indonesia menorehkan prestasi gemilang dengan meraih medali emas pertama di cabang bulu tangkis beregu putra.",
      categorySlug: "olahraga",
      isFeatured: false,
      isBreaking: true,
      readingTime: 4,
    },
    {
      title: "Program Literasi Digital Pemerintah Sasar 10 Juta Pelajar",
      slug: "program-literasi-digital-10-juta-pelajar",
      excerpt: "Kementerian Pendidikan meluncurkan program literasi digital baru yang menyasar 10 juta pelajar di seluruh Indonesia.",
      categorySlug: "pendidikan",
      isFeatured: false,
      isBreaking: false,
      readingTime: 6,
    },
    {
      title: "Festival Budaya Nusantara Hadirkan 34 Provinsi",
      slug: "festival-budaya-nusantara-34-provinsi",
      excerpt: "Festival budaya terbesar di Indonesia kembali digelar dengan menampilkan kekayaan budaya dari 34 provinsi.",
      categorySlug: "sosial-dan-budaya",
      isFeatured: false,
      isBreaking: false,
      readingTime: 5,
    },
    {
      title: "Startup EdTech Indonesia Raih Pendanaan Seri B",
      slug: "startup-edtech-indonesia-pendanaan-seri-b",
      excerpt: "Perusahaan rintisan pendidikan teknologi asal Jakarta berhasil mengumpulkan pendanaan seri B senilai $50 juta.",
      categorySlug: "bisnis",
      isFeatured: false,
      isBreaking: false,
      readingTime: 3,
    },
    {
      title: "Jonatan Christie Juara All England Open 2026",
      slug: "jonatan-christie-juara-all-england-2026",
      excerpt: "Pebulutangkis Indonesia Jonatan Christie berhasil meraih gelar juara All England Open 2026.",
      categorySlug: "olahraga",
      isFeatured: false,
      isBreaking: false,
      readingTime: 4,
    },
    {
      title: "Kurikulum Merdeka 2026 Resmi Diterapkan",
      slug: "kurikulum-merdeka-2026-resmi-diterapkan",
      excerpt: "Kemendikbud resmi menerapkan Kurikulum Merdeka 2026 di seluruh sekolah dasar dan menengah.",
      categorySlug: "pendidikan",
      isFeatured: false,
      isBreaking: false,
      readingTime: 5,
    },
    {
      title: "Upacara Adat Tambi Tetap Lestari",
      slug: "upacara-adt-tambi-tetap-lestari",
      excerpt: "Masyarakat adat di Sulawesi Selatan masih mempertahankan tradisi Tambi yang telah turun-temurun.",
      categorySlug: "sosial-dan-budaya",
      isFeatured: false,
      isBreaking: false,
      readingTime: 6,
    },
  ];

  for (const art of articleData) {
    try {
      const existing = await payload.find({
        collection: "articles",
        where: { slug: { equals: art.slug } },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        console.log(`Article "${art.title}" exists, skipping.`);
        continue;
      }

      const cat = categories.find((c) => c.slug === art.categorySlug);
      if (!cat) {
        console.error(`Category "${art.categorySlug}" not found for article "${art.title}"`);
        continue;
      }

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
                  children: [
                    {
                      type: "text",
                      text: art.excerpt,
                      version: 1,
                    },
                  ],
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
          isFeatured: art.isFeatured,
          isBreaking: art.isBreaking,
        },
      });
      console.log(`Article "${art.title}" created.`);
    } catch (e: any) {
      console.error(`Article "${art.title}" error:`, e.message);
    }
  }

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
