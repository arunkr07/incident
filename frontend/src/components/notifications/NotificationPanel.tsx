import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, X } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { api } from "../../api/client";
import type { Notification } from "../../types/notifications";

interface Props { onClose: () => void; }

export default function NotificationPanel({ onClose }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setNotifications(await api.getNotificationModels()); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not load notifications."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function markRead(id: string) {
    try {
      await api.markNotificationRead(id);
      setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
    } catch (err) { setError(err instanceof Error ? err.message : "Could not mark notification read."); }
  }

  async function markAllRead() {
    setSaving(true);
    try {
      await api.markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    } catch (err) { setError(err instanceof Error ? err.message : "Could not mark notifications read."); }
    finally { setSaving(false); }
  }

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <motion.div className="workspace-overlay justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} className="workspace-panel h-[92vh] w-full max-w-130">
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
            <div className="flex items-center gap-3">
              <Bell size={17} className="text-emerald-300" />
              <div><p className="text-xs font-semibold text-white/80">Notifications</p><p className="text-[9px] text-white/25">Production events requiring attention</p></div>
            </div>
            <button onClick={onClose} aria-label="Close notifications" className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:bg-white/4"><X size={17} /></button>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <span className="text-[10px] text-white/30">{unreadCount} unread</span>
            <button disabled={!unreadCount || saving} onClick={() => void markAllRead()} className="flex items-center gap-1.5 text-[10px] text-emerald-300/70 hover:text-emerald-300 disabled:opacity-40"><CheckCheck size={13} />{saving ? "Saving…" : "Mark all read"}</button>
          </div>
          {error && <div role="alert" className="mx-4 mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">{error} <button onClick={() => void load()} className="ml-2 underline">Retry</button></div>}
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
            {loading ? <p className="py-10 text-center text-xs text-white/35">Loading notifications…</p>
              : notifications.length ? notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} onMarkRead={() => void markRead(notification.id)} />)
              : <p className="py-10 text-center text-xs text-white/35">No notifications have been recorded.</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
