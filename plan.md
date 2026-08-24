# PRODUCT REQUIREMENTS DOCUMENT
# METRIK MEDIA INDONESIA

**Project:** Portal Berita & Media Digital  
**Product:** Metrik Media Indonesia  
**Document Type:** Product Requirements Document / Scope of Work  
**Version:** 1.0 Final  
**Platform:** Website & Web Application  
**Project Value:** Rp6.000.000  
**Infrastructure Plan:** 5 Tahun  
**SEO Support:** Opsional Rp1.000.000/bulan

---

# 1. PROJECT OVERVIEW

Metrik Media Indonesia merupakan platform portal berita dan media digital yang digunakan untuk:

1. Mempublikasikan berita dan informasi kepada masyarakat.
2. Mengelola proses penulisan dan penerbitan berita oleh tim redaksi.
3. Mengelola reporter, editor, admin, kontributor, dan pengguna.
4. Menampilkan berita berdasarkan kategori, daerah, topik, tokoh, dan penulis.
5. Menerima kiriman artikel atau materi publikasi dari pengguna.
6. Melakukan verifikasi terhadap setiap kiriman pengguna sebelum diterbitkan.
7. Menampilkan foto, video, dan konten multimedia.
8. Mengelola iklan dan kebutuhan publikasi bisnis.
9. Membantu website dapat ditemukan dan dipahami dengan baik oleh Google.
10. Menyediakan fondasi portal media yang dapat dikembangkan seiring meningkatnya jumlah pembaca.

---

# 2. TUJUAN PRODUK

Website harus dapat melayani tiga kebutuhan utama:

### A. Pembaca

Pembaca dapat menemukan, membaca, mencari, membagikan, dan menyimpan berita dengan mudah.

### B. Redaksi

Tim redaksi dapat menulis, memeriksa, menjadwalkan, menerbitkan, memperbarui, dan mengelola berita melalui Dashboard.

### C. Kontributor / Pengguna

Pengguna terdaftar dapat mengirimkan artikel atau materi publikasi.

Kiriman pengguna **tidak boleh langsung tampil di website**.

Semua kiriman wajib melalui proses:

**Pengguna → Kirim Konten → Menunggu Verifikasi → Review Admin/Redaksi → Approve / Revisi / Reject → Publish**

---

# 3. USER ROLE

Sistem minimal memiliki role berikut.

## 3.1 Guest / Pengunjung

Dapat:

- Membaca berita.
- Melihat kategori.
- Melihat berita daerah.
- Melihat topik.
- Melihat halaman tokoh.
- Melihat profil penulis.
- Melakukan pencarian.
- Melihat foto dan video.
- Membagikan berita.
- Mendaftar akun.

Tidak dapat:

- Mengakses Dashboard.
- Mengirim konten sebelum login.
- Mengelola berita.

---

## 3.2 Registered User / Pembaca

Memiliki seluruh akses Guest serta:

- Login/logout.
- Mengelola profil.
- Menyimpan artikel.
- Melihat artikel tersimpan.
- Mengirim konten.
- Melihat status kiriman.
- Memperbaiki kiriman jika diminta Admin.
- Melihat catatan/revisi dari Admin.

---

## 3.3 Contributor / Reporter

Dapat:

- Membuat artikel.
- Mengedit artikel miliknya.
- Menambahkan gambar.
- Menambahkan kategori.
- Menambahkan tag/topik.
- Mengirim artikel untuk diperiksa.
- Melihat status artikel.
- Melihat catatan Editor/Admin.

Tidak boleh menerbitkan artikel tanpa hak publikasi.

---

## 3.4 Editor

Dapat:

- Melihat artikel reporter/kontributor.
- Memeriksa artikel.
- Mengedit artikel.
- Memberikan catatan.
- Mengembalikan artikel untuk revisi.
- Menyetujui artikel.
- Mengatur kategori/tag/topik.
- Mengelola konten sesuai hak akses.

