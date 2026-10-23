import { useState, type FormEvent } from "react";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

interface LoginLocationState {
  from?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const locationState =
    location.state as LoginLocationState | null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      const destination = locationState?.from ?? "/";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in.",
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
              SECURE ACCESS
            </div>

            <h2>Welcome back</h2>

            <p>
              Sign in to monitor production and respond to
              incidents.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="auth-label">
                Email
              </label>

              <input
                className="auth-input"
                type="email"
                placeholder="lead@company.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />
            </div>

            <div>
              <label className="auth-label">
                Password
              </label>

              <div className="relative">
                <input
                  className="auth-input pr-12"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
                  className="password-toggle"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
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
              {loading
                ? "Signing in..."
                : "Sign in"}

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span>New to Incident?</span>

            <Link to="/register">
              Create manager account
            </Link>
          </div>
        </div>

        <p className="auth-security">
          Production access is protected by manager
          approval controls.
        </p>
      </div>
    </div>
  );
}
