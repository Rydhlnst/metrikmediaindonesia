"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { requestJson, toastApiError } from "@/lib/api-client";

type Category = { id: number; name: string; isActive?: boolean };

export function SubmissionForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", content: "", categoryId: "", featuredImage: "", videoUrl: "", sources: "" });

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Could not load categories"))))
      .then((data: Category[]) => setCategories(data.filter((category) => category.isActive !== false)))
      .catch((error) => toastApiError(error));
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await requestJson("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, categoryId: form.categoryId || null, featuredImage: form.featuredImage || null, videoUrl: form.videoUrl || null, summary: form.summary || null, sources: form.sources || null, submit: true }) });
      toast.success("Submission sent to the editorial team");
      router.push("/submissions");
      router.refresh();
    } catch (error) { toastApiError(error); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-5 border border-black/10 bg-white p-5 md:p-8">
      <div>
        <label className="text-sm font-semibold">Title</label>
        <input required minLength={10} maxLength={255} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1.5 h-11 w-full border border-black/15 px-3" />
      </div>
      <div>
        <label className="text-sm font-semibold">Summary</label>
        <textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} maxLength={500} rows={3} className="mt-1.5 w-full border border-black/15 p-3" />
      </div>
      <div>
        <label className="text-sm font-semibold">Category</label>
        <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="mt-1.5 h-11 w-full border border-black/15 px-3">
          <option value="">Choose a category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold">Content</label>
        <textarea required minLength={50} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={14} className="mt-1.5 w-full border border-black/15 p-3" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Featured image URL</label>
          <input type="url" value={form.featuredImage} onChange={(event) => setForm({ ...form, featuredImage: event.target.value })} className="mt-1.5 h-11 w-full border border-black/15 px-3" />
        </div>
        <div>
          <label className="text-sm font-semibold">Video URL</label>
          <input type="url" value={form.videoUrl} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} className="mt-1.5 h-11 w-full border border-black/15 px-3" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold">Sources and references</label>
        <textarea value={form.sources} onChange={(event) => setForm({ ...form, sources: event.target.value })} rows={4} className="mt-1.5 w-full border border-black/15 p-3" />
      </div>
      <button disabled={loading} className="bg-black px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">
        {loading ? "Sending…" : "Send for review"}
      </button>
    </form>
  );
}
