import {
  Bell,
  ChevronDown,
  Command,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface TopbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenAssistant: () => void;
  onOpenNotifications: () => void;
  hasNotifications?: boolean;
}

function getPageName(pathname: string) {
  if (pathname.startsWith("/incidents/")) {
    return "Incident investigation";
  }

  if (pathname === "/incidents") {
    return "Incidents";
  }

  if (pathname.startsWith("/services/")) {
    return "Service details";
  }

  if (pathname === "/services") {
    return "Services";
  }

  if (pathname === "/logs") {
    return "Logs";
  }

  if (pathname === "/metrics") {
    return "Metrics";
  }

  if (pathname.startsWith("/deployments/")) {
    return "Deployment details";
  }

  if (pathname === "/deployments") {
    return "Deployments";
  }

  if (pathname === "/settings") {
    return "Settings";
  }

  return "Overview";
}

export default function Topbar({
  onToggleSidebar,
  onOpenAssistant,
  onOpenNotifications,
  hasNotifications,
}: TopbarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const pageName = getPageName(
    location.pathname,
  );

  return (
    <header className="topbar relative z-30 flex h-16 shrink-0 items-center gap-4 px-5">

      {/* SIDEBAR TOGGLE */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/35 transition hover:bg-white/4 hover:text-white/75"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      <div className="hidden h-5 w-px bg-white/[0.07] sm:block" />

      {/* PAGE CONTEXT */}
      <div className="hidden items-center gap-2 text-[12px] md:flex">

        <span className="text-white/25">
          Production
        </span>

        <span className="text-white/15">
          /
        </span>

        <span className="text-white/65">
          {pageName}
        </span>

        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>

      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center gap-2">

        {/* Search */}
        <button
          type="button"
          className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/2.5 px-3 text-left text-[11px] text-white/30 transition hover:border-white/12 hover:bg-white/4.5 sm:flex"
        >
          <Search size={15} />

          <span className="flex-1">
            Search incidents, services, logs...
          </span>

          <span className="flex items-center gap-0.5 rounded border border-white/[0.07] px-1.5 py-0.5 text-[9px]">
            <Command size={9} />
            K
          </span>
        </button>

        {/* AI Assistant */}
        <button
          type="button"
          onClick={onOpenAssistant}
          className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-400/15 bg-emerald-400/4 text-emerald-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/8"
          aria-label="Open AI assistant"
        >
          <Sparkles size={16} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-white/35 transition hover:bg-white/4 hover:text-white/70"
          aria-label="Open notifications"
        >
          <Bell size={17} />

          {hasNotifications && (
            <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_7px_rgba(245,158,11,0.7)]" />
          )}
        </button>

        <div className="ml-1 hidden h-6 w-px bg-white/[0.07] sm:block" />

        {/* USER */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-white/3"
        >
          <div className="grid h-8 w-8 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] text-[9px] font-semibold text-emerald-300">
            {user?.name
              ?.split(" ")
              .map(
                (part: string) => part[0],
              )
              .join("")
              .slice(0, 2) || "TL"}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-[11px] font-medium text-white/75">
              {user?.name || "Team Lead"}
            </p>

            <p className="text-[9px] text-white/30">
              Manager
            </p>
          </div>

          <ChevronDown
            size={13}
            className="text-white/25"
          />
        </button>
      </div>
    </header>
  );
}