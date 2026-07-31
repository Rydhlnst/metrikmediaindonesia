import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface TopikTerkiniProps {
  topics: { name: string; slug: string }[];
}

export function TopikTerkini({ topics }: TopikTerkiniProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
        <h2 className="text-lg font-semibold">Topik Terkini</h2>
        <Link
          href="/pencarian"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Show all <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/pencarian?search=${encodeURIComponent(topic.name)}`}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
