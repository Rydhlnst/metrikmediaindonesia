"use client";

import { FormEvent, useState } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { requestJson, toastApiError } from "@/lib/api-client";

const initialState = {
  companyName: "",
  contactName: "",
  companyWebsite: "",
  industry: "",
  contactEmail: "",
  contactPhone: "",
  articleTitle: "",
  articleContent: "",
  attachments: "",
};

export function BusinessPublicationForm() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await requestJson("/api/business-publications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, companyWebsite: form.companyWebsite || null, industry: form.industry || null, attachments: form.attachments.split("\n").map((value) => value.trim()).filter(Boolean) }) });
      setForm(initialState);
      toast.success("Your publication request has been sent for editorial review.");
    } catch (error) { toastApiError(error); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-6 border border-black/10 bg-white p-6 sm:p-10">
      <div className="border-b border-black/10 pb-4"><h2 className="font-serif text-xl font-bold text-foreground">Press release and content partnership</h2><p className="mt-1 text-xs text-muted-foreground">The editorial team will review the request and contact you through the details below.</p></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company or organisation" value={form.companyName} onChange={(value) => setForm({ ...form, companyName: value })} required />
        <Field label="Contact name" value={form.contactName} onChange={(value) => setForm({ ...form, contactName: value })} required />
        <Field label="Company website" type="url" value={form.companyWebsite} onChange={(value) => setForm({ ...form, companyWebsite: value })} />
        <Field label="Industry" value={form.industry} onChange={(value) => setForm({ ...form, industry: value })} />
        <Field label="Contact email" type="email" value={form.contactEmail} onChange={(value) => setForm({ ...form, contactEmail: value })} required />
        <Field label="WhatsApp or phone" type="tel" value={form.contactPhone} onChange={(value) => setForm({ ...form, contactPhone: value })} required />
      </div>
      <Field label="Press release title" value={form.articleTitle} onChange={(value) => setForm({ ...form, articleTitle: value })} required />
      <label className="block text-xs font-bold uppercase tracking-wider text-foreground">Press release content<textarea required minLength={50} rows={10} value={form.articleContent} onChange={(event) => setForm({ ...form, articleContent: event.target.value })} className="mt-1.5 w-full border border-black/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold" /></label>
      <label className="block text-xs font-bold uppercase tracking-wider text-foreground">Attachment URLs (one per line)<textarea rows={3} value={form.attachments} onChange={(event) => setForm({ ...form, attachments: event.target.value })} className="mt-1.5 w-full border border-black/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold" /></label>
      <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-black px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"><PaperPlaneRight className="size-4" weight="bold" />{submitting ? "Sending…" : "Send for editorial review"}</button>
    </form>
  );
}

function Field({ label, value, onChange, required = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return <label className="block text-xs font-bold uppercase tracking-wider text-foreground">{label}<input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full border border-black/15 px-3 text-sm outline-none focus:border-gold" /></label>;
}
