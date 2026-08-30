"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiClientError, requestJson, toastApiError } from "@/lib/api-client";
import { DashboardTopbar } from "@/components/dashboard/topbar";

type Publication = { id: number; companyName: string; contactName: string | null; contactEmail: string; contactPhone: string; articleTitle: string; articleContent: string; status: string; reviewNote: string | null; attachments: string[] | null };

export default function BusinessPublicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<Publication | null>(null);
  const [status, setStatus] = useState("under_review");
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void requestJson<{ data: Publication }>(`/api/business-publications/${params.id}`)
        .then((payload) => {
          setItem(payload.data);
          setStatus(payload.data.status);
          setReviewNote(payload.data.reviewNote ?? "");
        })
        .catch((error: unknown) => {
          toastApiError(error);
          if (error instanceof ApiClientError && error.status === 404) {
            router.replace("/dashboard/business-publications");
          }
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [params.id, router]);
  const save = async () => { setSaving(true); try { const payload = await requestJson<{ data: Publication }>(`/api/business-publications/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, reviewNote: reviewNote || null }) }); setItem(payload.data); toast.success("Tinjauan publikasi bisnis berhasil diperbarui"); } catch (error) { toastApiError(error); } finally { setSaving(false); } };
  const content = loading ? <p className="text-sm text-muted-foreground">Memuat data publikasi…</p> : !item ? <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">Data publikasi tidak dapat dimuat. Periksa koneksi layanan lalu coba lagi.</p> : <div className="space-y-6"><Link href="/dashboard/business-publications" className="text-xs font-bold uppercase text-gold-deep">← Kembali ke permintaan</Link><div className="border border-black/10 bg-white p-6"><p className="text-xs uppercase text-muted-foreground">{item.companyName} · {item.contactEmail}</p><h1 className="mt-2 font-serif text-3xl font-bold">{item.articleTitle}</h1><p className="mt-5 whitespace-pre-wrap text-sm leading-7">{item.articleContent}</p></div><section className="space-y-4 border border-black/10 bg-white p-6"><h2 className="font-serif text-xl font-bold">Tinjauan redaksi</h2><select aria-label="Status publikasi" value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 w-full border border-black/15 px-3"><option value="under_review">Sedang ditinjau</option><option value="revision_required">Perlu revisi</option><option value="approved">Disetujui</option><option value="published">Dipublikasikan</option><option value="rejected">Ditolak</option></select><textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} rows={5} placeholder="Wajib diisi untuk revisi atau penolakan" className="w-full border border-black/15 p-3" /><button disabled={saving} onClick={save} className="bg-black px-4 py-2 text-xs font-bold uppercase text-white disabled:opacity-50">{saving ? "Menyimpan…" : "Simpan tinjauan"}</button></section></div>;
  return <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]"><DashboardTopbar /><div className="w-full flex-1 p-4 sm:p-6 lg:p-8">{content}</div></div>;
}
