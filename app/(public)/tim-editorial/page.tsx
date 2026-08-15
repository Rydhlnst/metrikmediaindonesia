import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SITE_CONFIG } from "@/lib/constants";
import { getAuthors } from "@/lib/queries";
import { AvatarAuthor } from "@/components/shared/avatar-author";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tim Editorial",
  description: `Mengenal tim editorial ${SITE_CONFIG.name} yang berdedikasi menyajikan berita berkualitas.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/tim-editorial`,
  },
  openGraph: {
    title: `Tim Editorial | ${SITE_CONFIG.name}`,
    description: `Mengenal tim editorial ${SITE_CONFIG.name} yang berdedikasi menyajikan berita berkualitas.`,
  },
};

export default async function EditorialTeamPage() {
  let authors: Awaited<ReturnType<typeof getAuthors>> = [];
  try {
    authors = await getAuthors();
  } catch {
    authors = [];
  }
  const leadership = authors.slice(0, 3);
  const team = authors.slice(3);
  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <Breadcrumb items={[{ label: "Tim Editorial" }]} />

      <PublicPageHeader
        className="mt-6"
        title="Tim Editorial"
        description="Bertemu dengan para jurnalis dan editor yang berdedikasi di balik setiap berita yang kami terbitkan."
      />

      {/* Leadership */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Kepemimpinan</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((author) => (
            <div key={author.id} className="border border-black/10 bg-white p-6">
              <div className="flex items-center gap-4">
                <AvatarAuthor name={author.name} size="lg" />
                <div>
                  <h3 className="font-bold text-foreground">{author.name}</h3>
                  <p className="text-xs text-gold-deep">{author.role}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{author.bio}</p>
              <div className="mt-4 flex gap-2">
                {author.social && Object.entries(author.social).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex size-7 items-center justify-center border border-black/10 text-muted-foreground transition-colors hover:border-gold hover:text-gold-deep">
                      {platform[0].toUpperCase()}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Team */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Tim Lainnya</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((author) => (
            <div key={author.id} className="border border-black/10 bg-white p-6">
              <div className="flex items-center gap-4">
                <AvatarAuthor name={author.name} size="lg" />
                <div>
                  <h3 className="font-bold text-foreground">{author.name}</h3>
                  <p className="text-xs text-gold-deep">{author.role}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{author.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join CTA */}
      <div className="mt-16 border border-black/10 bg-surface-container-low p-8 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Bergabung dengan Kami</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Kami selalu mencari jurnalis berbakat yang bersemangat menyajikan berita berkualitas.
        </p>
        <Link href="/hubungi-kami"
          className="mt-4 inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-black/90">
          Lihat Lowongan
        </Link>
      </div>
    </div>
  );
}
