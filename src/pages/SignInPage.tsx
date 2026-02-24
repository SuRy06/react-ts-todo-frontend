import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import "./SignInPage.css";

function SignInPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn();
  };

  const handleSocial = (_provider: string) => {
    signIn();
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero-top">
          <span className="auth-eyebrow">Secure workspace</span>
          <h2 className="auth-title">
            Bring every task into focus with one clean sign-in.
          </h2>
        </div>
        <p className="auth-subtitle">
          Keep your projects, checklists, and team notes in one calm space.
          Choose a basic login or sign in with your company SSO.
        </p>
        <div className="auth-metrics">
          <div>
            <p className="metric-label">Trusted by</p>
            <p className="metric-value">120+ teams</p>
          </div>
          <div>
            <p className="metric-label">Uptime</p>
            <p className="metric-value">99.98%</p>
          </div>
          <div>
            <p className="metric-label">Avg. sign-in</p>
            <p className="metric-value">3.4s</p>
          </div>
        </div>
      </section>

      <section className="auth-card" aria-label="Sign in form">
        <div className="auth-card-header">
          <h3>Welcome back</h3>
          <p>Sign in to keep your tasks moving forward.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <div className="auth-row">
            <label className="auth-checkbox">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <button type="button" className="auth-link">
              Forgot password?
            </button>
          </div>

          <div className="auth-actions">
            <button type="submit" className="auth-submit">
              Sign in
            </button>
          </div>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="auth-social">
          <button
            type="button"
            onClick={() => handleSocial("google")}
            className="social-btn google"
          >
            <span className="social-icon">G</span>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocial("microsoft")}
            className="social-btn microsoft"
          >
            <span className="social-icon">M</span>
            Microsoft
          </button>
          <button
            type="button"
            onClick={() => handleSocial("github")}
            className="social-btn github"
          >
            <span className="social-icon">GH</span>
            GitHub
          </button>
          <button
            type="button"
            onClick={() => handleSocial("okta")}
            className="social-btn okta"
          >
            <span className="social-icon">O</span>
            Okta SSO
          </button>
        </div>

        <p className="auth-foot">
          New here?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={() => (window.location.href = "/signup")}
          >
            Create an account
          </button>
        </p>
      </section>
    </div>
  );
}

export default SignInPage;
