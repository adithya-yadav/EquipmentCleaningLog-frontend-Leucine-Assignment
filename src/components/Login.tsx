import { useState } from "react";
import { api } from "../services/api";

type Props = { onLogin: (token: string, username: string) => void };

export function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("demo-password");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await api.post<{ token: string; user: { username: string } }>(
        "/auth/login",
        { username, password }
      );
      onLogin(response.data.token, response.data.user.username);
    } catch {
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <p className="eyebrow">Quality management system</p>
        <h1>Equipment Cleaning Log</h1>
        <p className="login-copy">Sign in to review cleaning activity and audit history.</p>
        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="login-error" role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button>
        <small>Demo account: admin / demo-password</small>
      </form>
    </main>
  );
}