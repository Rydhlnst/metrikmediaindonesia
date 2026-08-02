import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface TopikTerkiniProps {
  topics: { name: string; slug: string }[];
}

export function TopikTerkini({ topics }: TopikTerkiniProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-brand pb-2.5">
        <h2 className="text-[14px] font-bold uppercase tracking-wider">Topik Terkini</h2>
        <Link
          href="/pencarian"
          className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-foreground transition-colors"
        >
          Lihat Semua <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/pencarian?search=${encodeURIComponent(topic.name)}`}
            className="border border-gray-200 px-3.5 py-1.5 text-[12px] font-medium text-gray-600 transition-colors hover:border-brand hover:text-brand hover:bg-amber-50/50"
          >
            #{topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
