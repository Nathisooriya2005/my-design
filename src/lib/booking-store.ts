// Local booking store — synced across tabs via storage events.
// User bookings + turf availability flow through here so the admin page reflects changes live.
import { useSyncExternalStore } from "react";

export type BookingStatus = "pending" | "booked" | "waiting" | "canceled";
export type TurfAvailability = "available" | "pending" | "unavailable";
export type TimeBatch = "morning" | "afternoon" | "evening" | "night";

export interface Booking {
  id: string;
  name: string;
  phone: string;
  turf: string;
  sport: string;
  datetime: string; // ISO
  players: number;
  price: number;
  status: BookingStatus;
  createdAt: string;
  batch: TimeBatch;
  preferredLocation: string;
  dealNotes: string;
  called: boolean;
}

export interface Turf {
  id: string;
  name: string;
  location: string;
  sport: string;
  price: number;
  availability: TurfAvailability;
}

interface HolidayNote {
  active: boolean;
  message: string;
}

interface State {
  bookings: Booking[];
  turfs: Turf[];
  holiday: HolidayNote;
}

const KEY = "turfpro:store:v1";

const DEFAULT_TURFS: Turf[] = [
  { id: "velocity", name: "Velocity Sports Arena", location: "Chennimalai", sport: "Football · 5-a-side", price: 1200, availability: "available" },
  { id: "boundary", name: "Boundary Box Cricket", location: "Chennimalai", sport: "Box Cricket", price: 900, availability: "available" },
  { id: "champions", name: "Champions Turf Club", location: "Chennimalai", sport: "Cricket · Pitch", price: 1500, availability: "available" },
  { id: "kabaddi-arena", name: "Madurai Kabaddi Arena", location: "Chennimalai", sport: "Kabaddi", price: 700, availability: "available" },
  { id: "smash-court", name: "Smash Badminton Court", location: "Chennimalai", sport: "Badminton", price: 500, availability: "pending" },
  { id: "dojo", name: "Tiger Karate Dojo", location: "Chennimalai", sport: "Karate", price: 600, availability: "available" },
];

const DEFAULT_STATE: State = {
  bookings: [],
  turfs: DEFAULT_TURFS,
  holiday: { active: false, message: "" },
};

let state: State = load();
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>;
      return {
        bookings: parsed.bookings ?? [],
        turfs: parsed.turfs?.length ? parsed.turfs : DEFAULT_TURFS,
        holiday: parsed.holiday ?? DEFAULT_STATE.holiday,
      };
    }
  } catch { /* ignore */ }
  return DEFAULT_STATE;
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function emit() {
  persist();
  console.log("[booking-store] emit called, listeners:", listeners.size);
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      console.log("[booking-store] storage event detected, reloading state");
      state = load();
      console.log("[booking-store] notifying listeners:", listeners.size);
      listeners.forEach((l) => l());
    }
  });
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function getSnapshot(): State { return state; }
export function getServerSnapshot(): State { return DEFAULT_STATE; }

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addBooking(b: Omit<Booking, "id" | "status" | "createdAt" | "called">) {
  const booking: Booking = {
    ...b,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    called: false,
    batch: b.batch ?? "morning",
    preferredLocation: b.preferredLocation ?? "",
    dealNotes: b.dealNotes ?? "",
  };
  state = { ...state, bookings: [booking, ...state.bookings] };
  emit();
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  state = { ...state, bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)) };
  emit();
}

export function setBookingCalled(id: string, called: boolean) {
  state = { ...state, bookings: state.bookings.map((b) => (b.id === id ? { ...b, called } : b)) };
  emit();
}

export function setHoliday(active: boolean, message: string) {
  state = { ...state, holiday: { active, message } };
  emit();
}

export function updateTurfAvailability(id: string, availability: TurfAvailability) {
  state = { ...state, turfs: state.turfs.map((t) => (t.id === id ? { ...t, availability } : t)) };
  emit();
}

export function deleteBooking(id: string) {
  state = { ...state, bookings: state.bookings.filter((b) => b.id !== id) };
  emit();
}

// Admin auth (demo only)
const ADMIN_KEY = "turfpro:admin";
export const ADMIN_CREDS = { id: "admin", password: "admin123" };

export function adminLogin(id: string, password: string) {
  if (id === ADMIN_CREDS.id && password === ADMIN_CREDS.password) {
    localStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}
export function adminLogout() { localStorage.removeItem(ADMIN_KEY); }
export function isAdmin() { return typeof window !== "undefined" && localStorage.getItem(ADMIN_KEY) === "1"; }

// User auth (demo)
const USER_KEY = "turfpro:user";
export function userLogin(email: string) { localStorage.setItem(USER_KEY, email); }
export function userLogout() { localStorage.removeItem(USER_KEY); }
export function currentUser() { return typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null; }

// CSV export — opens cleanly in Google Sheets / Excel
export function bookingsToCSV(bookings: Booking[]): string {
  const headers = ["ID", "Name", "Phone", "Turf", "Sport", "DateTime", "Players", "Price", "Status", "Batch", "PreferredLocation", "DealNotes", "Called", "CreatedAt"];
  const rows = bookings.map((b) =>
    [b.id, b.name, b.phone, b.turf, b.sport, b.datetime, b.players, b.price, b.status, b.batch, b.preferredLocation, b.dealNotes, b.called ? "yes" : "no", b.createdAt]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
