"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { requestJson, toastApiError } from "@/lib/api-client";

type Publication = { id: number; companyName: string; contactName: string | null; contactEmail: string; articleTitle: string; status: string; reviewNote: string | null; createdAt: string; updatedAt: string };

export default function BusinessPublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void requestJson<{ data?: Publication[] }>("/api/business-publications").then((payload) => setItems(payload.data ?? [])).catch(toastApiError).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Business Publications</h1><p className="text-sm text-muted-foreground">Review and track submitted business publication requests.</p></div><div className="overflow-x-auto border border-black/10 bg-white"><table className="w-full text-left text-sm"><thead className="border-b border-black/10 bg-black/[0.02]"><tr><th className="p-3">Title</th><th className="p-3">Company</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{loading ? <tr><td colSpan={4} className="p-6 text-muted-foreground">Loading…</td></tr> : null}{!loading && !items.length ? <tr><td colSpan={4} className="p-6 text-muted-foreground">No business publication requests.</td></tr> : null}{items.map((item) => <tr key={item.id} className="border-b border-black/5"><td className="p-3"><Link className="font-semibold hover:text-gold-deep" href={`/dashboard/business-publications/${item.id}`}>{item.articleTitle}</Link><p className="text-xs text-muted-foreground">{item.contactEmail}</p></td><td className="p-3">{item.companyName}<br /><span className="text-xs text-muted-foreground">{item.contactName}</span></td><td className="p-3 text-xs uppercase">{item.status.replaceAll("_", " ")}</td><td className="p-3"><Link className="text-xs font-bold uppercase text-gold-deep" href={`/dashboard/business-publications/${item.id}`}>Review</Link></td></tr>)}</tbody></table></div></div>;
}
