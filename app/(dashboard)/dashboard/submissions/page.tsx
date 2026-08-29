"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requestJson, toastApiError } from "@/lib/api-client";

type Submission = { id: number; title: string; summary: string | null; status: string; adminNote: string | null; user: { name: string; email: string } | null };
export default function DashboardSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = () => requestJson<{ data?: Submission[] }>("/api/submissions").then((data) => { setItems(data.data ?? []); setError(false); }).catch((requestError) => { setError(true); toastApiError(requestError); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  return (
    <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">User Submissions</h1>
          <p className="text-sm text-muted-foreground">Review content submitted by registered users.</p>
        </div>
        {error ? <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">Could not load submissions. Please try again.</p> : null}
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.02]">
              <tr><th className="p-3">Title</th><th className="p-3">Sender</th><th className="p-3">Status</th><th className="p-3">Action</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td className="p-4" colSpan={4}>Loading…</td></tr> : null}
              {!loading && !error && !items.length ? <tr><td className="p-4 text-muted-foreground" colSpan={4}>No submissions found.</td></tr> : null}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-black/5 last:border-0">
                  <td className="p-3"><p className="font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.summary}</p></td>
                  <td className="p-3">{item.user?.name}<br /><span className="text-xs text-muted-foreground">{item.user?.email}</span></td>
                  <td className="p-3"><span className="text-xs uppercase">{item.status.replaceAll("_", " ")}</span></td>
                  <td className="p-3"><Link href={`/dashboard/submissions/${item.id}`} className="text-xs font-bold uppercase text-gold-deep">Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
