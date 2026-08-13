"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Trash, CircleNotch, Warning, ArrowBendUpLeft } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
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
    <main className="flex-1 px-4 pb-7 lg:px-8">
      <DashboardTopbar />
      <div className="mx-auto">
        <Card className="rounded-none bg-card ring-0 shadow-sm">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <CardTitle className="text-lg font-bold">Moderasi Komentar Pembaca</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 border border-outline-variant bg-muted px-2 text-xs"
              >
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="spam">Spam</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <CircleNotch className="size-8 animate-spin text-news-red" />
              </div>
            ) : commentsList.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-muted-foreground border border-dashed border-border p-6 text-center">
                <p className="text-sm font-medium">Belum ada komentar pembaca untuk dimoderasi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {commentsList.map((comment) => {
                  const status = statusConfig[comment.status] || statusConfig.pending;
                  return (
                    <div key={comment.id} className="border border-border/50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{comment.authorName || "Anonim"}</span>
                            <Badge variant="outline" className={`text-[10px] font-medium rounded-none ${status.className}`}>
                              {status.label}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <div
                            className="mt-1 text-xs text-muted-foreground prose prose-xs max-w-none"
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                          />
                          {comment.articleTitle && (
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              di artikel: <span className="font-medium text-foreground">{comment.articleTitle}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-blue-600"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            title="Balas Komentar"
                          >
                            <ArrowBendUpLeft className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-emerald-600"
                            onClick={() => handleUpdateStatus(comment.id, "approved")}
                            title="Setujui (Approve)"
                          >
                            <Check className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-amber-600"
                            onClick={() => handleUpdateStatus(comment.id, "spam")}
                            title="Tandai Spam"
                          >
                            <Warning className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive"
                            onClick={() => handleDelete(comment.id)}
                            title="Hapus Komentar"
                          >
                            <Trash className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {replyingTo === comment.id && (
                        <div className="mt-4 border-t border-border/50 pt-4">
                          <p className="mb-2 text-xs font-medium text-muted-foreground">Balas komentar:</p>
                          <TiptapEditor
                            content={replyContent}
                            onChange={setReplyContent}
                            placeholder="Tulis balasan..."
                          />
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              size="sm"
                              className="rounded-none gap-1"
                              onClick={() => handleReply(comment.id, comment.articleId)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <CircleNotch className="size-3 animate-spin" />
                              ) : (
                                <ArrowBendUpLeft className="size-3" />
                              )}
                              Kirim Balasan
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-none"
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
    </main>
  );
}