---

## 3.5 Admin

Memiliki akses pengelolaan sistem, termasuk:

- Artikel.
- Pengguna.
- Kiriman pengguna.
- Kategori.
- Tag.
- Topik.
- Daerah.
- Tokoh/entitas.
- Media.
- Komentar.
- Iklan.
- Statistik.
- Pengaturan website.
- Redirect.
- SEO.
- Role dan hak akses.

---

# 4. PUBLIC WEBSITE

# 4.1 Homepage

Homepage harus memiliki:

### Header

- Logo Metrik Media Indonesia.
- Navigasi utama.
- Daftar kategori.
- Search.
- Login/profile.
- Responsive mobile menu.

### Breaking News

Menampilkan berita penting/terbaru dalam bentuk running news/ticker.

Admin dapat menentukan berita yang memiliki status:

`Breaking News`

### Hero Editorial

Menampilkan berita utama.

Minimal berisi:

- Gambar.
- Kategori.
- Judul.
- Ringkasan.
- Waktu publikasi.

### Latest News

Menampilkan daftar berita terbaru berdasarkan waktu publikasi.

### Trending / Terpopuler

Menampilkan berita berdasarkan jumlah pembaca.

Contoh:

01 Berita A  
02 Berita B  
03 Berita C

### Editor's Choice

Berita yang dipilih secara manual oleh redaksi.

### Category Sections

Homepage dapat menampilkan beberapa blok kategori.

Contoh:

- Nasional
- Politik
- Ekonomi
- Bisnis
- Teknologi
- Internasional
- Lifestyle
- Olahraga
- Daerah

Kategori harus dapat dikelola melalui Dashboard.

### Multimedia

Homepage menyediakan bagian:

- Galeri Foto.
- Video.

### Advertisement

Homepage menyediakan slot banner iklan yang dapat dikelola Admin.

### Load More / Pagination

Daftar berita harus dapat menampilkan berita berikutnya tanpa membuat halaman terlalu berat.

---

# 5. ARTICLE PAGE

URL:

`/[category]/[article-slug]`

atau struktur URL final yang ditentukan saat implementasi.

Halaman berita harus memiliki:

## 5.1 Article Header

- Kategori.
- Judul.
- Subjudul/ringkasan.
- Penulis.
- Tanggal publikasi.
- Jam publikasi.
- Waktu baca.
- Jumlah pembaca.

## 5.2 Hero Image

Menampilkan:

- Gambar utama.
- Caption.
- Credit/source gambar jika tersedia.

## 5.3 Article Content

Mendukung:

- Paragraph.
- Heading.
- Bold.
- Italic.
- Link.
- Quote.
- List.
- Image.
- Caption.
- Video/embed jika digunakan.

## 5.4 Reading Progress

Menampilkan indikator progress membaca.

## 5.5 Social Sharing

Minimal:

- WhatsApp.
- Facebook.
- X/Twitter.
- LinkedIn.
- Copy Link.

## 5.6 Tags

Artikel dapat memiliki beberapa tag.

## 5.7 Author Profile

Menampilkan:

- Nama.
- Foto.
- Jabatan/peran.
- Bio singkat.

Dapat diarahkan menuju halaman penulis.

## 5.8 Related News

Menampilkan artikel yang relevan berdasarkan kategori/tag/topik.

## 5.9 Latest News

Menampilkan artikel terbaru.

## 5.10 Popular News

Menampilkan artikel populer.

## 5.11 Advertisement

Mendukung slot iklan di area artikel.

---

# 6. CATEGORY SYSTEM

URL contoh:

`/category/politik`

Setiap kategori memiliki:

- Nama.
- Slug.
- Deskripsi.
- Gambar jika diperlukan.
- Metadata Google.
- Daftar artikel.

Dashboard harus memungkinkan:

- Create.
- Edit.
- Delete.
- Activate/deactivate.

---

