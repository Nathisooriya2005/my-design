import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const EVENTS = [
  { id: "match-1", name: "Weekend Cricket Meetup", location: "Chennai", sport: "Cricket", date: "Sat, 9:00 AM", players: "10/12" },
  { id: "match-2", name: "Evening Football Pickup", location: "Coimbatore", sport: "Football", date: "Fri, 6:30 PM", players: "8/10" },
  { id: "match-3", name: "Badminton Singles Mixer", location: "Madurai", sport: "Badminton", date: "Sun, 4:00 PM", players: "4/6" },
];

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Nearby sports events — TurfPro" }, { name: "description", content: "Join nearby sports events and find co-players for your next game." }] }),
  component: EventsPage,
});

function EventsPage() {
  const [joined, setJoined] = useState<string[]>([]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Nearby sports events</h1>
          <p className="text-muted-foreground mt-2">Join a match, find a co-player, or create your own local event.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {EVENTS.map((event) => (
            <div key={event.id} className="glass-card rounded-3xl p-6 border border-border">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{event.name}</h2>
                  <div className="text-xs text-muted-foreground mt-1">{event.location} · {event.sport}</div>
                </div>
                <div className="text-sm text-muted-foreground">{event.players}</div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">{event.date}</div>
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => setJoined((current) => current.includes(event.id) ? current : [...current, event.id])}
                  disabled={joined.includes(event.id)}
                  className="rounded-xl bg-gradient-to-r from-primary to-primary-glow px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {joined.includes(event.id) ? "Joined" : "Join event"}
                </button>
                <Link to="/turfs" className="rounded-xl border border-border px-4 py-3 text-sm text-center hover:border-primary hover:text-primary transition">
                  Find a co-player
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
