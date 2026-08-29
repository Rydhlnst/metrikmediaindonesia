import Link from "next/link";
import { MediaImage } from "@/components/shared/media-image";
import { Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface EntityProfileArticle {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  publishedAt?: string | Date | null;
  category: { name: string; slug: string };
}

interface EntityProfileProps {
  kicker: string;
  name: string;
  description: string;
  initial: string;
  articles: EntityProfileArticle[];
  listTitle: string;
}

export function EntityProfile({
  kicker,
  name,
  description,
  initial,
  articles,
  listTitle,
}: EntityProfileProps) {
  return (
    <div className="container-editorial py-8 pb-20 md:pb-8 space-y-8">

      {/* Profile Header */}
      <div className="border border-black/10 bg-white p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="flex size-20 shrink-0 items-center justify-center bg-gold text-3xl font-bold text-white">
          {initial.toUpperCase()}
        </div>
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">
            {kicker}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {name}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {/* Article List */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">{listTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item) => (
            <Link
              key={item.id}
              href={`/${item.category.slug}/${item.slug}`}
              className="group flex flex-col border border-black/10 bg-white transition-colors hover:border-gold/50"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <MediaImage
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gold-deep uppercase tracking-wider">
                    {item.category.name}
                  </span>
                  <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug group-hover:text-gold-deep transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-black/5 pt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="size-3.5" />
                    {new Date(item.publishedAt || "1970-01-01").toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-gold-deep text-xs uppercase tracking-wider">
                    Baca <ArrowRight className="size-3" weight="bold" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
