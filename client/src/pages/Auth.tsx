import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { login, register, loginLoading, registerLoading, loginError, registerError, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (isAuthenticated) {
    navigate("/account");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate("/account");
    } catch {
      // error is handled by the hook
    }
  };

  const error = mode === "login" ? loginError : registerError;
  const isLoading = mode === "login" ? loginLoading : registerLoading;

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: "440px", margin: "0 auto", padding: "clamp(64px, 10vw, 128px) clamp(20px, 4vw, 48px)" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: "28px", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", textDecoration: "none" }}>
            y<strong style={{ fontWeight: 600, fontStyle: "normal" }}>w</strong>ee
          </Link>
          <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "8px" }}>
            Girls' Stretch Denim
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(26,25,22,0.12)", marginBottom: "32px" }}>
          {(["login", "register"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "14px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${mode === m ? "var(--ink)" : "transparent"}`,
                color: mode === m ? "var(--ink)" : "var(--ink-faint)",
                fontSize: "12px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                fontFamily: "var(--sans)",
                cursor: "pointer",
                transition: "color 0.22s, border-color 0.22s",
              }}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(139,26,26,0.06)", border: "1px solid rgba(139,26,26,0.15)", marginBottom: "20px", fontSize: "13px", color: "#8B1A1A" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "register" && (
            <div>
              <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Your name"
                style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none", transition: "border-color 0.22s" }}
                onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
              />
            </div>
          )}
          <div>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none", transition: "border-color 0.22s" }}
              onFocus={e => (e.target.style.borderColor = "var(--ink)")}
              onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none", transition: "border-color 0.22s" }}
              onFocus={e => (e.target.style.borderColor = "var(--ink)")}
              onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              background: isLoading ? "var(--ink-soft)" : "var(--ink)",
              color: "var(--paper)",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 500,
              border: "none",
              cursor: isLoading ? "default" : "pointer",
              fontFamily: "var(--sans)",
              transition: "background 0.22s",
              marginTop: "8px",
            }}
          >
            {isLoading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Switch mode */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--ink-faint)", marginTop: "24px" }}>
          {mode === "login" ? (
            <>
              New to ywee?{" "}
              <button onClick={() => setMode("register")} style={{ color: "var(--ink)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "var(--sans)" }}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} style={{ color: "var(--ink)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "var(--sans)" }}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
