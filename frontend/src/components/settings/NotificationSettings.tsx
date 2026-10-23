import { useEffect, useState } from "react";
import { getSettingsSection, saveSettingsSection } from "../../api/client";
import type { NotificationSettingsState } from "../../types/settings";

const defaults: NotificationSettingsState = {
  criticalIncidents: true, newIncidents: true, aiCompleted: true,
  serviceDegraded: true, deploymentEvents: true, recoveryEvents: true,
};
const options: [keyof NotificationSettingsState, string][] = [
  ["criticalIncidents", "Critical incidents"], ["newIncidents", "New incidents"],
  ["aiCompleted", "AI investigation completed"], ["serviceDegraded", "Service degradation"],
  ["deploymentEvents", "Deployment events"], ["recoveryEvents", "Recovery events"],
];

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSettingsSection<NotificationSettingsState>("notifications", defaults)
      .then((value) => { if (!cancelled) setEnabled(value); })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load notification preferences."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function toggle(key: keyof NotificationSettingsState) {
    const next = { ...enabled, [key]: !enabled[key] };
    setEnabled(next); setSaving(true); setSaved(false); setError(null);
    try { await saveSettingsSection("notifications", next); setSaved(true); }
    catch (err) { setEnabled(enabled); setError(err instanceof Error ? err.message : "Could not save notification preferences."); }
    finally { setSaving(false); }
  }

  return (
    <section className="settings-section">
      <div><h2>Notifications</h2><p>Persist manager notification preferences for this account.</p></div>
      {loading ? <p className="text-xs text-white/40">Loading preferences…</p> : <div className="settings-options">
        {options.map(([key, label]) => <label key={key} className="settings-option"><div><p>{label}</p><span>Preference saved to the backend account settings.</span></div><input type="checkbox" checked={enabled[key]} disabled={saving} onChange={() => void toggle(key)} /></label>)}
      </div>}
      {saving && <p className="text-xs text-white/35">Saving…</p>}
      {saved && !saving && <p className="text-xs text-emerald-300">Preferences saved.</p>}
      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
    </section>
  );
}
