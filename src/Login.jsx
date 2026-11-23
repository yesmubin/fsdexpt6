import { useState } from "react";
import { api } from "./api";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  function switchMode() {
    setMode(isRegister ? "login" : "register");
    setName("");
    setPassword("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // Frontend mirrors the backend rules so users get instant feedback.
    if (isRegister && name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      if (isRegister) {
        await api("/auth/register", {
          method: "POST",
          body: {
            name: name.trim(),
            email: email.trim(),
            password,
          },
        });
      }

      // Register does not return a token, so sign in afterwards.
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Course Management</h1>
        <p className="muted">
          {isRegister ? "Create your account" : "Sign in to continue"}
        </p>

        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
              />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@college.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder={isRegister ? "At least 8 characters" : "Your password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />

          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting
                ? isRegister
                  ? "Creating account..."
                  : "Signing in..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </div>
        </form>

        <p className="login-switch">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button type="button" className="link-button" onClick={switchMode}>
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </p>

        {!isRegister && (
          <div className="login-hint">
            <strong>Demo accounts</strong>
            <p>admin@college.com / pass@123</p>
            <p>student@college.com / pass@123</p>
          </div>
        )}
      </div>
    </div>
  );
}