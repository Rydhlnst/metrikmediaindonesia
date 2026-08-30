"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { AdminOverview } from "@/components/dashboard/admin-overview";
import { ContributorOverview } from "@/components/dashboard/contributor-overview";
import { useSession } from "@/lib/use-session";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";

export default function DashboardPage() {
  const { user, isLoading } = useSession();
  const isContributor = user?.role === "Kontributor";

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <CircleNotch className="size-8 animate-spin text-[#b8860b]" />
        </div>
      ) : isContributor ? (
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          <ContributorOverview user={user} />
        </div>
      ) : (
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          <AdminOverview />
        </div>
      )}
    </div>
  );
}
