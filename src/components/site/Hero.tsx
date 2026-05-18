import heroImg from "@/assets/hero-turf.jpg";
import { Calendar, MapPin, Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Sports turf" width={1920} height={1280} className="size-full object-cover brightness-[0.92] saturate-[1.15]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-background/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-28 sm:pb-40">
        <div className="max-w-3xl animate-[slide-up_0.7s_cubic-bezier(0.16,1,0.3,1)]">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-white drop-shadow-sm">Book your next </span>
            <span className="bg-gradient-to-r from-emerald-300 via-lime-200 to-teal-100 bg-clip-text text-transparent drop-shadow-sm">
              game in seconds.
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/90 max-w-xl drop-shadow-sm">
            Premium cricket & box turfs across Tamil Nadu. Real-time availability,
            instant confirmation, zero hassle.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/turfs" }); }}
            className="mt-10 glass-card rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row gap-2 max-w-2xl"
          >
            <div className="flex items-center gap-2 px-3 flex-1 min-w-0">
              <MapPin className="size-4 text-primary-glow shrink-0" />
              <input placeholder="Chennimalai" className="bg-transparent outline-none text-sm w-full py-3 placeholder:text-muted-foreground" />
            </div>
            <div className="hidden sm:block w-px bg-border my-2" />
            <div className="flex items-center gap-2 px-3 sm:flex-1">
              <Calendar className="size-4 text-primary-glow shrink-0" />
              <input type="datetime-local" className="bg-transparent outline-none text-sm w-full py-3 text-muted-foreground" />
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] hover:opacity-90 transition">
              <Search className="size-4" />
              Search
            </button>
          </form>


        </div>
      </div>
    </section>
  );
}