# 7. REGIONAL / LOCATION NEWS

Website harus mendukung pengelompokan berita berdasarkan wilayah.

Contoh:

`/daerah`

`/location/jakarta`

`/location/bandung`

Setiap lokasi dapat memiliki:

- Nama wilayah.
- Slug.
- Deskripsi.
- Daftar berita.

Admin dapat mengelola lokasi melalui Dashboard.

---

# 8. TOPIC / SPECIAL COVERAGE

URL:

`/topic/[slug]`

Digunakan untuk mengelompokkan beberapa berita dalam satu isu.

Contoh:

Pemilu 2029

Topik dapat memiliki:

- Nama.
- Cover.
- Deskripsi.
- Daftar artikel.
- Status aktif/nonaktif.

---

# 9. ENTITY / TOKOH

URL:

`/entity/[slug]`

Digunakan untuk mengelompokkan berita berdasarkan:

- Tokoh.
- Perusahaan.
- Organisasi.
- Institusi.

Entity dapat memiliki:

- Nama.
- Foto.
- Deskripsi.
- Artikel terkait.

---

# 10. AUTHOR PAGE

URL:

`/author/[slug]`

Menampilkan:

- Foto.
- Nama.
- Posisi.
- Bio.
- Social link jika tersedia.
- Jumlah artikel.
- Artikel yang ditulis.

---

# 11. SEARCH

URL:

`/pencarian`

Pengguna dapat mencari berita berdasarkan keyword.

Search result minimal menampilkan:

- Judul.
- Thumbnail.
- Kategori.
- Tanggal.
- Ringkasan.

Filter:

- Kategori.
- Terbaru.
- Terpopuler.

Search harus memiliki empty state ketika tidak ada hasil.

---

# 12. BOOKMARK / SAVED ARTICLES

URL:

`/saved`

Registered User dapat:

- Save artikel.
- Remove artikel.
- Melihat daftar artikel tersimpan.

Jika pengguna belum login, sistem meminta pengguna login terlebih dahulu.

---

# 13. USER PROFILE

URL:

`/profile`

Pengguna dapat melihat/mengelola:

- Nama.
- Email.
- Foto profil.
- Artikel tersimpan.
- Kiriman konten.
- Status kiriman.

---

# 14. USER CONTENT SUBMISSION

Ini merupakan fitur wajib.

Pengguna yang sudah memiliki akun dapat mengirimkan materi kepada Metrik Media Indonesia.

## 14.1 Submission Form

Minimal mendukung:

- Judul.
- Ringkasan.
- Isi.
- Kategori.
- Foto utama.
- Foto tambahan.
- Video/link video jika diperlukan.
- Sumber/referensi jika diperlukan.

## 14.2 Submission Status

Setiap submission memiliki status:

`DRAFT`

`SUBMITTED`

`UNDER_REVIEW`

`REVISION_REQUIRED`

`APPROVED`

`REJECTED`

`PUBLISHED`

---

# 15. CONTENT MODERATION FLOW

Flow wajib:

### Step 1

User membuat submission.

Status:

`DRAFT`

### Step 2

User menekan:

**Kirim untuk Diperiksa**

Status:

`SUBMITTED`

### Step 3

Submission muncul di Dashboard Admin/Redaksi.

### Step 4

Admin membuka submission.

Status dapat berubah:

`UNDER_REVIEW`

### Step 5

Admin memilih salah satu tindakan:

#### Approve

Status:

`APPROVED`

#### Request Revision

Status:

`REVISION_REQUIRED`

Admin wajib dapat memberikan catatan.

#### Reject

Status:

`REJECTED`

Admin dapat memberikan alasan.

### Step 6

Jika revision required:

User dapat memperbaiki submission dan mengirim ulang.

### Step 7

Konten yang disetujui dapat diubah menjadi artikel dan diterbitkan.

Status akhir:

`PUBLISHED`

---

