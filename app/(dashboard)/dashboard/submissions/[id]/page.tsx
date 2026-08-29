import { SubmissionDetail } from "@/components/submissions/submission-detail";
import { redirect } from "next/navigation";

export default async function DashboardSubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) redirect("/dashboard/submissions");
  return <div className="mx-auto max-w-4xl"><SubmissionDetail id={id} editorial /></div>;
}
