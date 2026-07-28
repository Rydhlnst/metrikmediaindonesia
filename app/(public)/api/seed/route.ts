import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST() {
  try {
    const payload = await getPayload({ config });
    const results: string[] = [];

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
      results.push(`Admin user created: ${admin.email}`);
    } catch {
      const existing = await payload.find({
        collection: "users",
        where: { email: { equals: "admin@metrikmediaindonesia.id" } },
        limit: 1,
      });
      admin = existing.docs[0];
      results.push(`Admin user exists: ${admin.email}`);
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
        results.push(`Category "${cat.name}" exists`);
      } else {
        const created = await payload.create({ collection: "categories", data: cat });
        categories.push(created);
        results.push(`Category "${cat.name}" created`);
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
        results.push(`Tag "${tag.name}" created`);
      } else {
        results.push(`Tag "${tag.name}" exists`);
      }
    }

    // Create articles
    const articleData = [
      { title: "Pertumbuhan Ekonomi Digital Indonesia Meningkat Signifikan", slug: "pertumbuhan-ekonomi-digital-indonesia", excerpt: "Ekonomi digital Indonesia menunjukkan pertumbuhan yang mengesankan di semester pertama 2026, didorong oleh penetrasi internet yang semakin luas.", catSlug: "bisnis", isFeatured: true, readingTime: 5 },
      { title: "Timnas Indonesia Raih Medali Emas di ASEAN Games 2026", slug: "timnas-indonesia-raih-medali-emas-asean-games", excerpt: "Atlet Indonesia menorehkan prestasi gemilang dengan meraih medali emas pertama di cabang bulu tangkis beregu putra.", catSlug: "olahraga", isFeatured: false, readingTime: 4, isBreaking: true },
      { title: "Program Literasi Digital Pemerintah Sasar 10 Juta Pelajar", slug: "program-literasi-digital-10-juta-pelajar", excerpt: "Kementerian Pendidikan meluncurkan program literasi digital baru yang menyasar 10 juta pelajar di seluruh Indonesia.", catSlug: "pendidikan", isFeatured: false, readingTime: 6 },
      { title: "Festival Budaya Nusantara Hadirkan 34 Provinsi", slug: "festival-budaya-nusantara-34-provinsi", excerpt: "Festival budaya terbesar di Indonesia kembali digelar dengan menampilkan kekayaan budaya dari 34 provinsi.", catSlug: "sosial-dan-budaya", isFeatured: false, readingTime: 5 },
      { title: "Startup EdTech Indonesia Raih Pendanaan Seri B", slug: "startup-edtech-indonesia-pendanaan-seri-b", excerpt: "Perusahaan rintisan pendidikan teknologi asal Jakarta berhasil mengumpulkan pendanaan seri B senilai $50 juta.", catSlug: "bisnis", isFeatured: false, readingTime: 3 },
      { title: "Jonatan Christie Juara All England Open 2026", slug: "jonatan-christie-juara-all-england-2026", excerpt: "Pebulutangkis Indonesia Jonatan Christie berhasil meraih gelar juara All England Open 2026.", catSlug: "olahraga", isFeatured: false, readingTime: 4 },
      { title: "Kurikulum Merdeka 2026 Resmi Diterapkan", slug: "kurikulum-merdeka-2026-resmi-diterapkan", excerpt: "Kemendikbud resmi menerapkan Kurikulum Merdeka 2026 di seluruh sekolah dasar dan menengah.", catSlug: "pendidikan", isFeatured: false, readingTime: 5 },
      { title: "Upacara Adat Tambi Tetap Lestari di Tengah Modernisasi", slug: "upacara-adt-tambi-tetap-lestari", excerpt: "Masyarakat adat di Sulawesi Selatan masih mempertahankan tradisi Tambi yang telah turun-temurun.", catSlug: "sosial-dan-budaya", isFeatured: false, readingTime: 6 },
    ];

    for (const art of articleData) {
      const existing = await payload.find({
        collection: "articles",
        where: { slug: { equals: art.slug } },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        results.push(`Article "${art.title}" exists`);
        continue;
      }

      const cat = categories.find((c) => c.slug === art.catSlug);
      if (!cat) continue;

      await payload.create({
        collection: "articles",
        data: {
          title: art.title,
          slug: art.slug,
          excerpt: art.excerpt,
          content: {
            root: {
              type: "root",
              children: [{ type: "paragraph", children: [{ type: "text", text: art.excerpt, version: 1 }], version: 1 }],
              direction: null, format: "", indent: 0, version: 1,
            },
          },
          category: cat.id,
          author: admin.id,
          status: "published",
          readingTime: art.readingTime,
          publishedAt: new Date().toISOString(),
          isFeatured: art.isFeatured || false,
          isBreaking: (art as any).isBreaking || false,
        },
      });
      results.push(`Article "${art.title}" created`);
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
