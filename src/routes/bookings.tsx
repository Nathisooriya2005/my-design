import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useStore, updateBookingStatus } from "@/lib/booking-store";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "My bookings — TurfPro" }, { name: "description", content: "Check your booking status and cancel if needed." }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const { bookings, holiday } = useStore();
  const hasBookings = bookings.length > 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My bookings</h1>
          <p className="text-muted-foreground mt-2">See your status, cancel bookings, and open venue locations on Google Maps.</p>
        </div>

        {holiday.active && (
          <div className="rounded-3xl border border-warning/40 bg-warning/10 p-5 text-warning">
            <div className="font-semibold">Holiday notice</div>
            <p className="mt-2 text-sm">{holiday.message || "The platform is currently marked as holiday."}</p>
          </div>
        )}

        {!hasBookings ? (
          <div className="mt-10 glass-card rounded-3xl p-10 text-center">
            <p className="text-lg font-semibold">No bookings yet.</p>
            <p className="text-muted-foreground mt-2">Browse nearby venues to make your first reservation.</p>
            <Link to="/turfs" className="inline-flex mt-5 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
              Browse turfs
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-card rounded-3xl p-5 border border-border">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{booking.turf}</h2>
                    <div className="text-sm text-muted-foreground mt-1">{booking.sport} · {booking.batch} batch</div>
                    <div className="text-sm text-muted-foreground mt-1">Preferred location: {booking.preferredLocation || booking.turf}</div>
                    {booking.dealNotes && <div className="text-sm text-muted-foreground mt-1">Request: {booking.dealNotes}</div>}
                    <div className="text-sm text-muted-foreground mt-1">Booked for: {formatDT(booking.datetime)}</div>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide ${statusStyle(booking.status)}`}>{booking.status}</span>
                    <span className="text-sm text-muted-foreground">₹{booking.price}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    Booking ID: {booking.id}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(booking.turf)}`} target="_blank" rel="noreferrer" className="text-sm rounded-xl border border-border px-4 py-2 hover:border-primary hover:text-primary transition">
                      Open Google Maps
                    </a>
                    <button
                      onClick={() => updateBookingStatus(booking.id, "canceled")}
                      disabled={booking.status === "canceled"}
                      className="rounded-xl border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-40"
                    >
                      Cancel booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function statusStyle(status: string) {
  if (status === "booked") return "bg-success/10 text-success";
  if (status === "pending") return "bg-warning/10 text-warning";
  if (status === "waiting") return "bg-amber-100 text-amber-800";
  return "bg-destructive/10 text-destructive";
}

function formatDT(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}
