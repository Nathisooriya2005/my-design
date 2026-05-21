import { Link } from "@tanstack/react-router";

export function AdminFooter() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>© 2026 Sports spitch Admin. All rights reserved.</div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin" className="hover:text-foreground transition">Dashboard</Link>
          <Link to="/admin/portal" className="hover:text-foreground transition">Portal</Link>
          <Link to="/" className="hover:text-foreground transition">Customer site</Link>
        </div>
      </div>
    </footer>
  );
}
