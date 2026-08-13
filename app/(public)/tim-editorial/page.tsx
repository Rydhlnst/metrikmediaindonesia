import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
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

      <div className="mt-8 max-w-3xl">
        <h1 className="font-headline-xl text-headline-xl text-primary">Tim Editorial</h1>
        <p className="mt-4 font-body-xl text-body-xl text-on-surface-variant">
          Bertemu dengan para jurnalis dan editor yang berdedikasi di balik setiap
          berita yang kami terbitkan.
        </p>
      </div>

      {/* Leadership */}
      <div className="mt-12">
        <h2 className="font-headline-lg text-headline-lg text-primary">Kepemimpinan</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((author) => (
            <div key={author.id} className="border border-outline-variant p-6">
              <div className="flex items-center gap-4">
                <AvatarAuthor name={author.name} size="lg" />
                <div>
                  <h3 className="font-bold text-on-surface">{author.name}</h3>
                  <p className="text-xs text-secondary">{author.role}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">{author.bio}</p>
              <div className="mt-4 flex gap-2">
                {author.social && Object.entries(author.social).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex size-7 items-center justify-center border border-outline-variant text-on-surface-variant transition-colors hover:text-primary">
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
        <h2 className="font-headline-lg text-headline-lg text-primary">Tim Lainnya</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((author) => (
            <div key={author.id} className="border border-outline-variant p-6">
              <div className="flex items-center gap-4">
                <AvatarAuthor name={author.name} size="lg" />
                <div>
                  <h3 className="font-bold text-on-surface">{author.name}</h3>
                  <p className="text-xs text-secondary">{author.role}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">{author.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join CTA */}
      <div className="mt-16 border border-outline-variant bg-surface-container-low p-8 text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary">Bergabung dengan Kami</h2>
        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
          Kami selalu mencari jurnalis berbakat yang bersemangat menyajikan berita berkualitas.
        </p>
        <Link href="/hubungi-kami"
          className="mt-4 inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-on-secondary">
          Lihat Lowongan
        </Link>
      </div>
    </div>
  );
}
