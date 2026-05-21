import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Sports } from "@/components/site/Sports";
import { Testimonials } from "@/components/site/Testimonials";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { addBooking } from "@/lib/booking-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sports spitch — Book Sports Turfs in Tamil Nadu" },
      {
        name: "description",
        content:
          "Book premium cricket, football and box cricket turfs across Tamil Nadu in seconds. Real-time slot availability, instant confirmation.",
      },
      { property: "og:title", content: "Sports spitch — Book Sports Turfs in Tamil Nadu" },
      {
        property: "og:description",
        content: "Real-time turf booking for cricket, football & more across Tamil Nadu.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const handleTestBooking = () => {
    console.log("Test booking button clicked");
    try {
      const testBooking = addBooking({
        name: "Test User",
        phone: "9876543210",
        turf: "Cricket",
        sport: "Cricket",
        datetime: new Date().toISOString(),
        players: 10,
        price: 500,
        batch: "morning",
        preferredLocation: "Chennimalai",
        dealNotes: "Test booking for debugging",
      });
      console.log("Test booking created:", testBooking);
      alert("Test booking created! Check the My Bookings page.");
    } catch (error) {
      console.error("Error creating test booking:", error);
      alert("Error creating test booking: " + error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Debug test button - remove this in production */}
        <div className="fixed top-20 right-4 z-50">
          <button
            onClick={handleTestBooking}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            Test Booking
          </button>
        </div>
        <Hero />
        <Sports />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
