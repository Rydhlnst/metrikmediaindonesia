export type ArticleStatus =
  | "draft"
  | "submitted"
  | "editorial_review"
  | "approved"
  | "scheduled"
  | "published"
  | "revision_required"
  | "rejected"
  | "archived";

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "revision_required"
  | "approved"
  | "rejected"
  | "published";

const ARTICLE_TRANSITIONS: Record<ArticleStatus, ArticleStatus[]> = {
  draft: ["submitted", "editorial_review", "approved", "scheduled", "published", "archived"],
  submitted: ["editorial_review", "revision_required", "rejected", "archived"],
  editorial_review: ["approved", "revision_required", "rejected", "archived"],
  approved: ["scheduled", "published", "rejected", "archived"],
  scheduled: ["published", "approved", "archived"],
  published: ["archived"],
  revision_required: ["draft", "submitted", "rejected", "archived"],
  rejected: ["draft", "submitted", "archived"],
  archived: ["draft", "published"],
};

const SUBMISSION_TRANSITIONS: Record<SubmissionStatus, SubmissionStatus[]> = {
  draft: ["submitted"],
  submitted: ["under_review", "revision_required", "rejected"],
  under_review: ["revision_required", "approved", "rejected"],
  revision_required: ["submitted", "draft", "rejected"],
  approved: ["published", "rejected"],
  rejected: ["draft", "submitted"],
  published: [],
};

export function canTransitionArticle(from: string, to: string) {
  if (from === to) return true;
  return (ARTICLE_TRANSITIONS[from as ArticleStatus] || []).includes(to as ArticleStatus);
}

export function canTransitionSubmission(from: string, to: string) {
  if (from === to) return true;
  return (SUBMISSION_TRANSITIONS[from as SubmissionStatus] || []).includes(to as SubmissionStatus);
}