# 16. USER SUBMISSION DASHBOARD

Pengguna harus memiliki halaman:

**Kiriman Saya**

Menampilkan:

| Judul | Tanggal | Status | Action |
|---|---|---|---|
| Artikel A | 18 Aug | Under Review | View |
| Artikel B | 17 Aug | Revision Required | Edit |
| Artikel C | 15 Aug | Published | View |

Pengguna dapat melihat:

- Status.
- Catatan Admin.
- Tanggal pengiriman.
- Tanggal review.
- Link artikel jika sudah diterbitkan.

---

# 17. ADMIN DASHBOARD

URL:

`/dashboard`

Dashboard merupakan pusat pengelolaan website.

---

# 18. DASHBOARD OVERVIEW

Menampilkan ringkasan:

- Total artikel.
- Artikel published.
- Draft.
- Artikel menunggu review.
- Submission pengguna.
- Views.
- Artikel populer.
- Berita terbaru.
- Aktivitas redaksi.

---

# 19. ARTICLE MANAGEMENT

URL:

`/dashboard/articles`

Admin/Redaksi dapat:

- Create.
- Read.
- Edit.
- Delete/archive.
- Preview.
- Publish.
- Unpublish.
- Schedule.

Artikel memiliki:

### Content

- Title.
- Slug.
- Summary.
- Content.
- Featured image.
- Caption.
- Image credit.

### Classification

- Category.
- Tags.
- Topic.
- Location.
- Entity.

### Publishing

- Draft.
- Review.
- Scheduled.
- Published.
- Archived.

### Flags

- Featured.
- Breaking News.
- Editor's Choice.

### SEO

- SEO Title.
- SEO Description.
- Focus Keyword.
- Social image.

---

# 20. EDITORIAL WORKFLOW

URL:

`/dashboard/editorial`

Dashboard dapat menampilkan artikel berdasarkan status:

- Draft.
- Waiting Review.
- Revision.
- Approved.
- Scheduled.
- Published.

Tujuannya agar proses reporter → editor → publikasi dapat dipantau.

---

# 21. USER SUBMISSION MANAGEMENT

URL:

`/dashboard/submissions`

Admin dapat:

- Melihat seluruh submission.
- Filter berdasarkan status.
- Filter berdasarkan tanggal.
- Filter berdasarkan user.
- Membuka submission.
- Preview.
- Memberikan catatan.
- Request revision.
- Approve.
- Reject.
- Publish/convert menjadi artikel.

Admin harus dapat melihat siapa yang mengirim konten.

---

# 22. CATEGORY MANAGEMENT

URL:

`/dashboard/categories`

Fitur:

- Tambah kategori.
- Edit.
- Hapus.
- Slug.
- Description.
- Status.
- SEO metadata.

---

# 23. TAG MANAGEMENT

URL:

`/dashboard/tags`

Fitur:

- Create.
- Edit.
- Delete.
- Slug.
- Artikel terkait.

---

# 24. TOPIC MANAGEMENT

URL:

`/dashboard/topics`

Fitur:

- Create.
- Edit.
- Delete.
- Cover.
- Description.
- Assign article.

---

# 25. LOCATION MANAGEMENT

URL:

`/dashboard/locations`

Fitur:

- Tambah daerah.
- Edit.
- Delete.
- Slug.
- Description.
- Assign article.

---

# 26. ENTITY MANAGEMENT

URL:

`/dashboard/entities`

Fitur:

- Tambah tokoh/organisasi.
- Foto.
- Deskripsi.
- Slug.
- Assign article.

---

# 27. MEDIA LIBRARY

URL:

`/dashboard/media`

Admin dapat:

- Upload image.
- Preview.
- Search.
- Delete.
- Copy URL.
- Melihat informasi file.

Media Library digunakan kembali ketika membuat artikel.

---

# 28. ADVERTISEMENT MANAGEMENT

URL:

`/dashboard/advertisements`

