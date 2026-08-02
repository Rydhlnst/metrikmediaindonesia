import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";

interface TopikTerkiniProps {
  topics: { name: string; slug: string }[];
}

export function TopikTerkini({ topics }: TopikTerkiniProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div>
      <SectionHeader title="Topik Terkini" href="/pencarian" />
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
