import React, { useState } from "react";
import { Bot } from "lucide-react";
import { request } from "../../lib/api.js";

export function RegisterScreen({ onLogin, onShowLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await request("/auth/register/", "", {
        method: "POST",
        body: JSON.stringify({ username, email, password, password2 })
      });
      const auth = await request("/auth/login/", "", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      localStorage.setItem("crm_access", auth.access);
      localStorage.setItem("crm_refresh", auth.refresh);
      onLogin(auth.access);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand large"><Bot /> ConvertIQ</div>
        <h1>Create your account</h1>
        <p>Join ConvertIQ to start managing your customer relationships.</p>
        <form onSubmit={submit}>
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="johndoe" autoComplete="username" required />
          </label>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="john@example.com" autoComplete="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="new-password" required />
          </label>
          <label>
            Confirm Password
            <input value={password2} onChange={(event) => setPassword2(event.target.value)} type="password" autoComplete="new-password" required />
          </label>
          {error && <div className="error">{error}</div>}
          <button disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
        </form>
        <p className="auth-switch">
          Already have an account? <button className="link-button" onClick={onShowLogin}>Sign in</button>
        </p>
      </section>
    </main>
  );
}