Admin dapat membuat iklan.

Data iklan:

- Nama campaign.
- Advertiser.
- Banner.
- Destination URL.
- Placement.
- Start date.
- End date.
- Status.

Contoh placement:

- Homepage.
- Article Top.
- Article Middle.
- Sidebar.
- Category.

Iklan otomatis berhenti ditampilkan ketika masa campaign berakhir.

---

# 29. COMMENT MANAGEMENT

URL:

`/dashboard/comments`

Jika komentar pembaca diaktifkan, Admin dapat:

- Melihat komentar.
- Approve.
- Reject.
- Delete.
- Mark spam.

---

# 30. USER MANAGEMENT

URL:

`/dashboard/users`

Admin dapat:

- Melihat user.
- Search.
- Melihat profile.
- Mengubah role.
- Activate/deactivate account.

---

# 31. ROLE & ACCESS MANAGEMENT

URL:

`/dashboard/roles`

Role minimal:

- Admin.
- Editor.
- Reporter.
- Contributor.
- User.

Setiap role hanya dapat membuka halaman dan tindakan yang sesuai haknya.

---

# 32. ANALYTICS

URL:

`/dashboard/analytics`

Minimal menampilkan:

- Total views.
- Artikel paling populer.
- Artikel terbaru.
- Performa artikel.
- Traffic source jika data tersedia.
- Perkembangan pembaca.

---

# 33. SEO HEALTH

URL:

`/dashboard/seo-health`

Dashboard membantu mendeteksi masalah dasar seperti:

- Artikel tanpa SEO title.
- Artikel tanpa description.
- Artikel tanpa gambar.
- Artikel tanpa alt text.
- Broken URL jika terdeteksi.
- Halaman yang belum memiliki metadata lengkap.

---

# 34. REDIRECT MANAGER

URL:

`/dashboard/redirects`

Admin dapat membuat pengalihan URL.

Contoh:

`/berita-lama`

→

`/berita-baru`

Digunakan ketika URL artikel berubah agar link lama tidak menjadi halaman error.

---

# 35. WEBSITE SETTINGS

URL:

`/dashboard/settings`

Admin dapat mengatur:

### General

- Website name.
- Logo.
- Favicon.
- Description.

### Contact

- Email.
- WhatsApp.
- Address.

### Social Media

- Facebook.
- Instagram.
- X.
- YouTube.
- LinkedIn.

### Editorial

- Nama perusahaan.
- Informasi redaksi.
- Kontak redaksi.

---

# 36. AUTHENTICATION

Sistem menyediakan:

`/login`

`/signup`

`/forgot-password`

`/reset-password`

`/verify-email`

Fitur:

- Register.
- Login.
- Logout.
- Email verification.
- Forgot password.
- Reset password.
- Session management.

---

# 37. ACCESS PROTECTION

Halaman Dashboard tidak boleh dapat diakses oleh pengguna yang tidak memiliki izin.

Contoh:

User biasa mencoba membuka:

`/dashboard/users`

Sistem harus menolak akses.

---

# 38. SEO FOUNDATION

SEO dasar termasuk dalam pembangunan website Rp6.000.000.

---

# 39. DYNAMIC METADATA

Setiap artikel harus memiliki metadata yang dapat berubah berdasarkan isi artikel.

Minimal:

- Title.
- Description.
- Canonical URL.
- Image.
- Author.
- Published date.
- Modified date.

---

# 40. STRUCTURED ARTICLE INFORMATION

Website harus memberikan informasi terstruktur kepada mesin pencari untuk:

- News Article.
- Article.
- Organization.
- Website.
- Breadcrumb.

---

# 41. SITEMAP

Website menyediakan:

`/sitemap.xml`

Sitemap diperbarui mengikuti konten website.

---

# 42. GOOGLE NEWS SITEMAP

Website menyediakan:

`/news-sitemap.xml`

