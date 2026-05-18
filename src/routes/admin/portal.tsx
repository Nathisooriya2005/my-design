import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminNavbar } from "@/components/site/AdminNavbar";
import { AdminFooter } from "@/components/site/AdminFooter";
import { isAdmin } from "@/lib/booking-store";

const ADMIN_PWA_HEAD = {
  meta: [{ title: "Admin Portal — TurfPro" }, { name: "description", content: "Admin portal for TurfPro. View booking activity and manage turf availability." }],
  links: [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "icon", href: "/icon-192.png", type: "image/png" },
    { rel: "apple-touch-icon", href: "/icon-192.png" },
  ],
  scripts: [
    { children: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}` },
  ],
};

export const Route = createFileRoute("/admin/portal")({
  head: () => ADMIN_PWA_HEAD,
  component: AdminPortal,
});

function AdminPortal() {
  const loggedIn = isAdmin();

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card rounded-3xl p-10 border border-border">
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground mt-3">
            This page is the separate TurfPro admin portal. Only admin users should access it.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link to={loggedIn ? "/admin" : "/admin/login"} className="rounded-2xl bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground text-center">
              {loggedIn ? "Go to Dashboard" : "Admin sign in"}
            </Link>
            <Link to="/" className="rounded-2xl border border-border px-5 py-4 text-sm text-foreground text-center hover:border-primary">
              Open Customer site
            </Link>
          </div>
        </div>
      </main>
      <AdminFooter />
    </div>
  );
}
