import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminNavbar } from "@/components/site/AdminNavbar";
import { AdminFooter } from "@/components/site/AdminFooter";
import {
  useStore, isAdmin, adminLogout, updateBookingStatus, updateTurfAvailability,
  deleteBooking, bookingsToCSV, downloadCSV, setBookingCalled, setHoliday,
  type BookingStatus, type TurfAvailability,
} from "@/lib/booking-store";
import { Download, LogOut, Trash2, TrendingUp } from "lucide-react";

const ADMIN_PWA_HEAD = {
  meta: [{ title: "Admin — TurfPro" }, { name: "description", content: "TurfPro admin dashboard for live booking updates and turf availability management." }],
  links: [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "icon", href: "/icon-192.png", type: "image/png" },
    { rel: "apple-touch-icon", href: "/icon-192.png" },
  ],
  scripts: [
    { children: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}` },
  ],
};

export const Route = createFileRoute("/admin/")({
  head: () => ADMIN_PWA_HEAD,
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { bookings, turfs, holiday } = useStore();
  const [holidayMessage, setHolidayMessage] = useState(holiday.message);
  const [holidayActive, setHolidayActive] = useState(holiday.active);

  useEffect(() => {
    if (!isAdmin()) navigate({ to: "/admin/login" });
  }, [navigate]);

  useEffect(() => {
    setHolidayMessage(holiday.message);
    setHolidayActive(holiday.active);
  }, [holiday.message, holiday.active]);

  const revenue = useMemo(() => computeRevenue(bookings), [bookings]);

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold">Admin dashboard</h1>
            <p className="text-sm text-muted-foreground">Live bookings, turf availability and revenue.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => downloadCSV(`turfpro-bookings-${new Date().toISOString().slice(0,10)}.csv`, bookingsToCSV(bookings))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)]"
            >
              <Download className="size-4" /> Export to Google Sheets (CSV)
            </button>
            <button onClick={() => { adminLogout(); navigate({ to: "/admin/login" }); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-sm hover:neon-border transition">
              <LogOut className="size-4" /> Logout
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] mt-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <RevenueCard label="Today" value={revenue.today} />
            <RevenueCard label="This month" value={revenue.month} />
            <RevenueCard label="This year" value={revenue.year} />
          </div>

          <div className="glass-card rounded-3xl p-6 border border-border">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Holiday mode</h2>
                <p className="text-sm text-muted-foreground">Mark the app as holiday and share the notice with customers.</p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={holidayActive} onChange={(e) => setHolidayActive(e.target.checked)} className="h-4 w-4 rounded border-border bg-surface text-primary" />
                Active
              </label>
            </div>
            <textarea
              value={holidayMessage}
              onChange={(e) => setHolidayMessage(e.target.value)}
              rows={4}
              className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Add a holiday announcement like 'Closed for Pongal'"
            />
            <button
              onClick={() => setHoliday(holidayActive, holidayMessage)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Save announcement
            </button>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold flex items-center gap-2"><span className="size-2 rounded-full bg-success animate-pulse" /> Live bookings ({bookings.length})</h2>
          <div className="mt-4 glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface text-xs uppercase text-muted-foreground">
                  <tr>
                    {["When", "Customer", "Turf", "Sport", "Batch", "Players", "Price", "Status", "Called", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No bookings yet. Submit one from the user site to see it here in real time.</td></tr>
                  )}
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-4 py-3 whitespace-nowrap">{formatDT(b.datetime)}</td>
                      <td className="px-4 py-3">{b.name}<div className="text-xs text-muted-foreground">{b.phone}</div></td>
                      <td className="px-4 py-3">{b.turf}</td>
                      <td className="px-4 py-3">{b.sport}</td>
                      <td className="px-4 py-3 capitalize">{b.batch}</td>
                      <td className="px-4 py-3">{b.players}</td>
                      <td className="px-4 py-3">₹{b.price}</td>
                      <td className="px-4 py-3">
                        <select value={b.status} onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)} className={`text-xs rounded-lg px-2 py-1 border border-border bg-surface ${statusColor(b.status)}`}>
                          <option value="pending">Pending</option>
                          <option value="booked">Booked</option>
                          <option value="waiting">Waiting</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                          <input type="checkbox" checked={b.called} onChange={(e) => setBookingCalled(b.id, e.target.checked)} className="h-4 w-4 rounded border-border bg-surface text-primary" />
                          {b.called ? "Yes" : "No"}
                        </label>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => updateBookingStatus(b.id, "canceled")} className="rounded-lg border border-destructive px-2 py-1 text-xs text-destructive hover:bg-destructive/10">Cancel</button>
                        <button onClick={() => deleteBooking(b.id)} className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Turfs availability */}
        <section className="mt-10">
          <h2 className="text-xl font-bold">Turf availability</h2>
          <p className="text-sm text-muted-foreground">Changes here update the user site instantly.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {turfs.map((t) => (
              <div key={t.id} className="glass-card rounded-2xl p-5">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.sport} · {t.location}</div>
                <div className="mt-3 flex gap-2">
                  {(["available", "pending", "unavailable"] as TurfAvailability[]).map((a) => (
                    <button key={a} onClick={() => updateTurfAvailability(t.id, a)} className={`flex-1 text-xs px-2 py-1.5 rounded-lg capitalize border ${t.availability === a ? "border-primary text-primary-glow bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 text-xs text-muted-foreground">
          Tip: open <Link to="/" className="text-primary-glow underline">the user site</Link> in another tab — bookings and availability sync live.
        </div>
      </main>
      <AdminFooter />
    </div>
  );
}

function RevenueCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <TrendingUp className="size-4 text-primary-glow" />
      </div>
      <div className="text-3xl font-bold mt-2">₹{value.toLocaleString("en-IN")}</div>
    </div>
  );
}

function computeRevenue(bookings: { price: number; createdAt: string; status: BookingStatus }[]) {
  const now = new Date();
  const sum = (pred: (d: Date) => boolean) => bookings
    .filter((b) => b.status === "booked" && pred(new Date(b.createdAt)))
    .reduce((a, b) => a + b.price, 0);

  return {
    today: sum((d) => d.toDateString() === now.toDateString()),
    month: sum((d) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()),
    year: sum((d) => d.getFullYear() === now.getFullYear()),
  };
}

function statusColor(s: BookingStatus) {
  return s === "booked" ? "text-success" : s === "waiting" ? "text-warning" : s === "canceled" ? "text-destructive" : "text-muted-foreground";
}

function formatDT(iso: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
  catch { return iso; }
}
