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
      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/pencarian?search=${encodeURIComponent(topic.name)}`}
            className="pill pill-inactive"
          >
            # {topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
