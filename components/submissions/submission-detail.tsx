"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { requestJson, toastApiError } from "@/lib/api-client";

type Submission = { id: number; title: string; summary: string | null; content: string; status: string; adminNote: string | null; articleId: number | null; featuredImage: string | null; videoUrl: string | null; sources: string | null; submittedAt: string | null; reviewedAt: string | null };
type Review = { action: string; note: string | null; createdAt: string };

export function SubmissionDetail({ id, editorial = false }: { id: number; editorial?: boolean }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await requestJson<{ data?: Submission; reviews?: Review[] }>(`/api/submissions/${id}`);
      if (!data.data) throw new Error("Kiriman tidak tersedia");
      setSubmission(data.data);
      setReviews(data.reviews ?? []);
      setNote(data.data.adminNote ?? "");
    } catch (error) {
      toastApiError(error);
      router.push(editorial ? "/dashboard/submissions" : "/submissions");
    } finally {
      setLoading(false);
    }
  }, [editorial, id, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const review = async (status: string) => {
    setSaving(true);
    try { await requestJson(`/api/submissions/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, adminNote: note || null }) }); toast.success("Tinjauan kiriman berhasil diperbarui"); void load(); }
    catch (error) { toastApiError(error); }
    finally { setSaving(false); }
  };

  const publish = async () => {
    setSaving(true);
    try { await requestJson(`/api/submissions/${id}/publish`, { method: "POST" }); toast.success("Kiriman berhasil dipublikasikan sebagai artikel"); void load(); }
    catch (error) { toastApiError(error); }
    finally { setSaving(false); }
  };

  const saveUserRevision = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submission) return;
    setSaving(true);
    try { await requestJson(`/api/submissions/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: submission.title, summary: submission.summary, content: submission.content, featuredImage: submission.featuredImage, videoUrl: submission.videoUrl, sources: submission.sources, submit: true }) }); toast.success("Revisi berhasil dikirim"); void load(); }
    catch (error) { toastApiError(error); }
    finally { setSaving(false); }
  };

  if (loading || !submission) return <p className="p-6 text-sm text-muted-foreground">Memuat kiriman…</p>;
  const editable = !editorial && ["draft", "revision_required"].includes(submission.status);

  return <div className="space-y-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">{submission.status.replaceAll("_", " ")}</p><h1 className="mt-1 font-serif text-3xl font-bold">{submission.title}</h1><p className="mt-2 text-sm text-muted-foreground">Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString("id-ID") : "as a draft"}</p></div><Link href={editorial ? "/dashboard/submissions" : "/submissions"} className="border border-black/15 px-3 py-2 text-xs font-bold uppercase">Back</Link></div>{submission.adminNote ? <div className="border-l-2 border-gold bg-gold/5 p-4 text-sm"><strong>Editorial note:</strong> {submission.adminNote}</div> : null}<div className="border border-black/10 bg-white p-6"><p className="whitespace-pre-wrap text-sm leading-7">{submission.content}</p>{submission.sources ? <p className="mt-5 border-t border-black/10 pt-4 text-xs text-muted-foreground">Sources: {submission.sources}</p> : null}</div>{editable ? <form onSubmit={saveUserRevision} className="space-y-4 border border-black/10 bg-white p-6"><h2 className="font-serif text-xl font-bold">Revise and resubmit</h2><input value={submission.title} onChange={(event) => setSubmission({ ...submission, title: event.target.value })} className="h-10 w-full border border-black/15 px-3" /><textarea value={submission.content} onChange={(event) => setSubmission({ ...submission, content: event.target.value })} rows={12} className="w-full border border-black/15 p-3" /><button disabled={saving} className="bg-black px-4 py-2 text-xs font-bold uppercase text-white disabled:opacity-50">{saving ? "Saving…" : "Resubmit"}</button></form> : null}{editorial ? <section className="space-y-3 border border-black/10 bg-white p-6"><h2 className="font-serif text-xl font-bold">Editorial action</h2><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Editorial note (required for revision or rejection)" rows={4} className="w-full border border-black/15 p-3" /><div className="flex flex-wrap gap-2"><button disabled={saving} onClick={() => review("under_review")} className="border border-black/15 px-3 py-2 text-xs font-bold uppercase">Start review</button><button disabled={saving} onClick={() => review("revision_required")} className="border border-black/15 px-3 py-2 text-xs font-bold uppercase">Request revision</button><button disabled={saving} onClick={() => review("rejected")} className="border border-black/15 px-3 py-2 text-xs font-bold uppercase">Reject</button><button disabled={saving} onClick={() => review("approved")} className="bg-gold px-3 py-2 text-xs font-bold uppercase text-white">Approve</button>{submission.status === "approved" ? <button disabled={saving} onClick={publish} className="bg-black px-3 py-2 text-xs font-bold uppercase text-white">Publish article</button> : null}</div></section> : null}<section className="border border-black/10 bg-white p-6"><h2 className="font-serif text-xl font-bold">Review history</h2><ol className="mt-4 space-y-3">{reviews.length ? reviews.map((reviewItem, index) => <li key={`${reviewItem.action}-${index}`} className="border-l border-black/15 pl-3 text-sm"><strong className="capitalize">{reviewItem.action.replaceAll("_", " ")}</strong><span className="ml-2 text-xs text-muted-foreground">{new Date(reviewItem.createdAt).toLocaleString("id-ID")}</span>{reviewItem.note ? <p className="mt-1 text-muted-foreground">{reviewItem.note}</p> : null}</li>) : <li className="text-sm text-muted-foreground">No review activity yet.</li>}</ol></section></div>;
}
