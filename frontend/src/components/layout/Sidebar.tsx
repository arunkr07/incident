import {
  Activity,
  Bell,
  Boxes,
  ChevronLeft,
  Gauge,
  GitBranch,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldAlert,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { User } from "../context/AuthContext";

interface SidebarProps {
  onClose: () => void;
  user: User | null;
}

const monitorItems = [
  {
    label: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Incidents",
    path: "/incidents",
    icon: ShieldAlert,
  },
  {
    label: "Services",
    path: "/services",
    icon: Boxes,
  },
  {
    label: "Logs",
    path: "/logs",
    icon: ScrollText,
  },
  {
    label: "Metrics",
    path: "/metrics",
    icon: Gauge,
  },
  {
    label: "Deployments",
    path: "/deployments",
    icon: GitBranch,
  },
];

export default function Sidebar({
  onClose,
  user,
}: SidebarProps) {
  return (
    <div className="sidebar flex h-screen w-64.5 flex-col">

      {/* BRAND */}
      <div className="flex h-16 shrink-0 items-center border-b border-white/[0.07] px-5">
        <div className="flex items-center gap-3">

          <div className="relative grid h-8 w-8 place-items-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-400">
            <Activity size={18} />

            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>

          <div>
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">
              Incident
            </p>

            <p className="mt-0.5 text-[8px] font-semibold tracking-[0.2em] text-white/30">
              PRODUCTION RESPONSE
            </p>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 py-6">

        <p className="mb-3 px-2 text-[9px] font-semibold tracking-[0.2em] text-emerald-400/45">
          MONITOR
        </p>

        <nav className="space-y-1">
          {monitorItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `sidebar-item flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] ${
                    isActive
                      ? "sidebar-item-active"
                      : ""
                  }`
                }
              >
                <Icon
                  size={17}
                  strokeWidth={1.7}
                />

                <span>{item.label}</span>

                {item.label === "Incidents" && (
                  <span className="ml-auto rounded-md border border-red-400/10 bg-red-400/8 px-2 py-0.5 text-[10px] font-medium text-red-300">
                    3
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* SYSTEM */}
        <p className="mb-3 mt-8 px-2 text-[9px] font-semibold tracking-[0.2em] text-emerald-400/45">
          SYSTEM
        </p>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-item flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] ${
              isActive
                ? "sidebar-item-active"
                : ""
            }`
          }
        >
          <Settings
            size={17}
            strokeWidth={1.7}
          />

          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-item mt-1 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px]"
        >
          <Bell
            size={17}
            strokeWidth={1.7}
          />

          <span>Notifications</span>

          <span className="ml-auto h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
        </button>
      </div>

      {/* STATUS + USER */}
      <div className="border-t border-white/[0.07] p-3">

        {/* Monitoring status */}
        <div className="mb-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] p-3">
          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

            <span className="text-[11px] font-medium text-emerald-300">
              Monitoring active
            </span>
          </div>

          <p className="mt-2 text-[10px] leading-4 text-white/30">
            Production signals are being monitored.
          </p>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/2.5 p-3">

          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/8 text-[10px] font-semibold text-emerald-300">
            {user?.name
              ?.split(" ")
              .map(
                (part: string) => part[0],
              )
              .join("")
              .slice(0, 2) || "TL"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-white/80">
              {user?.name || "Team Lead"}
            </p>

            <p className="mt-0.5 text-[9px] text-white/30">
              Manager
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="hidden text-white/25 transition hover:text-white/60 xl:block"
            aria-label="Hide sidebar"
          >
            <ChevronLeft size={16} />
          </button>

        </div>
      </div>
    </div>
  );
}