import { SubmissionForm } from "@/components/submissions/submission-form";
import { PublicPageHeader } from "@/components/shared/public-page-header";

export default function SubmitPage() {
  return (
    <main className="container-editorial max-w-4xl py-8 pb-20">
      <PublicPageHeader title="Submit Content" description="Send your article, story, photo, or video link for editorial review." />
      <div className="mt-6"><SubmissionForm /></div>
    </main>
  );
}
