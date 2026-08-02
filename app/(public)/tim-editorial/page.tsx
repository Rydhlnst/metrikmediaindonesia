import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE_CONFIG } from "@/lib/constants";
import { authors } from "@/lib/mock-data";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import {
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Tim Editorial",
  description: `Mengenal tim editorial ${SITE_CONFIG.name} yang berdedikasi menyajikan berita berkualitas.`,
};

const socialIcons: Record<string, React.ComponentType<Record<string, unknown>>> = {
  twitter: TwitterLogo,
  instagram: InstagramLogo,
  linkedin: LinkedinLogo,
};

export default function EditorialTeamPage() {
  return (
    <div className="py-6">
      <Breadcrumb items={[{ label: "Tim Editorial" }]} />

      <div className="mt-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tim Editorial</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Bertemu dengan para jurnalis dan editor yang berdedikasi di balik setiap
          berita yang kami terbitkan.
        </p>
      </div>

      {/* Leadership */}
      <div className="mt-12">
        <h2 className="text-xl font-bold">Kepemimpinan</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {authors.slice(0, 3).map((author) => (
            <div key={author.id} className="border border-border p-6">
              <div className="flex items-center gap-4">
                <AvatarAuthor name={author.name} size="lg" />
                <div>
                  <h3 className="font-bold">{author.name}</h3>
                  <p className="text-xs text-brand-text">{author.role}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {author.bio}
              </p>
              <div className="mt-4 flex gap-2">
                {Object.entries(author.social).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-3.5" weight="fill" />
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
        <h2 className="text-xl font-bold">Tim Lainnya</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {authors.slice(3).map((author) => (
            <div key={author.id} className="border border-border p-6">
              <div className="flex items-center gap-4">
                <AvatarAuthor name={author.name} size="lg" />
                <div>
                  <h3 className="font-bold">{author.name}</h3>
                  <p className="text-xs text-brand-text">{author.role}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {author.bio}
              </p>
              <div className="mt-4 flex gap-2">
                {Object.entries(author.social).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-3.5" weight="fill" />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join CTA */}
      <div className="mt-16 border border-border bg-muted/50 p-8 text-center">
        <h2 className="text-xl font-bold">Bergabung dengan Kami</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Kami selalu mencari jurnalis berbakat yang bersemangat menyajikan berita berkualitas.
        </p>
        <Link
          href="/hubungi-kami"
          className="mt-4 inline-flex items-center gap-2 bg-brand px-6 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-amber-400"
        >
          Lihat Lowongan
        </Link>
      </div>
    </div>
  );
}
