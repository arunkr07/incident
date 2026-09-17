import { useState } from "react";

export default function ApprovalSettings() {
  const [approval, setApproval] = useState(true);
  const [highRiskOnly, setHighRiskOnly] = useState(false);

  return (
    <section className="settings-section">
      <div>
        <h2>Production approvals</h2>
        <p>
          Control whether AI-proposed production changes require manager
          authorization.
        </p>
      </div>

      <div className="settings-options">
        <label className="settings-option">
          <div>
            <p>Require manager approval</p>
            <span>
              AI cannot execute production-changing remediation without
              authorization.
            </span>
          </div>

          <input
            type="checkbox"
            checked={approval}
            onChange={() => setApproval((value) => !value)}
          />
        </label>

        <label className="settings-option">
          <div>
            <p>Approval only for high-risk actions</p>
            <span>
              Lower-risk operations may follow a separate execution policy.
            </span>
          </div>

          <input
            type="checkbox"
            checked={highRiskOnly}
            onChange={() =>
              setHighRiskOnly((value) => !value)
            }
          />
        </label>
      </div>
    </section>
  );
}