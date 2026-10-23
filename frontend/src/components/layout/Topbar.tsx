
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

interface TopbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenAssistant: () => void;
  onOpenNotifications: () => void;
  hasNotifications?: boolean;
}

function getPageName(pathname: string) {
  if (pathname.startsWith("/incidents/")) return "Incident investigation";
  if (pathname === "/incidents") return "Incidents";
  if (pathname.startsWith("/services/")) return "Service details";
  if (pathname === "/services") return "Services";
  if (pathname === "/logs") return "Logs";
  if (pathname === "/metrics") return "Metrics";
  if (pathname.startsWith("/deployments/")) return "Deployment details";
  if (pathname === "/deployments") return "Deployments";
  if (pathname === "/settings") return "Settings";
  return "Overview";
}

export default function Topbar({
  onToggleSidebar,
  onOpenAssistant,
  onOpenNotifications,
  hasNotifications,
}: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const pageName = getPageName(location.pathname);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();

    navigate(
      query
        ? `/incidents?search=${encodeURIComponent(query)}`
        : "/incidents"
    );
  }

  function handleLogout() {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  }

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TL";

  return (
    <header className="topbar relative z-30 flex h-16 shrink-0 items-center gap-4 px-5">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/35 transition hover:bg-white/4 hover:text-white/75"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      <div className="hidden h-5 w-px bg-white/[0.07] sm:block" />

      <div className="hidden items-center gap-2 text-[12px] md:flex">
        <span className="text-white/25">Production</span>
        <span className="text-white/15">/</span>
        <span className="text-white/65">{pageName}</span>
        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <form
          onSubmit={submitSearch}
          className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/2.5 px-3 text-[11px] text-white/30 transition focus-within:border-emerald-500/30 sm:flex"
        >
          <Search size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search incidents"
            placeholder="Search incidents, services…"
            className="min-w-0 flex-1 bg-transparent text-white/75 outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            className="rounded border border-white/[0.07] px-1.5 py-0.5 hover:text-white/70"
            aria-label="Submit search"
          >
            ↵
          </button>
        </form>

        <button
          type="button"
          onClick={onOpenAssistant}
          className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-400/15 bg-emerald-400/4 text-emerald-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/8"
          aria-label="Open AI assistant"
        >
          <Sparkles size={16} />
        </button>

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

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-white/3"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] text-[9px] font-semibold text-emerald-300">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-medium text-white/75">
                {user?.name || "Team Lead"}
              </p>
              <p className="text-[9px] text-white/30">Manager</p>
            </div>

            <ChevronDown
              size={13}
              className={`text-white/25 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setProfileOpen(false)}
              />

              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#101713] p-2 shadow-2xl"
              >
                <div className="border-b border-white/[0.07] px-3 py-2.5">
                  <p className="truncate text-sm font-medium text-white/85">
                    {user?.name || "Team Lead"}
                  </p>
                  <p className="truncate text-xs text-white/40">
                    {user?.email || ""}
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-400/10 hover:text-red-200"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
