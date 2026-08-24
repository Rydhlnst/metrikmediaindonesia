"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle,
  Clock,
  Warning,
  FileText,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  articleId: number | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  article_submitted: <Clock className="size-4 text-amber-500" />,
  article_review: <FileText className="size-4 text-blue-500" />,
  revision_required: <Warning className="size-4 text-red-500" />,
  article_approved: <CheckCircle className="size-4 text-emerald-500" />,
  article_published: <CheckCircle className="size-4 text-green-500" />,
  article_rejected: <Warning className="size-4 text-red-500" />,
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}j lalu`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}h lalu`;
}

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchNotifications());
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error("Gagal menandai notifikasi");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("Semua notifikasi ditandai sudah dibaca");
    } catch {
      toast.error("Gagal memperbarui notifikasi");
    }
  };

  const deleteNotification = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      const notif = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      toast.error("Gagal menghapus notifikasi");
    }
  };

  const handleClick = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.link) {
      router.push(notif.link);
    } else if (notif.articleId) {
      router.push(`/dashboard/articles/${notif.articleId}/edit`);
    }
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-none hover:bg-black/5 transition-colors outline-none cursor-pointer">
          <Bell className="size-5 text-muted-foreground" weight="bold" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 rounded-none border border-black/10 bg-white shadow-md p-0 max-h-[400px] overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/5">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Notifikasi
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
            >
              Tandai semua dibaca
            </button>
          )}
        </div>

        <div className="overflow-y-auto max-h-[320px]">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Belum ada notifikasi</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-black/5 border-b border-black/5 last:border-0 transition-colors ${
                  !notif.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {typeIcons[notif.type] || <Bell className="size-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-tight ${!notif.isRead ? "font-bold" : "font-medium"}`}>
                    {notif.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {!notif.isRead && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                  <button
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="p-1 rounded hover:bg-black/10 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Trash className="size-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
