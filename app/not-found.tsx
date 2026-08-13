import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { BrandName } from "@/components/shared/brand-name";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display-lg text-display-lg text-secondary">404</p>
        <h1 className="mt-4 font-headline-xl text-headline-xl text-primary">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider px-8 py-3 hover:bg-secondary hover:text-on-secondary transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <div className="mt-10 border-t border-outline-variant pt-8">
          <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4">
            Jelajahi Kategori
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="border border-outline-variant px-4 py-2 text-sm text-on-surface hover:border-primary hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <BrandName size="sm" className="uppercase" />
        </div>
      </div>
    </div>
  );
}
