import { useEffect, useState } from "react";
import { api, type ApiDetectionRule } from "../../api/client";

export default function DetectionSettings() {
  const [rules, setRules] = useState<ApiDetectionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.getDetectionRules().then((data) => { if (!cancelled) setRules(data); })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load detection rules."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function updateRule(id: number, patch: Partial<ApiDetectionRule>) {
    setSaved(false);
    setRules((current) => current.map((rule) => rule.id === id ? { ...rule, ...patch } : rule));
  }

  async function save() {
    setSaving(true); setSaved(false); setError(null);
    try {
      const updated = await Promise.all(rules.map((rule) => api.updateDetectionRule(rule.id, {
        threshold: rule.threshold, enabled: rule.enabled,
        evaluationWindowSeconds: rule.evaluationWindowSeconds,
        severity: rule.severity, operator: rule.operator, name: rule.name,
      })));
      setRules(updated); setSaved(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save detection rules."); }
    finally { setSaving(false); }
  }

  return (
    <section className="settings-section">
      <div><h2>Detection rules</h2><p>These values are loaded from and saved to the backend detection-rule API.</p></div>
      {loading ? <p className="text-xs text-white/40">Loading detection rules…</p> : rules.length === 0 ? <p className="rounded-lg border border-white/8 p-4 text-xs text-white/40">No detection rules are configured yet. Create a service and detection rule through the backend API before configuring thresholds here.</p> : <>
        <div className="space-y-3">
          {rules.map((rule) => <div key={rule.id} className="rounded-xl border border-white/8 bg-white/[0.015] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-medium text-white/75">{rule.name}</p><p className="mt-1 text-[10px] text-white/30">{rule.serviceName} · {rule.metricType.replaceAll("_", " ")} · {rule.severity}</p></div><label className="flex items-center gap-2 text-xs text-white/50"><input type="checkbox" checked={rule.enabled} onChange={(event) => updateRule(rule.id, { enabled: event.target.checked })} />Enabled</label></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] text-white/40">Threshold
                <input type="number" min="0" step="any" value={rule.threshold} onChange={(event) => updateRule(rule.id, { threshold: Number(event.target.value) })} className="settings-input mt-2" />
              </label>
              <label className="text-[10px] text-white/40">Evaluation window (seconds)
                <input type="number" min="1" value={rule.evaluationWindowSeconds} onChange={(event) => updateRule(rule.id, { evaluationWindowSeconds: Math.max(1, Number(event.target.value)) })} className="settings-input mt-2" />
              </label>
            </div>
          </div>)}
        </div>
        <button disabled={saving} onClick={() => void save()} className="rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-[#032118] disabled:opacity-40">{saving ? "Saving rules…" : "Save detection rules"}</button>
      </>}
      {saved && <p className="text-xs text-emerald-300">Detection rules saved to the backend.</p>}
      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
    </section>
  );
}
