export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  role: string;
  social: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: {
    name: string;
    slug: string;
    color: string;
  };
  author: Author;
  publishedAt: string;
  readingTime: number;
  viewCount: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  tags: string[];
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Ahmad Rizky Pratama",
    slug: "ahmad-rizky-pratama",
    avatar: "",
    bio: "Senior journalist dengan pengalaman 10 tahun liputan bisnis nasional.",
    role: "Chief Editor",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    slug: "siti-nurhaliza",
    avatar: "",
    bio: "Reporter pendidikan, fokus pada perkembangan kurikulum dan inovasi pembelajaran.",
    role: "Senior Reporter",
    social: { twitter: "#", instagram: "#" },
  },
  {
    id: "3",
    name: "Budi Santoso",
    slug: "budi-santoso",
    avatar: "",
    bio: "Jurnalis sosial dan budaya yang passionate mengangkat kearifan lokal Indonesia.",
    role: "Culture Editor",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "4",
    name: "Maya Putri",
    slug: "maya-putri",
    avatar: "",
    bio: "Penulis berita sosial dan budaya dengan gaya yang fresh dan engaging.",
    role: "Social Editor",
    social: { twitter: "#", instagram: "#" },
  },
  {
    id: "5",
    name: "Reza Firmansyah",
    slug: "reza-firmansyah",
    avatar: "",
    bio: "Jurnalis olahraga yang meliput berbagai event olahraga internasional.",
    role: "Sports Reporter",
    social: { twitter: "#" },
  },
];

