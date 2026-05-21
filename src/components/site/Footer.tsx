import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo-brand.png";

export function Footer() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt="Sports Pitch" className="h-7 w-auto max-h-7 object-contain object-left" />
            </Link>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs">
              Tamil Nadu's premium platform for booking sports turfs in real-time.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground flex justify-between flex-wrap gap-2">
          <div>© 2026 TurfPro. All rights reserved.</div>
          <div>Made for players, in Tamil Nadu.</div>
        </div>
      </div>
    </footer>
  );
}
