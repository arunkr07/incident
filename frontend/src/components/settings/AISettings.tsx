import { useState } from "react";

export default function AISettings() {
  const [enabled, setEnabled] = useState(true);
  const [logs, setLogs] = useState(true);
  const [metrics, setMetrics] = useState(true);
  const [deployments, setDeployments] = useState(true);
  const [dependencies, setDependencies] = useState(true);

  return (
    <section className="settings-section">
      <div>
        <h2>AI investigation</h2>
        <p>
          Configure which production context can be supplied to the AI
          investigation workflow.
        </p>
      </div>

      <div className="settings-options">
        <label className="settings-option">
          <div>
            <p>AI investigation enabled</p>
            <span>
              Allow the manager to start AI-powered investigations.
            </span>
          </div>

          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled((value) => !value)}
          />
        </label>

        <label className="settings-option">
          <div>
            <p>Include logs</p>
            <span>Provide relevant logs to the investigation.</span>
          </div>

          <input
            type="checkbox"
            checked={logs}
            onChange={() => setLogs((value) => !value)}
          />
        </label>

        <label className="settings-option">
          <div>
            <p>Include metrics</p>
            <span>Provide relevant metric history.</span>
          </div>

          <input
            type="checkbox"
            checked={metrics}
            onChange={() => setMetrics((value) => !value)}
          />
        </label>

        <label className="settings-option">
          <div>
            <p>Include deployments</p>
            <span>Correlate recent deployment activity.</span>
          </div>

          <input
            type="checkbox"
            checked={deployments}
            onChange={() =>
              setDeployments((value) => !value)
            }
          />
        </label>

        <label className="settings-option">
          <div>
            <p>Include dependencies</p>
            <span>Analyze affected dependency relationships.</span>
          </div>

          <input
            type="checkbox"
            checked={dependencies}
            onChange={() =>
              setDependencies((value) => !value)
            }
          />
        </label>
      </div>
    </section>
  );
}