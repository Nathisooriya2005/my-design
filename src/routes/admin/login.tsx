import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminNavbar } from "@/components/site/AdminNavbar";
import { AdminFooter } from "@/components/site/AdminFooter";
import { adminLogin, ADMIN_CREDS } from "@/lib/booking-store";
import { ShieldCheck } from "lucide-react";

const ADMIN_PWA_HEAD = {
  meta: [{ title: "Admin login — TurfPro" }, { name: "description", content: "Admin login page for TurfPro. Secure admin portal access." }],
  links: [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "icon", href: "/icon-192.png", type: "image/png" },
    { rel: "apple-touch-icon", href: "/icon-192.png" },
  ],
  scripts: [
    { children: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}` },
  ],
};

export const Route = createFileRoute("/admin/login")({
  head: () => ADMIN_PWA_HEAD,
  component: AdminLogin,
});

function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(id, password)) navigate({ to: "/admin" });
    else setErr("Invalid admin credentials.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 grid place-items-center px-4 py-12">
        <form onSubmit={onSubmit} className="w-full max-w-md glass-card neon-border rounded-2xl p-8">
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center mb-4">
            <ShieldCheck className="size-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Admin login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Demo credentials — id: <code className="text-primary-glow">{ADMIN_CREDS.id}</code>, password: <code className="text-primary-glow">{ADMIN_CREDS.password}</code>
          </p>

          <div className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">Admin ID</span>
              <input value={id} onChange={(e) => setId(e.target.value)} required className="mt-1 w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">Password</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            {err && <div className="text-xs text-destructive">{err}</div>}
            <button type="submit" className="w-full mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-[var(--shadow-glow)]">
              Sign in to admin
            </button>
          </div>
        </form>
      </main>
      <AdminFooter />
    </div>
  );
}
