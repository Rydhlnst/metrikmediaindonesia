import { SubmissionDetail } from "@/components/submissions/submission-detail";

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  return <main className="container-editorial max-w-4xl py-8 pb-20">{Number.isInteger(id) && id > 0 ? <SubmissionDetail id={id} /> : <p>Invalid submission.</p>}</main>;
}
