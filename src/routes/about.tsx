import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — TurfPro" }, { name: "description", content: "About TurfPro, Tamil Nadu's sports turf booking platform." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">About <span className="text-gradient">TurfPro</span></h1>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          TurfPro is Tamil Nadu's premier platform for booking sports turfs in real-time. We help
          players discover and reserve cricket, football, badminton, kabaddi and karate venues
          across the state — with live slot availability and instant confirmation.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Built for the modern player, the app installs to your home screen, works offline and gives
          you push notifications for your favourite venues.
        </p>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
