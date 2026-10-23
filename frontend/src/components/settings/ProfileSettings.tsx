import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfileSettings() {
  const { user, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(null); setError(null);
    if (newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("New password and confirmation do not match."); return; }
    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setMessage("Password updated successfully.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not update password."); }
    finally { setSaving(false); }
  }

  return (
    <section className="settings-section">
      <div><h2>Manager profile</h2><p>Account information and password management for the person operating Incident.</p></div>
      <div className="settings-grid">
        <div><label className="settings-label">Name</label><input className="settings-input" value={user?.name || ""} readOnly /></div>
        <div><label className="settings-label">Email</label><input className="settings-input" value={user?.email || ""} readOnly /></div>
        <div><label className="settings-label">Role</label><input className="settings-input" value={user?.role || "MANAGER"} readOnly /></div>
      </div>
      <form onSubmit={submitPassword} className="mt-6 space-y-4 rounded-xl border border-white/8 bg-white/[0.015] p-5">
        <div><h3 className="text-sm font-medium text-white/75">Change password</h3><p className="mt-1 text-xs text-white/35">Validated and updated by the backend.</p></div>
        <label className="block text-xs text-white/45">Current password<input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="settings-input mt-2" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs text-white/45">New password<input type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="settings-input mt-2" /></label>
          <label className="block text-xs text-white/45">Confirm new password<input type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="settings-input mt-2" /></label>
        </div>
        <button disabled={saving} type="submit" className="rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-[#032118] disabled:opacity-40">{saving ? "Updating…" : "Update password"}</button>
        {message && <p role="status" className="text-xs text-emerald-300">{message}</p>}
        {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
      </form>
    </section>
  );
}
