import { useEffect, useState } from "react";
import { getSettingsSection, saveSettingsSection } from "../../api/client";
import type { AISettingsState } from "../../types/settings";

const defaults: AISettingsState = { enabled: true, model: "configured by backend", includeLogs: true, includeMetrics: true, includeDeployments: true, includeDependencies: true };
const options: [keyof Pick<AISettingsState, "enabled" | "includeLogs" | "includeMetrics" | "includeDeployments" | "includeDependencies">, string, string][] = [
  ["enabled", "AI investigation enabled", "Allow the manager to start AI-powered investigations."],
  ["includeLogs", "Include logs", "Preference for including relevant logs in investigation context."],
  ["includeMetrics", "Include metrics", "Preference for including metric history."],
  ["includeDeployments", "Include deployments", "Preference for correlating deployment activity."],
  ["includeDependencies", "Include dependencies", "Preference for analyzing service dependencies."],
];

export default function AISettings() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSettingsSection<AISettingsState>("ai", defaults).then((value) => { if (!cancelled) setSettings(value); })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load AI preferences."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function toggle(key: typeof options[number][0]) {
    const previous = settings;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next); setSaving(true); setSaved(false); setError(null);
    try { await saveSettingsSection("ai", next); setSaved(true); }
    catch (err) { setSettings(previous); setError(err instanceof Error ? err.message : "Could not save AI preferences."); }
    finally { setSaving(false); }
  }

  return (
    <section className="settings-section">
      <div><h2>AI investigation</h2><p>Persist manager preferences for the AI investigation workflow.</p></div>
      {loading ? <p className="text-xs text-white/40">Loading preferences…</p> : <div className="settings-options">
        {options.map(([key, label, description]) => <label key={key} className="settings-option"><div><p>{label}</p><span>{description}</span></div><input type="checkbox" checked={settings[key]} disabled={saving} onChange={() => void toggle(key)} /></label>)}
      </div>}
      <p className="text-[10px] leading-5 text-white/30">The backend uses these preferences to enable or disable AI actions and to include or exclude logs, metrics, deployments, and dependencies from the investigation context.</p>
      {saving && <p className="text-xs text-white/35">Saving…</p>}
      {saved && !saving && <p className="text-xs text-emerald-300">Preferences saved.</p>}
      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
    </section>
  );
}