Digunakan untuk artikel berita terbaru yang memenuhi kebutuhan sitemap berita.

---

# 43. ROBOTS

Website menyediakan:

`/robots.txt`

Halaman internal seperti Dashboard dan halaman akun tertentu tidak perlu dimasukkan ke pencarian Google.

---

# 44. SOCIAL MEDIA PREVIEW

Ketika artikel dibagikan, sistem menampilkan:

- Judul.
- Deskripsi.
- Gambar.
- URL.

Untuk platform seperti:

- WhatsApp.
- Facebook.
- X.
- LinkedIn.

---

# 45. CANONICAL URL

Setiap artikel harus memiliki URL utama agar mesin pencari tidak menganggap halaman sebagai konten duplikat.

---

# 46. ARTICLE SLUG

Artikel memiliki URL yang mudah dibaca.

Contoh:

`/ekonomi/harga-emas-naik-hari-ini`

bukan:

`/article?id=89123`

---

# 47. IMAGE OPTIMIZATION

Gambar berita harus:

- Responsive.
- Tidak stretched.
- Menjaga aspect ratio.
- Dikompresi secara wajar.
- Mendukung alt text.
- Menggunakan ukuran sesuai kebutuhan tampilan.

---

# 48. PERFORMANCE

Website harus memperhatikan:

- Kecepatan homepage.
- Kecepatan article page.
- Optimasi gambar.
- Caching.
- Lazy loading.
- Pengurangan request yang tidak diperlukan.

---

# 49. RESPONSIVE DESIGN

Semua halaman harus dapat digunakan pada:

- Desktop.
- Laptop.
- Tablet.
- Smartphone.

Tidak boleh terdapat horizontal overflow yang mengganggu.

---

# 50. EMPTY STATE

Halaman seperti:

- Search.
- Bookmark.
- Submission.
- Notification.
- Dashboard list.

harus memiliki tampilan ketika belum ada data.

---

# 51. LOADING STATE

Operasi yang membutuhkan waktu harus memiliki indikator loading.

Contoh:

- Login.
- Upload.
- Save article.
- Search.
- Publish.
- Submit content.

---

# 52. ERROR STATE

Sistem harus menangani:

- 404 Page.
- Unauthorized.
- Forbidden.
- Server error.
- Upload gagal.
- Form validation error.

Pesan error harus mudah dipahami pengguna.

---

# 53. CONFIRMATION

Operasi berisiko harus meminta konfirmasi.

Contoh:

- Delete article.
- Reject submission.
- Delete media.
- Delete user.
- Unpublish article.

---

# 54. FORM VALIDATION

Form tidak boleh menerima data penting yang kosong.

Contoh artikel:

- Title required.
- Content required.
- Category required.
- Featured image sesuai kebutuhan publikasi.

Validation error harus ditampilkan dekat field yang bermasalah.

---

# 55. SECURITY

Minimal mencakup:

- HTTPS.
- Firewall.
- Cloudflare.
- Protected Admin routes.
- Role-based access.
- Secure authentication.
- Form validation.
- Upload validation.
- Rate limiting pada bagian yang diperlukan.
- Backup berkala.

---

# 56. FILE UPLOAD SECURITY

Upload pengguna harus dibatasi.

Sistem harus memeriksa:

- Jenis file.
- Ukuran file.
- File extension.
- Format yang diperbolehkan.

File berbahaya tidak boleh dapat dieksekusi melalui website.

---

# 57. BACKUP

Backup minimal mencakup data penting website.

Prioritas:

- Database.
- Data artikel.
- User.
- Submission.
- Pengaturan.

Strategi backup menyesuaikan infrastruktur yang digunakan.

---

# 58. INFRASTRUCTURE

Rencana infrastruktur 5 tahun menggunakan VPS.

Penyedia:

**Contabo**

Server digunakan untuk:

- Website.
- Dashboard.
- Backend.
- Database.
- Layanan pendukung.

