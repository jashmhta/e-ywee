import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { User, Package, Heart, Settings, LogOut, ChevronRight, Loader2 } from "lucide-react";

type Tab = "orders" | "wishlist" | "profile";



export default function Account() {
  const { user, loading, isAuthenticated, logout, login, register, loginLoading, registerLoading, loginError, registerError } = useAuth();
  const [tab, setTab] = useState<Tab>("orders");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (loading) {
    return (
      <main style={{ minHeight: "60dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "1px solid rgba(26,25,22,0.2)", borderTopColor: "var(--ink)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (!isAuthenticated) {
    const error = authMode === "login" ? loginError : registerError;
    const isLoading = authMode === "login" ? loginLoading : registerLoading;

    const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (authMode === "login") {
          await login(email, password);
        } else {
          await register(email, password, name);
        }
      } catch { /* error handled by hook */ }
    };

    return (
      <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
        <div style={{ maxWidth: "440px", margin: "0 auto", padding: "clamp(64px, 10vw, 128px) clamp(20px, 4vw, 48px)" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--paper-warm)", border: "1px solid rgba(26,25,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
              <User size={24} strokeWidth={1.5} style={{ color: "var(--ink-mute)" }} />
            </div>
            <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "12px" }}>Account</p>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1 }}>
              {authMode === "login" ? "Sign in to your account." : "Create your account."}
            </h1>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(26,25,22,0.12)", marginBottom: "24px" }}>
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => setAuthMode(m)}
                style={{
                  flex: 1, padding: "12px", background: "none", border: "none",
                  borderBottom: `2px solid ${authMode === m ? "var(--ink)" : "transparent"}`,
                  color: authMode === m ? "var(--ink)" : "var(--ink-faint)",
                  fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase",
                  fontFamily: "var(--sans)", cursor: "pointer", transition: "color 0.22s, border-color 0.22s",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(139,26,26,0.06)", border: "1px solid rgba(139,26,26,0.15)", marginBottom: "20px", fontSize: "13px", color: "#8B1A1A" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {authMode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name"
                  style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }} />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters"
                style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }} />
            </div>
            <button type="submit" disabled={isLoading}
              style={{ width: "100%", padding: "16px", background: isLoading ? "var(--ink-soft)" : "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, border: "none", cursor: isLoading ? "default" : "pointer", fontFamily: "var(--sans)", transition: "background 0.22s" }}>
              {isLoading ? "Please wait…" : authMode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--ink-faint)", marginTop: "24px" }}>
            {authMode === "login" ? (
              <>New to ywee? <button onClick={() => setAuthMode("register")} style={{ color: "var(--ink)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "var(--sans)" }}>Create an account</button></>
            ) : (
              <>Already have an account? <button onClick={() => setAuthMode("login")} style={{ color: "var(--ink)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "var(--sans)" }}>Sign in</button></>
            )}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--paper)", minHeight: "100dvh" }}>
      {/* Header */}
      <div style={{ padding: "clamp(32px, 5vw, 56px) clamp(20px, 4vw, 48px) 0", borderBottom: "1px solid rgba(26,25,22,0.08)", maxWidth: "1440px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "8px" }}>Account</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.0 }}>
            Hello, {user?.name?.split(" ")[0] || "friend"}.
          </h1>
          <button
            onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", transition: "color 0.22s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-faint)")}
          >
            <LogOut size={13} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="account-tabs" style={{ gap: "0" }}>
          {([
            { id: "orders" as Tab, label: "Orders", icon: Package },
            { id: "wishlist" as Tab, label: "Wishlist", icon: Heart },
            { id: "profile" as Tab, label: "Profile", icon: Settings },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "12px 20px",
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === id ? "var(--ink)" : "transparent"}`,
                color: tab === id ? "var(--ink)" : "var(--ink-faint)",
                cursor: "pointer",
                fontFamily: "var(--sans)",
                transition: "color 0.22s, border-color 0.22s",
              }}
            >
              <Icon size={13} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(32px, 5vw, 56px) clamp(20px, 4vw, 48px)" }}>
        {tab === "orders" && <OrdersTab />}
        {tab === "wishlist" && <WishlistTab />}
        {tab === "profile" && <ProfileTab user={user} />}
      </div>
    </main>
  );
}

function OrdersTab() {
  const { data: orders, isLoading } = trpc.orders.list.useQuery();

  return (
    <div>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2.4vw, 32px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "24px" }}>
        Order History
      </h2>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
          <Loader2 size={24} strokeWidth={1.5} style={{ color: "var(--ink-faint)", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <Package size={40} strokeWidth={1} style={{ color: "var(--ink-faint)", margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "var(--serif)", fontSize: "20px", fontStyle: "italic", color: "var(--ink-mute)" }}>No orders yet.</p>
          <Link href="/shop" style={{ display: "inline-block", marginTop: "16px", fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "underline" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {orders.map(order => {
            const orderItems = Array.isArray(order.items) ? (order.items as any[]) : [];
            const itemNames = orderItems.map((i: any) => i.name).join(", ");
            return (
              <div
                key={order.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 0",
                  borderBottom: "1px solid rgba(26,25,22,0.08)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink)" }}>{(order as any).orderNumber}</span>
                    <span style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--sage)", background: "rgba(110,122,102,0.12)", padding: "2px 8px" }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--ink-faint)", marginBottom: "4px" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p style={{ fontSize: "13.5px", color: "var(--ink-mute)" }}>{itemNames}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "16px", fontWeight: 400, color: "var(--ink)", marginBottom: "8px" }}>
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </p>
                  <button style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", transition: "color 0.22s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-faint)")}
                  >
                    Details <ChevronRight size={11} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WishlistTab() {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2.4vw, 32px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "24px" }}>
        Wishlist
      </h2>
      <div style={{ textAlign: "center", padding: "64px 0" }}>
        <Heart size={40} strokeWidth={1} style={{ color: "var(--ink-faint)", margin: "0 auto 16px" }} />
        <p style={{ fontFamily: "var(--serif)", fontSize: "20px", fontStyle: "italic", color: "var(--ink-mute)", marginBottom: "8px" }}>
          Your wishlist is empty.
        </p>
        <p style={{ fontSize: "14px", color: "var(--ink-faint)", marginBottom: "20px" }}>
          Save pieces you love to revisit later.
        </p>
        <Link href="/shop" style={{ display: "inline-block", fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "underline" }}>
          Browse the Collection
        </Link>
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: any }) {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ maxWidth: "560px" }}>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2.4vw, 32px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "24px" }}>
        Profile
      </h2>
      <form
        onSubmit={e => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div className="profile-form-row">
          <div>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>First Name</label>
            <input
              defaultValue={user?.name?.split(" ")[0] || ""}
              style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "var(--ink)")}
              onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Last Name</label>
            <input
              defaultValue={user?.name?.split(" ").slice(1).join(" ") || ""}
              style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "var(--ink)")}
              onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
            />
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "6px" }}>Email</label>
          <input
            type="email"
            defaultValue={user?.email || ""}
            style={{ width: "100%", padding: "12px", border: "1px solid rgba(26,25,22,0.18)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontFamily: "var(--sans)", outline: "none" }}
            onFocus={e => (e.target.style.borderColor = "var(--ink)")}
            onBlur={e => (e.target.style.borderColor = "rgba(26,25,22,0.18)")}
          />
        </div>
        <div style={{ height: "1px", background: "rgba(26,25,22,0.08)", margin: "8px 0" }} />
        <div>
          <p style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: "12px" }}>Preferences</p>
          {[
            { label: "New collection announcements", id: "pref-new" },
            { label: "Journal and studio notes", id: "pref-journal" },
            { label: "Member events and previews", id: "pref-events" },
          ].map(({ label, id }) => (
            <label key={id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", cursor: "pointer", fontSize: "14px", color: "var(--ink-soft)" }}>
              <input type="checkbox" defaultChecked id={id} style={{ width: "14px", height: "14px", accentColor: "var(--ink)" }} />
              {label}
            </label>
          ))}
        </div>
        <button
          type="submit"
          style={{ alignSelf: "flex-start", padding: "13px 28px", background: saved ? "var(--sage)" : "var(--ink)", color: "var(--paper)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "var(--sans)", transition: "background 0.4s", marginTop: "8px" }}
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
