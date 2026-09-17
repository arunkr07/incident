import { motion } from "framer-motion";
import { Bell, CheckCheck, X } from "lucide-react";
import NotificationItem from "./NotificationItem";
import type { Notification } from "../../types/notifications";

interface Props {
  onClose: () => void;
}

const notifications: Notification[] = [
  {
    id: "n1",
    type: "CRITICAL",
    title: "Critical incident requires attention",
    description:
      "A production incident has crossed the critical severity threshold.",
    timestamp: "2m",
    read: false,
  },
  {
    id: "n2",
    type: "AI",
    title: "AI investigation available",
    description:
      "Investigation context has been prepared for an active incident.",
    timestamp: "8m",
    read: false,
  },
  {
    id: "n3",
    type: "DEPLOYMENT",
    title: "Deployment completed",
    description:
      "A monitored service deployment completed successfully.",
    timestamp: "18m",
    read: true,
  },
];

export default function NotificationPanel({
  onClose,
}: Props) {
  return (
    <motion.div
      className="workspace-overlay justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 50, opacity: 0 }}
        className="workspace-panel h-[92vh] w-full max-w-130"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
            <div className="flex items-center gap-3">
              <Bell size={17} className="text-emerald-300" />

              <div>
                <p className="text-xs font-semibold text-white/80">
                  Notifications
                </p>

                <p className="text-[9px] text-white/25">
                  Production events requiring attention
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:bg-white/4"
            >
              <X size={17} />
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <span className="text-[10px] text-white/30">
              {notifications.filter((item) => !item.read).length} unread
            </span>

            <button className="flex items-center gap-1.5 text-[10px] text-emerald-300/70 hover:text-emerald-300">
              <CheckCheck size={13} />
              Mark all read
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}