export const articles: Article[] = [
  {
    id: "1",
    title: "Indonesia Luncurkan Program Transformasi Digital Nasional 2026-2030",
    slug: "indonesia-luncurkan-program-transformasi-digital-nasional-2026-2030",
    excerpt:
      "Pemerintah resmi meluncurkan program transformasi digital yang mencakup pembangunan infrastruktur broadband di seluruh Indonesia dengan target kecepatan internet merata hingga ke daerah terpencil.",
    content: "",
    thumbnail: "https://picsum.photos/seed/digital-transform/800/450",
    category: { name: "Bisnis", slug: "bisnis", color: "#2563EB" },
    author: authors[0],
    publishedAt: "2026-07-25T08:00:00Z",
    readingTime: 5,
    viewCount: 15420,
    isFeatured: true,
    isBreaking: true,
    tags: ["bisnis", "digital", "pemerintah", "infrastruktur"],
  },
  {
    id: "2",
    title: "Pasar Saham Indonesia Catat Rekor Tertinggi Sepanjang Sejarah",
    slug: "pasar-saham-indonesia-catat-rekor-tertinggi-sepanjang-sejarah",
    excerpt:
      "Indeks Harga Saham Gabungan (IHSG) menembus level 8.000 untuk pertama kalinya didorong aliran masuk investasi asing dan optimisme ekonomi domestik.",
    content: "",
    thumbnail: "https://picsum.photos/seed/stock-market/800/450",
    category: { name: "Bisnis", slug: "bisnis", color: "#2563EB" },
    author: authors[0],
    publishedAt: "2026-07-25T07:30:00Z",
    readingTime: 4,
    viewCount: 12300,
    isFeatured: true,
    tags: ["bisnis", "saham", "ihsg", "investasi"],
  },
  {
    id: "3",
    title: "Timnas Indonesia Tampil Gemilang di Piala Dunia U-20",
    slug: "timnas-indonesia-tampil-gemilang-di-piala-dunia-u-20",
    excerpt:
      "Garuda Muda berhasil mengalahkan Brazil 2-1 dalam laga dramatis yang penuh semangat, menjadikan Indonesia sebagai tim Asia pertama yang mengalahkan Brazil di Piala Dunia U-20.",
    content: "",
    thumbnail: "https://picsum.photos/seed/football-worldcup/800/450",
    category: { name: "Olahraga", slug: "olahraga", color: "#059669" },
    author: authors[4],
    publishedAt: "2026-07-25T06:00:00Z",
    readingTime: 6,
    viewCount: 28500,
    isFeatured: true,
    isBreaking: true,
    tags: ["olahraga", "sepak bola", "timnas", "piala dunia"],
  },
  {
    id: "4",
    title: "Kurikulum Merdeka 2026 Resmi Diterapkan di Seluruh Indonesia",
    slug: "kurikulum-merdeka-2026-resmi-diterapkan",
    excerpt:
      "Kementerian Pendidikan dan Kebudayaan resmi menerapkan Kurikulum Merdeka 2026 di seluruh sekolah dasar dan menengah dengan fokus pada kemampuan berpikir kritis.",
    content: "",
    thumbnail: "https://picsum.photos/seed/school-classroom/800/450",
    category: { name: "Pendidikan", slug: "pendidikan", color: "#7C3AED" },
    author: authors[1],
    publishedAt: "2026-07-25T05:00:00Z",
    readingTime: 7,
    viewCount: 9800,
    isFeatured: true,
    tags: ["pendidikan", "kurikulum", "sekolah", "merdeka"],
  },
  {
    id: "5",
    title: "Festival Budaya Nusantara 2026 Hadirkan 34 Provinsi",
    slug: "festival-budaya-nusantara-2026",
    excerpt:
      "Festival budaya terbesar di Indonesia kembali digelar dengan menampilkan kekayaan budaya dari 34 provinsi, dari tarian tradisional hingga pameran kerajinan tangan.",
    content: "",
    thumbnail: "https://picsum.photos/seed/culture-festival/800/450",
    category: { name: "Sosial & Budaya", slug: "sosial-dan-budaya", color: "#D97706" },
    author: authors[2],
    publishedAt: "2026-07-24T20:00:00Z",
    readingTime: 4,
    viewCount: 18200,
    tags: ["budaya", "festival", "nusantara", "tradisi"],
  },
  {
    id: "6",
    title: "Startup AI Indonesia Sukses Raih Pendanaan Seri C Senilai $120 Juta",
    slug: "startup-ai-indonesia-sukses-raih-pendanaan-seri-c",
    excerpt:
      "Perusahaan rintisan kecerdasan buatan asal Jakarta berhasil mengumpulkan pendanaan seri C terbesar di Asia Tenggara tahun ini.",
    content: "",
    thumbnail: "https://picsum.photos/seed/ai-startup/800/450",
    category: { name: "Bisnis", slug: "bisnis", color: "#2563EB" },
    author: authors[0],
    publishedAt: "2026-07-24T15:00:00Z",
    readingTime: 4,
    viewCount: 11200,
    tags: ["bisnis", "startup", "ai", "pendanaan"],
  },
  {
    id: "7",
    title: "Program Literasi Digital Pemerintah Sasar 10 Juta Pelajar",
    slug: "program-literasi-digital-pemerintah-sasar-10-juta-pelajar",
    excerpt:
      "Kementerian Pendidikan meluncurkan program literasi digital baru yang menyasar 10 juta pelajar di seluruh Indonesia untuk meningkatkan kemampuan teknologi informasi.",
    content: "",
    thumbnail: "https://picsum.photos/seed/students-tablet/800/450",
    category: { name: "Pendidikan", slug: "pendidikan", color: "#7C3AED" },
    author: authors[1],
    publishedAt: "2026-07-24T12:00:00Z",
    readingTime: 5,
    viewCount: 8400,
    tags: ["pendidikan", "literasi", "digital", "pelajar"],
  },
  {
    id: "8",
    title: "Persebaya Surabaya Resmi Rekrut Striker Asal Brazil",
    slug: "persebaya-resmi-rekrut-striker-asal-brazil",
    excerpt:
      "Klub sepak bola Persebaya Surabaya resmi menandatangani kontrak dengan striker asal Brazil, Carlos Silva, untuk mengarungi kompetisi Liga 1 musim depan.",
    content: "",
    thumbnail: "https://picsum.photos/seed/soccer-stadium/800/450",
    category: { name: "Olahraga", slug: "olahraga", color: "#059669" },
    author: authors[4],
    publishedAt: "2026-07-24T08:00:00Z",
    readingTime: 3,
    viewCount: 15600,
    tags: ["olahraga", "sepak bola", "liga 1", "persebaya"],
  },
  {
    id: "9",
    title: "Upacara Adat Tambi Tetap Lestari di Tengah Modernisasi",
    slug: "upacara-adt-tambi-tetap-lestari",
    excerpt:
      "Masyarakat adat di Sulawesi Selatan masih mempertahankan tradisi Tambi yang telah turun-temurun sebagai bentuk penghormatan terhadap leluhur.",
    content: "",
    thumbnail: "https://picsum.photos/seed/traditional-ceremony/800/450",
    category: { name: "Sosial & Budaya", slug: "sosial-dan-budaya", color: "#D97706" },
    author: authors[2],
    publishedAt: "2026-07-24T10:00:00Z",
    readingTime: 6,
    viewCount: 22100,
    tags: ["budaya", "adat", "tradisi", "sulawesi"],
  },
  {
    id: "10",
    title: "Asian Games 2026: Indonesia Targetkan 30 Emas",
    slug: "asian-games-2026-indonesia-targetkan-30-emas",
    excerpt:
      "KONI menargetkan Indonesia meraih minimal 30 medali emas di Asian Games 2026 yang akan digelar di Jepang, naik dari target sebelumnya.",
    content: "",
    thumbnail: "https://picsum.photos/seed/olympic-medals/800/450",
    category: { name: "Olahraga", slug: "olahraga", color: "#059669" },
    author: authors[4],
    publishedAt: "2026-07-23T18:00:00Z",
    readingTime: 4,
    viewCount: 11800,
    tags: ["olahraga", "asian games", "medali", "target"],
  },
  {
    id: "11",
    title: "Bank Indonesia Tahan Suku Bunga Acuan di Level 6%",
    slug: "bi-tahan-suku-bunga-acuan",
    excerpt:
      "Bank Indonesia memutuskan untuk menahan suku bunga acuan di level 6% guna menjaga stabilitas ekonomi dan mendukung pemulihan pasca pandemi.",
    content: "",
    thumbnail: "https://picsum.photos/seed/bank-central/800/450",
    category: { name: "Bisnis", slug: "bisnis", color: "#2563EB" },
    author: authors[0],
    publishedAt: "2026-07-23T10:00:00Z",
    readingTime: 3,
    viewCount: 6200,
    tags: ["bisnis", "bi", "suku bunga", "ekonomi"],
  },
  {
    id: "12",
    title: "Mahasiswa Indonesia Raih Juara Olimpiade Sains Internasional",
    slug: "mahasiswa-indonesia-raih-juara-olimpiade-sains",
    excerpt:
      "Tim mahasiswa Indonesia berhasil meraih medali emas dalam Olimpiade Sains Internasional di Tokyo, mengalahkan 50 negara peserta.",
    content: "",
    thumbnail: "https://picsum.photos/seed/science-olympiad/800/450",
    category: { name: "Pendidikan", slug: "pendidikan", color: "#7C3AED" },
    author: authors[1],
    publishedAt: "2026-07-23T08:00:00Z",
    readingTime: 5,
    viewCount: 14300,
    tags: ["pendidikan", "olimpiade", "sains", "internasional"],
  },
  {
    id: "13",
    title: "Komunitas Adat Kenegerian Rantau Kembali Adakan Ritual Adat",
    slug: "komunitas-adat-kenegerian-rantau-ritual-adat",
    excerpt:
      "Komunitas adat Kenegerian Rantau di Sumatera Barat kembali menggelar ritual adat tahunan yang diikuti oleh ribuan masyarakat dari berbagai daerah.",
    content: "",
    thumbnail: "https://picsum.photos/seed/village-ritual/800/450",
    category: { name: "Sosial & Budaya", slug: "sosial-dan-budaya", color: "#D97706" },
    author: authors[2],
    publishedAt: "2026-07-22T15:00:00Z",
    readingTime: 3,
    viewCount: 21500,
    tags: ["budaya", "adat", "sumatera barat", "ritual"],
  },
  {
    id: "14",
    title: "Jonatan Christie Juara All England Open 2026",
    slug: "jonatan-christie-juara-all-england-2026",
    excerpt:
      "Pebulutangkis Indonesia Jonatan Christie berhasil meraih gelar juara All England Open 2026 setelah mengalahkan lawannya di babak final.",
    content: "",
    thumbnail: "https://picsum.photos/seed/badminton-champion/800/450",
    category: { name: "Olahraga", slug: "olahraga", color: "#059669" },
    author: authors[4],
    publishedAt: "2026-07-22T18:00:00Z",
    readingTime: 4,
    viewCount: 19800,
    tags: ["olahraga", "bulu tangkis", "all england", "jonatan"],
  },
  {
    id: "15",
    title: "Pemerintah Luncurkan Program Beasiswa Pendidikan Tinggi 2026",
    slug: "pemerintah-luncurkan-program-beasiswa-2026",
    excerpt:
      "Kementerian Pendidikan dan Kebudayaan resmi meluncurkan program beasiswa pendidikan tinggi bagi mahasiswa berprestasi dari keluarga kurang mampu.",
    content: "",
    thumbnail: "https://picsum.photos/seed/university-campus/800/450",
    category: { name: "Pendidikan", slug: "pendidikan", color: "#7C3AED" },
    author: authors[1],
    publishedAt: "2026-07-22T12:00:00Z",
    readingTime: 5,
    viewCount: 4200,
    tags: ["pendidikan", "beasiswa", "kuliah", "pemerintah"],
  },
];

export const trendingArticles = articles
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, 5);

export const breakingArticles = articles.filter((a) => a.isBreaking);

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.category.slug === categorySlug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(article: Article, limit = 4): Article[] {
  return articles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category.slug === article.category.slug ||
          a.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, limit);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return articles.filter((a) => a.author.slug === authorSlug);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}
