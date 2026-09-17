import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { useAuth } from "../context/AuthContext";
import AIAssistantPanel from "../ai/AIAssistantPanel";
import NotificationPanel from "../notifications/NotificationPanel";

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const { user } = useAuth();

  return (
    <div className="app-shell relative min-h-screen overflow-hidden bg-[#06110d]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{
                width: 0,
                opacity: 0,
              }}
              animate={{
                width: 258,
                opacity: 1,
              }}
              exit={{
                width: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.22,
                ease: "easeInOut",
              }}
              className="hidden shrink-0 overflow-hidden lg:block"
            >
              <Sidebar
                onClose={() => setSidebarOpen(false)}
                user={user}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN APPLICATION */}
        <div className="app-main flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() =>
              setSidebarOpen((value) => !value)
            }
            onOpenAssistant={() =>
              setAssistantOpen(true)
            }
            onOpenNotifications={() =>
              setNotificationsOpen(true)
            }
            hasNotifications
          />

          <main className="workspace relative flex-1">
            <div className="workspace-content">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* AI ASSISTANT */}
      <AnimatePresence>
        {assistantOpen && (
          <AIAssistantPanel
            onClose={() =>
              setAssistantOpen(false)
            }
          />
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS */}
      <AnimatePresence>
        {notificationsOpen && (
          <NotificationPanel
            onClose={() =>
              setNotificationsOpen(false)
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}