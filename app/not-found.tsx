import Link from "next/link";
import { ArrowLeft, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 text-gold-deep text-[11px] font-bold uppercase tracking-widest">
          Error 404
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-tight">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan. Silakan kembali ke beranda atau cari topik berita yang relevan.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-none transition-colors hover:bg-black/90"
          >
            <ArrowLeft className="size-4" weight="bold" />
            Kembali ke Beranda
          </Link>

          <Link
            href="/pencarian"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-black/15 bg-white text-foreground px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-none transition-colors hover:border-gold hover:text-gold-deep"
          >
            <MagnifyingGlass className="size-4" weight="bold" />
            Cari Berita
          </Link>
        </div>
      </div>
    </div>
  );
}
