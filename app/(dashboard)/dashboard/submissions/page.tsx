"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requestJson, toastApiError } from "@/lib/api-client";
import { DashboardTopbar } from "@/components/dashboard/topbar";

type Submission = { id: number; title: string; summary: string | null; status: string; adminNote: string | null; user: { name: string; email: string } | null };
export default function DashboardSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = () => requestJson<{ data?: Submission[] }>("/api/submissions").then((data) => { setItems(data.data ?? []); setError(false); }).catch((requestError) => { setError(true); toastApiError(requestError); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]"><DashboardTopbar />
      <div className="min-w-0 w-full flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold">Kiriman Pengguna</h1>
          <p className="text-sm text-muted-foreground">Tinjau konten yang dikirim oleh pengguna terdaftar.</p>
        </div>
        {error ? <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">Kiriman tidak dapat dimuat. Periksa koneksi layanan lalu coba lagi.</p> : null}
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.02]">
              <tr><th className="p-3">Judul</th><th className="p-3">Pengirim</th><th className="p-3">Status</th><th className="p-3">Tindakan</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td className="p-4" colSpan={4}>Memuat kiriman…</td></tr> : null}
              {!loading && !error && !items.length ? <tr><td className="p-4 text-muted-foreground" colSpan={4}>Belum ada kiriman pengguna.</td></tr> : null}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-black/5 last:border-0">
                  <td className="p-3"><p className="font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.summary}</p></td>
                  <td className="p-3">{item.user?.name}<br /><span className="text-xs text-muted-foreground">{item.user?.email}</span></td>
                  <td className="p-3"><span className="text-xs uppercase">{item.status.replaceAll("_", " ")}</span></td>
                  <td className="p-3"><Link href={`/dashboard/submissions/${item.id}`} className="text-xs font-bold uppercase text-gold-deep">Tinjau</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
