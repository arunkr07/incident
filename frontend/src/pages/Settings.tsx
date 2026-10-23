import { useState } from "react";
import {
  Bell,
  BrainCircuit,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";

import ProfileSettings from "../components/settings/ProfileSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import DetectionSettings from "../components/settings/DetectionSettings";
import AISettings from "../components/settings/AISettings";
import ApprovalSettings from "../components/settings/ApprovalSettings";

const sections = [
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "detection",
    label: "Detection",
    icon: SlidersHorizontal,
  },
  {
    id: "ai",
    label: "AI investigation",
    icon: BrainCircuit,
  },
  {
    id: "approval",
    label: "Production approval",
    icon: ShieldCheck,
  },
];

export default function Settings() {
  const [active, setActive] = useState("profile");

  return (
    <div>
      <div className="mb-8">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-400/60">
          System
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-white">
          Settings
        </h1>

        <p className="mt-2 text-sm text-white/35">
          Configure Incident behavior and manager controls.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-white/6 bg-white/1.5 p-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => setActive(section.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                  active === section.id
                    ? "bg-emerald-400/[0.07] text-emerald-200"
                    : "text-white/40 hover:bg-white/3 hover:text-white/70"
                }`}
              >
                <Icon size={15} />

                {section.label}
              </button>
            );
          })}
        </aside>

        <div className="min-w-0">
          {active === "profile" && <ProfileSettings />}
          {active === "notifications" && (
            <NotificationSettings />
          )}
          {active === "detection" && <DetectionSettings />}
          {active === "ai" && <AISettings />}
          {active === "approval" && <ApprovalSettings />}

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/5 bg-white/1 p-4 text-[10px] text-white/25">
            <LockKeyhole size={13} />
            Account preferences and detection rules are stored by the backend. Production remediation approval remains enforced server-side.
          </div>
        </div>
      </div>
    </div>
  );
}