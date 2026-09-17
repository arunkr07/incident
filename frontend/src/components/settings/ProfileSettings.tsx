import { useAuth } from "../context/AuthContext";

export default function ProfileSettings() {
  const { user } = useAuth();

  return (
    <section className="settings-section">
      <div>
        <h2>Manager profile</h2>
        <p>
          Account information for the person operating Incident.
        </p>
      </div>

      <div className="settings-grid">
        <div>
          <label className="settings-label">Name</label>
          <input
            className="settings-input"
            value={user?.name || ""}
            readOnly
          />
        </div>

        <div>
          <label className="settings-label">Email</label>
          <input
            className="settings-input"
            value={user?.email || ""}
            readOnly
          />
        </div>

        <div>
          <label className="settings-label">Role</label>
          <input
            className="settings-input"
            value="Manager"
            readOnly
          />
        </div>
      </div>
    </section>
  );
}