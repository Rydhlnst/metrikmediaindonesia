import { SubmissionDetail } from "@/components/submissions/submission-detail";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default async function DashboardSubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) redirect("/dashboard/submissions");
  return <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]"><DashboardTopbar /><div className="w-full flex-1 p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-4xl"><SubmissionDetail id={id} editorial /></div></div></div>;
}
