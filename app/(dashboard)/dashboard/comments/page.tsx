"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Trash, CircleNotch, Warning, ArrowBendUpLeft, CheckCircle, ShieldWarning, ArrowUUpLeft } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(
  () => import("@/components/dashboard/tiptap-editor").then((m) => m.TiptapEditor),
  { ssr: false }
);

interface CommentItem {
  id: number;
  content: string;
  status: "approved" | "pending" | "spam" | "rejected";
  parentId: number | null;
  authorName: string | null;
  authorEmail: string | null;
  createdAt: string;
  articleTitle: string | null;
  articleId: number;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  spam: { label: "Spam", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  rejected: { label: "Rejected", className: "bg-muted text-muted-foreground" },
};

export default function CommentsPage() {
  const [commentsList, setCommentsList] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = statusFilter ? `/api/comments?status=${statusFilter}` : "/api/comments";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setCommentsList(data || []);
      } else {
        toast.error("Gagal mengambil data komentar");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Gagal mengbarui status");
      toast.success(`Status komentar diubah ke ${status}`);
      fetchComments();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengbarui status komentar");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus komentar ini?")) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus komentar");
      toast.success("Komentar berhasil dihapus");
      fetchComments();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus komentar");
    }
  };

  const handleReply = async (commentId: number, articleId: number) => {
    if (!replyContent.trim() || replyContent === "<p></p>") {
      toast.error("Isi balasan tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          content: replyContent,
          parentId: commentId,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengirim balasan");
      toast.success("Balasan berhasil dikirim");
      setReplyingTo(null);
      setReplyContent("");
      fetchComments();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim balasan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-none border border-black/10 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-black/5 px-6 py-4">
            <CardTitle className="text-base font-bold text-foreground">Moderasi Komentar Pembaca</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 border border-black/15 bg-white px-2 text-xs rounded-none font-medium text-foreground focus:outline-none focus:border-[#B8860B]"
              >
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="spam">Spam</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <CircleNotch className="size-8 animate-spin text-primary" />
              </div>
            ) : commentsList.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-muted-foreground border border-dashed border-black/15 p-6 text-center">
                <p className="text-sm font-medium">Belum ada komentar pembaca untuk dimoderasi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {commentsList.map((comment) => {
                  const status = statusConfig[comment.status] || statusConfig.pending;
                  return (
                    <div key={comment.id} className="border border-black/10 bg-white p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{comment.authorName || "Anonim"}</span>
                            <Badge variant="outline" className={`text-[10px] font-medium rounded-none ${status.className}`}>
                              {status.label}
                            </Badge>
                          </div>
                          {comment.authorEmail && (
                            <p className="text-[10px] text-muted-foreground font-mono">{comment.authorEmail}</p>
                          )}
                          <p className="mt-2 text-sm text-foreground">{comment.content}</p>
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>di artikel: <strong className="text-foreground">{comment.articleTitle || "Artikel"}</strong></span>
                            <span>&middot;</span>
                            <span>{new Date(comment.createdAt).toLocaleDateString("id-ID")}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {comment.status !== "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="size-7 p-0 rounded-none text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                              title="Setujui"
                              onClick={() => handleUpdateStatus(comment.id, "approved")}
                            >
                              <CheckCircle className="size-4" />
                            </Button>
                          )}
                          {comment.status !== "spam" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="size-7 p-0 rounded-none text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                              title="Tandai Spam"
                              onClick={() => handleUpdateStatus(comment.id, "spam")}
                            >
                              <ShieldWarning className="size-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="size-7 p-0 rounded-none text-primary hover:bg-primary/10"
                            title="Balas"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          >
                            <ArrowUUpLeft className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="size-7 p-0 rounded-none text-destructive hover:bg-destructive/10"
                            title="Hapus"
                            onClick={() => handleDelete(comment.id)}
                          >
                            <Trash className="size-4" />
                          </Button>
                        </div>
                      </div>

                      {replyingTo === comment.id && (
                        <div className="mt-3 border-t border-black/5 pt-3 space-y-2">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Tulis balasan resmi redaksi..."
                            className="w-full border border-black/15 bg-white p-2.5 text-xs rounded-none focus:outline-none focus:border-[#B8860B]"
                            rows={3}
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              size="sm"
                              className="rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-bold uppercase tracking-wider"
                              disabled={isSubmitting || !replyContent.trim()}
                              onClick={() => handleReply(comment.id, comment.articleId)}
                            >
                              {isSubmitting && (
                                <CircleNotch className="mr-1 size-3 animate-spin" />
                              )}
                              Kirim Balasan
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-none text-xs"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                            >
                              Batal
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