---

# 59. SERVER MANAGEMENT

Server menggunakan:

- Linux.
- Docker.
- Docker Compose.
- Coolify.

Tujuannya agar aplikasi lebih mudah:

- Deploy.
- Update.
- Restart.
- Monitor.
- Dipindahkan jika diperlukan.

---

# 60. CLOUDFLARE

Cloudflare digunakan untuk membantu:

- DNS.
- HTTPS.
- CDN.
- Caching.
- Perlindungan dasar.
- Pengelolaan traffic.

---

# 61. DOMAIN

Domain:

`.COM`

Anggaran:

**Rp180.000/tahun**

Estimasi 5 tahun:

**Rp900.000**

---

# 62. INFRASTRUCTURE COST - 5 YEARS

| Komponen | Biaya |
|---|---:|
| Pembuatan Website | Rp6.000.000 |
| Domain .COM 5 Tahun | Rp900.000 |
| Server Website 5 Tahun | Rp7.094.700 |
| Cloudflare | Rp0 |
| Keamanan & Backup 5 Tahun | Rp1.750.000 |
| Setup Google | Rp300.000 |
| **TOTAL** | **Rp16.044.700** |

---

# 63. COST COMPARISON

Perbandingan menggunakan periode yang sama yaitu 5 tahun.

| Komponen | Skema Sebelumnya | Paket Terbaru |
|---|---:|---:|
| Website | Rp6.000.000 | Rp6.000.000 |
| Domain | Rp900.000 | Rp900.000 |
| Server | Rp12.000.000 | Rp7.094.700 |
| Security & Backup | Rp2.500.000 | Rp1.750.000 |
| Setup Google | Rp300.000 | Rp300.000 |
| **TOTAL** | **Rp21.700.000** | **Rp16.044.700** |

### Efisiensi

**Rp5.655.300**

atau sekitar:

**26,1% lebih rendah**

selama periode 5 tahun.

---

# 64. OPTIONAL SEO SUPPORT

SEO bulanan bukan bagian wajib dari pembangunan website.

Harga:

**Rp1.000.000 / bulan**

Layanan dapat mencakup:

- Pemantauan Google.
- Technical SEO.
- On-page SEO.
- Optimasi artikel.
- Pemantauan indexing.
- Pemantauan Search Console.
- Keyword/topic direction.
- Internal linking recommendation.
- SEO health monitoring.
- Monthly report.

SEO tidak menjamin website berada pada posisi #1 Google.

---

# 65. CORPORATE / LEGAL PAGES

Website minimal menyediakan:

- Tentang Kami.
- Tim Redaksi.
- Hubungi Kami.
- Pedoman Media Siber.
- Business Publication.

Jika diperlukan, halaman berikut dapat disediakan:

- Privacy Policy.
- Terms & Conditions.

---

# 66. ACCEPTANCE CRITERIA

Project dianggap memenuhi scope ketika fitur utama berikut berfungsi.

### Public Website

- [ ] Homepage dapat dibuka.
- [ ] Artikel dapat dibaca.
- [ ] Kategori bekerja.
- [ ] Search bekerja.
- [ ] Author page bekerja.
- [ ] Topic page bekerja.
- [ ] Location page bekerja.
- [ ] Entity page bekerja.
- [ ] Galeri/video dapat ditampilkan.
- [ ] Responsive mobile.

### Authentication

- [ ] Register.
- [ ] Login.
- [ ] Logout.
- [ ] Forgot password.
- [ ] Reset password.
- [ ] Email verification.
- [ ] Role protection.

### Article

- [ ] Create.
- [ ] Edit.
- [ ] Draft.
- [ ] Review.
- [ ] Publish.
- [ ] Schedule.
- [ ] Archive.
- [ ] Breaking News.
- [ ] Featured.
- [ ] Editor's Choice.

### User Submission

