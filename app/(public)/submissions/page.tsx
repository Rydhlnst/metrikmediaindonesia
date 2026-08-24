"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { requestJson, toastApiError } from "@/lib/api-client";

type Submission = { id: number; title: string; summary: string | null; status: string; adminNote: string | null };

export default function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    void requestJson<{ data?: Submission[] }>("/api/submissions")
      .then((response) => setItems(response.data ?? []))
      .catch((requestError) => { setError(true); toastApiError(requestError); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container-editorial max-w-4xl py-8 pb-20">
      <div className="flex items-start justify-between gap-4">
        <PublicPageHeader title="My Submissions" description="Track your content through editorial review." />
        <Link href="/submit" className="shrink-0 bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Submit content</Link>
      </div>
      <div className="mt-6 space-y-3">
        {loading ? <p className="text-sm text-muted-foreground">Loading submissions…</p> : null}
        {!loading && error ? <p className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">Could not load submissions. Please try again.</p> : null}
        {!loading && !error && items.length === 0 ? <p className="border border-black/10 bg-white p-6 text-sm text-muted-foreground">You have not submitted any content yet.</p> : null}
        {items.map((item) => <article key={item.id} className="border border-black/10 bg-white p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-xl font-bold"><Link href={`/submissions/${item.id}`} className="hover:text-gold-deep">{item.title}</Link></h2>{item.summary ? <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p> : null}</div><span className="shrink-0 bg-black/5 px-2 py-1 text-xs font-semibold uppercase">{item.status.replaceAll("_", " ")}</span></div>{item.adminNote ? <p className="mt-4 border-l-2 border-gold pl-3 text-sm">Editorial note: {item.adminNote}</p> : null}<Link href={`/submissions/${item.id}`} className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-gold-deep">View submission →</Link></article>)}
      </div>
    </main>
  );
}
