import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import "./SignUpPage.css";

function SignUpPage() {
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreeToTerms) {
      alert("You must agree to the terms and conditions");
      return;
    }
    signIn();
  };

  const handleSocial = (_provider: string) => {
    signIn();
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero-top">
          <span className="auth-eyebrow">Get started</span>
          <h2 className="auth-title">
            Create your account and start organizing.
          </h2>
        </div>
        <p className="auth-subtitle">
          Join thousands of teams who trust our platform to manage their tasks
          and projects efficiently.
        </p>
        <div className="auth-metrics">
          <div>
            <p className="metric-label">Users</p>
            <p className="metric-value">50K+</p>
          </div>
          <div>
            <p className="metric-label">Free tier</p>
            <p className="metric-value">No card</p>
          </div>
          <div>
            <p className="metric-label">Setup time</p>
            <p className="metric-value">2 mins</p>
          </div>
        </div>
      </section>

      <section className="auth-card" aria-label="Sign up form">
        <div className="auth-card-header">
          <h3>Create account</h3>
          <p>Build your productivity workspace now.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Full Name</span>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              required
            />
          </label>
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
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <label className="auth-field">
            <span>Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label className="auth-checkbox">
            <input
              type="checkbox"
              name="agree"
              checked={agreeToTerms}
              onChange={(event) => setAgreeToTerms(event.target.checked)}
              required
            />
            <span>
              I agree to the{" "}
              <button type="button" className="auth-link">
                terms of service
              </button>
            </span>
          </label>

          <button type="submit" className="auth-submit">
            Create account
          </button>
        </form>

        <div className="auth-divider">
          <span>Or sign up with</span>
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
          Already have an account?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={() => (window.location.href = "/signin")}
          >
            Sign in
          </button>
        </p>
      </section>
    </div>
  );
}

export default SignUpPage;