- [ ] User dapat mengirim konten.
- [ ] Submission tidak otomatis publish.
- [ ] Admin dapat review.
- [ ] Admin dapat approve.
- [ ] Admin dapat reject.
- [ ] Admin dapat meminta revisi.
- [ ] User dapat melihat catatan.
- [ ] User dapat melakukan revisi.
- [ ] Konten approved dapat dipublikasikan.
- [ ] Status submission tercatat.

### Dashboard

- [ ] Article management.
- [ ] Submission management.
- [ ] Category management.
- [ ] Tag management.
- [ ] Topic management.
- [ ] Location management.
- [ ] Entity management.
- [ ] User management.
- [ ] Role management.
- [ ] Media management.
- [ ] Advertisement management.
- [ ] Comment moderation.
- [ ] Analytics.
- [ ] Settings.
- [ ] Redirect management.

### SEO

- [ ] Dynamic metadata.
- [ ] Sitemap.
- [ ] News sitemap.
- [ ] Robots.txt.
- [ ] Canonical.
- [ ] Article structured information.
- [ ] Breadcrumb structured information.
- [ ] Social sharing preview.
- [ ] Search-friendly URLs.

### Infrastructure

- [ ] Production deployment.
- [ ] Domain connected.
- [ ] HTTPS active.
- [ ] Cloudflare configured.
- [ ] Docker deployment.
- [ ] Backup configured.
- [ ] Google Search Console connected.

---

# 67. DEFINITION OF DONE

Sebuah fitur dianggap selesai jika:

1. Tampilan selesai.
2. Fungsi utama berjalan.
3. Data tersimpan dengan benar.
4. Hak akses bekerja.
5. Loading state tersedia.
6. Error state tersedia.
7. Empty state tersedia jika relevan.
8. Form validation bekerja.
9. Responsive.
10. Tidak memiliki error kritis pada flow utama.

Fitur tidak dianggap selesai hanya karena tampilan UI sudah tersedia.

---

# 68. OUT OF SCOPE / ADDITIONAL DEVELOPMENT

Untuk menghindari scope creep, fitur di luar PRD ini dianggap sebagai pengembangan tambahan apabila belum disepakati.

Contoh:

- Mobile App Android/iOS native.
- Sistem langganan berbayar.
- Paywall artikel.
- Marketplace.
- Live streaming infrastructure.
- Sistem payroll reporter.
- Integrasi ERP/accounting.
- Infrastruktur server tambahan.
- Perubahan desain besar setelah approval.
- Migrasi data dalam jumlah besar dari sistem lain.
- Pengembangan fitur baru setelah scope final.

Fitur tambahan dapat dibuat melalui penawaran terpisah.

---

# 69. FINAL PRODUCT FLOW

## Reader

Discover News  
→ Read Article  
→ Explore Related Content  
→ Search / Save / Share  
→ Register

## Contributor

Register  
→ Login  
→ Create Submission  
→ Submit  
→ Admin Review  
→ Revision / Approval  
→ Publication

## Reporter

Login  
→ Create Article  
→ Draft  
→ Submit for Review  
→ Editor Review  
→ Revision / Approval  
→ Schedule / Publish

## Admin / Editor

Login  
→ Dashboard  
→ Review Content  
→ Manage Website  
→ Publish Content  
→ Monitor Performance

---

# 70. FINAL SCOPE SUMMARY

Metrik Media Indonesia bukan hanya website berita sederhana.

Produk yang dibangun mencakup:

**Portal Berita Publik  
+ CMS Redaksi  
+ Editorial Workflow  
+ Contributor Submission System  
+ Admin Verification System  
+ User Account  
+ Media Library  
+ Advertisement Management  
+ Analytics  
+ SEO Foundation  
+ Google News Foundation  
+ Infrastructure Deployment  
+ Security & Backup**

Dengan demikian, website dapat digunakan sebagai platform operasional media digital, bukan hanya sebagai halaman untuk menampilkan artikel.