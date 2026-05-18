import logoImg from "@/assets/logo-brand.png";
import { Link } from "@tanstack/react-router";

export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/90 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link to="/admin" className="flex items-center gap-2 group">
          <img src={logoImg} alt="Sports Pitch" className="h-7 w-auto max-h-7 sm:h-8 sm:max-h-8 object-contain object-left" />
          <span className="font-bold text-lg tracking-tight">TurfPro Admin</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/admin" className="hover:text-foreground transition">Dashboard</Link>
          <Link to="/admin/portal" className="hover:text-foreground transition">Portal</Link>
          <Link to="/" className="hover:text-foreground transition">Customer site</Link>
        </nav>
      </div>
    </header>
  );
}
