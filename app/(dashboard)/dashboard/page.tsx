import { DashboardTopbar } from "@/components/dashboard/topbar";
import { StatGrid } from "@/components/dashboard/stat-card";
import { ViewsChart } from "@/components/dashboard/charts";
import { CategoryBarChart } from "@/components/dashboard/charts";
import { RecentArticlesTable } from "@/components/dashboard/recent-articles-table";
import { RecentCommentsTable } from "@/components/dashboard/recent-comments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryData } from "@/components/dashboard/data";

export default function DashboardPage() {
  return (
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto grid gap-4">
        {/* Stat Cards */}
        <StatGrid />

        {/* Charts Row */}
        <section className="grid gap-3 xl:grid-cols-4">
          <Card className="rounded-none bg-card ring-0 shadow-sm xl:col-span-3">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg font-bold">Views Artikel</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <div className="h-80">
                <ViewsChart />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none bg-card ring-0 shadow-sm">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg font-bold">Per Kategori</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <div className="h-80">
                <CategoryBarChart />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tables Row */}
        <section className="grid gap-3 xl:grid-cols-2">
          <RecentArticlesTable />
          <RecentCommentsTable />
        </section>
      </div>
    </main>
  );
}
