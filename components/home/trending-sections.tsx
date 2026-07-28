import Link from "next/link";
import { TrendUp, TrendDown, ChartLineUp, Trophy, GraduationCap, Buildings } from "@phosphor-icons/react/dist/ssr";

const sections = [
  { name: "Bisnis", slug: "bisnis", views: 60250, trend: "up" as const, icon: ChartLineUp },
  { name: "Olahraga", slug: "olahraga", views: 45000, trend: "down" as const, icon: Trophy },
  { name: "Pendidikan", slug: "pendidikan", views: 24500, trend: "up" as const, icon: GraduationCap },
  { name: "Sosial & Budaya", slug: "sosial-dan-budaya", views: 18200, trend: "up" as const, icon: Buildings },
];

export function TrendingSections() {
  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
        <h2 className="text-lg font-semibold">Trending Sections</h2>
      </div>
      <div className="mt-4 space-y-1">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={`/${section.slug}`}
            className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <section.icon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                {section.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {section.views.toLocaleString()} Views
              </span>
              {section.trend === "up" ? (
                <TrendUp className="size-4 text-green-500" />
              ) : (
                <TrendDown className="size-4 text-red-500" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
