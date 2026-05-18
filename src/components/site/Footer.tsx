import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo-brand.png";

const product = [
  { label: "Turfs", to: "/turfs" as const },
  { label: "Sports", to: "/sports" as const },
  { label: "About", to: "/about" as const },
  { label: "Sign in", to: "/login" as const },
];
const company = [
  { label: "Home", to: "/" as const },
  { label: "Turfs", to: "/turfs" as const },
  { label: "Customer portal", to: "/customer" as const },
  { label: "Admin", to: "/admin/login" as const },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt="Sports Pitch" className="h-7 w-auto max-h-7 object-contain object-left" />
            </Link>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs">
              Tamil Nadu's premium platform for booking sports turfs in real-time.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3">Product</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {product.map((i) => (
                <li key={i.label}><Link to={i.to} className="hover:text-foreground transition">{i.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3">Company</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {company.map((i) => (
                <li key={i.label}><Link to={i.to} className="hover:text-foreground transition">{i.label}</Link></li>
              ))}
            </ul>
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
