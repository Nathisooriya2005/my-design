import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { useStore, type Turf } from "@/lib/booking-store";
import { BookingModal } from "@/components/site/BookingModal";
import { MapPin, Search } from "lucide-react";

export const Route = createFileRoute("/turfs")({
  head: () => ({ meta: [{ title: "Browse Turfs — TurfPro" }, { name: "description", content: "Browse and book sports turfs across Tamil Nadu." }] }),
  component: TurfsPage,
});

function TurfsPage() {
  const { turfs } = useStore();
  const [q, setQ] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [active, setActive] = useState<Turf | null>(null);

  const locations = useMemo(() => Array.from(new Set(turfs.map((t) => t.location))), [turfs]);

  const filtered = turfs.filter((t) => {
    const textMatch = [t.name, t.location, t.sport].join(" ").toLowerCase().includes(q.toLowerCase());
    const locationMatch = preferredLocation ? t.location === preferredLocation : true;
    return textMatch && locationMatch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Browse <span className="text-gradient">nearby venues</span></h1>
            <p className="text-muted-foreground mt-2">Search by turf, city, sport and preferred location.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] items-end">
            <div className="glass-card rounded-2xl p-4 flex items-center gap-2">
              <Search className="size-4 ml-2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city or sport…" className="bg-transparent outline-none text-sm w-full py-2" />
            </div>
            <label className="glass-card rounded-2xl p-4 flex flex-col gap-2 text-sm">
              <span className="text-xs text-muted-foreground">Preferred location</span>
              <select value={preferredLocation} onChange={(e) => setPreferredLocation(e.target.value)} className="bg-transparent border border-border rounded-xl px-3 py-2 text-sm outline-none">
                <option value="">Any city</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/bookings" className="px-4 py-3 rounded-xl glass-card hover:neon-border transition font-medium">
              My bookings
            </Link>
            <Link to="/events" className="px-4 py-3 rounded-xl glass-card hover:neon-border transition font-medium">
              Find a co-player
            </Link>
            <Link to="/events" className="px-4 py-3 rounded-xl glass-card hover:neon-border transition font-medium">
              Join nearby events
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map((t) => (
            <article key={t.id} className="glass-card rounded-2xl p-5 hover:neon-border transition">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lg">{t.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="size-3" /> {t.location}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-muted/20 text-muted-foreground">
                  Locked
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">{t.sport}</div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-bold">₹{t.price}<span className="text-xs text-muted-foreground font-normal">/hr</span></div>
                  <button onClick={() => setActive(t)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
                    Book now
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">All customer bookings start locked. Fill in request details after clicking Book now.</div>
              </div>
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(t.location)}`} target="_blank" rel="noreferrer" className="block mt-3 text-xs font-medium text-primary-glow hover:underline">
                Open location in Google Maps
              </a>
            </article>
          ))}
          {!filtered.length && <div className="text-muted-foreground col-span-full text-center py-12">No turfs match your filters.</div>}
        </div>
      </main>
      <BookingModal turf={active} onClose={() => setActive(null)} />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
