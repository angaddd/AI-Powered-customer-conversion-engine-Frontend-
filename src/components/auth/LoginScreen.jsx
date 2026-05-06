import React, { useState } from "react";
import { Bot } from "lucide-react";
import { request } from "../../lib/api.js";

export function LoginScreen({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
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
        <h1>Sign in to your CRM</h1>
        <p>Use the tenant account created by `bootstrap_tenant`. The dashboard only reads authenticated company data.</p>
        <form onSubmit={submit}>
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="admin" autoComplete="username" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
          </label>
          {error && <div className="error">{error}</div>}
          <button disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <button className="link-button" onClick={onShowRegister}>Create one</button>
        </p>
      </section>
    </main>
  );
}
