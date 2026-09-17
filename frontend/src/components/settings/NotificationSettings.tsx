import { useState } from "react";

const options = [
  ["criticalIncidents", "Critical incidents"],
  ["newIncidents", "New incidents"],
  ["aiCompleted", "AI investigation completed"],
  ["serviceDegraded", "Service degradation"],
  ["deploymentEvents", "Deployment events"],
  ["recoveryEvents", "Recovery events"],
] as const;

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    criticalIncidents: true,
    newIncidents: true,
    aiCompleted: true,
    serviceDegraded: true,
    deploymentEvents: true,
    recoveryEvents: true,
  });

  return (
    <section className="settings-section">
      <div>
        <h2>Notifications</h2>
        <p>
          Control which production events generate manager notifications.
        </p>
      </div>

      <div className="settings-options">
        {options.map(([key, label]) => (
          <label
            key={key}
            className="settings-option"
          >
            <div>
              <p>{label}</p>
              <span>Receive notification for this event.</span>
            </div>

            <input
              type="checkbox"
              checked={enabled[key]}
              onChange={() =>
                setEnabled((current) => ({
                  ...current,
                  [key]: !current[key],
                }))
              }
            />
          </label>
        ))}
      </div>
    </section>
  );
}