import { SubmissionDetail } from "@/components/submissions/submission-detail";

export default async function DashboardSubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  return <div className="mx-auto max-w-4xl">{Number.isInteger(id) && id > 0 ? <SubmissionDetail id={id} editorial /> : <p>Invalid submission.</p>}</div>;
}
