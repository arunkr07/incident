import { useState } from "react";

export default function DetectionSettings() {
  const [errorRate, setErrorRate] = useState(5);
  const [latency, setLatency] = useState(1000);
  const [window, setWindow] = useState(5);
  const [automatic, setAutomatic] = useState(true);

  return (
    <section className="settings-section">
      <div>
        <h2>Detection rules</h2>
        <p>
          Configure the thresholds used by the production detection engine.
        </p>
      </div>

      <div className="settings-grid">
        <div>
          <label className="settings-label">
            Error rate threshold (%)
          </label>

          <input
            className="settings-input"
            type="number"
            value={errorRate}
            onChange={(event) =>
              setErrorRate(Number(event.target.value))
            }
          />
        </div>

        <div>
          <label className="settings-label">
            Latency threshold (ms)
          </label>

          <input
            className="settings-input"
            type="number"
            value={latency}
            onChange={(event) =>
              setLatency(Number(event.target.value))
            }
          />
        </div>

        <div>
          <label className="settings-label">
            Evaluation window (minutes)
          </label>

          <input
            className="settings-input"
            type="number"
            value={window}
            onChange={(event) =>
              setWindow(Number(event.target.value))
            }
          />
        </div>
      </div>

      <label className="settings-option mt-4">
        <div>
          <p>Automatic incident creation</p>
          <span>
            Create an incident when configured detection rules are triggered.
          </span>
        </div>

        <input
          type="checkbox"
          checked={automatic}
          onChange={() => setAutomatic((value) => !value)}
        />
      </label>
    </section>
  );
}