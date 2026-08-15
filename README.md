# Metrik Media Indonesia 🚀

Portal Media & Berita Modern berbasis **Next.js 16 (App Router)**, **PostgreSQL**, **Drizzle ORM**, **MinIO (Self-hosted S3 Object Storage)**, **Redis Cache**, dan **Caddy Reverse Proxy (Auto Let's Encrypt SSL)**.

Proyek ini dirancang agar **100% Self-Hosted** menggunakan **Docker Compose**, sehingga Anda **hanya perlu membayar 1 server VPS saja** tanpa biaya langganan cloud terpisah untuk Database, Storage, atau CDN.

---

## 🏛️ Arsitektur All-in-One Single Server

```text
[ Browser Pengunjung ]
        │
        ▼ (HTTPS :443 / HTTP :80)
┌─────────────────────────────────────────────────────────────┐
│                       Caddy Reverse Proxy                   │
│               (Automatic SSL by Let's Encrypt)              │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼ (/ /api /admin ...)           ▼ (/storage/*)
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Next.js Web App         │ │     MinIO Object Storage   │
│      (Container :3000)       │ │     (Container :9000)      │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               │                               │
       ┌───────┴───────────────┐               │
       ▼                       ▼               ▼
┌──────────────┐        ┌──────────────┐ ┌────────────────────┐
│  PostgreSQL  │        │  Redis Cache │ │   MinIO Volume     │
│  (Data DB)   │        │  (In-Memory) │ │  (Uploads/Media)   │
└──────────────┘        └──────────────┘ └────────────────────┘
```

---

## 🛠️ Layanan dalam Docker Compose

1. **`app`**: Web Application Next.js 16 (Standalone Alpine Runner).
2. **`postgres`**: Database relasional PostgreSQL 16 Alpine.
3. **`minio`**: Self-hosted S3-compatible Object Storage untuk gambar dan media.
4. **`minio-init`**: Helper container otomatis untuk membuat bucket & menyetel public read access.
5. **`redis`**: In-Memory cache & fast key-value store.
6. **`caddy`**: Web server & Reverse proxy dengan Auto-SSL Let's Encrypt gratis.
7. **`pgadmin`** *(opsional)*: GUI manajemen PostgreSQL (profil: `tools`).

---

## 🚀 Panduan Deployment di Server VPS

### 1. Prasyarat Server
- Server VPS (Ubuntu / Debian / AlmaLinux).
- Domain sudah diarahkan A Record ke IP Server Anda (misal `metrikmediaindonesia.id`).
- Telah terinstall **Docker** dan **Docker Compose** (`docker compose version`).

### 2. Langkah Setup & Deploy

```bash
# 1. Clone repositori ke server
git clone <URL_REPO_ANDA> /var/www/metrikmedia
cd /var/www/metrikmedia

# 2. Salin template konfigurasi environment
cp .env.docker .env

# 3. Sesuaikan variabel di .env (Domain, Password, Secret)
nano .env

# 4. Jalankan deployment otomatis
chmod +x deploy.sh
./deploy.sh
```

Atau jalankan manual dengan Docker Compose:
```bash
# Build dan jalankan seluruh container di background
docker compose up -d --build
```

---

## 💻 Panduan Local Development

Jika ingin menjalankan aplikasi secara lokal dengan Next.js dev server (`pnpm dev`) sementara DB dan MinIO berjalan di Docker:

```bash
# 1. Jalankan Database, MinIO, dan Redis saja
docker compose -f docker-compose.dev.yml up -d

# 2. Salin file environment lokal
cp .env.example .env.local

# 3. Jalankan migrasi database
pnpm db:migrate

# 4. Jalankan seed data awal / admin
pnpm db:seed

# 5. Jalankan server Next.js lokal
pnpm dev
```

Buka:
- Aplikasi Web: [http://localhost:3000](http://localhost:3000)
- MinIO Console: [http://localhost:9001](http://localhost:9001) (User: `minioadmin`, Pass: `minioadmin`)

---

## 🗄️ Database & Utility Commands

```bash
# Menjalankan migrasi Drizzle
pnpm db:migrate

# Membuka Drizzle Studio (Database GUI lokal)
pnpm db:studio

# Seed admin awal
pnpm db:seed-admin
```

---

## 🔒 Konfigurasi Domain & SSL

Caddyfile sudah dikonfigurasi untuk menangani sertifikat SSL otomatis. Cukup ubah `DOMAIN` di file `.env`:
```env
DOMAIN=metrikmediaindonesia.id
NEXT_PUBLIC_APP_URL=https://metrikmediaindonesia.id
MINIO_PUBLIC_URL=https://metrikmediaindonesia.id/storage
```

---

## 📊 Manajemen Container & Logs

```bash
# Cek status container
docker compose ps

# Cek logs real-time
docker compose logs -f

# Restart layanan tertentu
docker compose restart app

# Menghentikan seluruh container
docker compose down
```
