import { useState, type FormEvent } from "react";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-glow auth-glow-one" />
        <div className="auth-glow auth-glow-two" />
      </div>

      <div className="auth-grid" />

      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-mark-large">
            <Activity size={23} />
          </div>

          <div>
            <h1>Incident</h1>
            <p>PRODUCTION RESPONSE</p>
          </div>
        </div>

        <div className="auth-card">
          <div className="mb-8">
            <div className="auth-eyebrow">
              <ShieldCheck size={14} />
              MANAGER ACCESS
            </div>

            <h2>Create account</h2>

            <p>
              Set up the manager account used to operate Incident.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="auth-label">Name</label>

              <input
                className="auth-input"
                type="text"
                placeholder="Team Lead"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div>
              <label className="auth-label">Email</label>

              <input
                className="auth-input"
                type="email"
                placeholder="lead@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <label className="auth-label">Password</label>

              <div className="relative">
                <input
                  className="auth-input pr-12"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="password-toggle"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="auth-label">Confirm password</label>

              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
              />
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? "Creating account..." : "Create account"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>

            <Link to="/login">Sign in</Link>
          </div>
        </div>

        <p className="auth-security">
          One manager controls production-changing actions.
        </p>
      </div>
    </div>
  );
}