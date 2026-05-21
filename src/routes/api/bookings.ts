import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import type { Booking, TimeBatch } from "@/lib/booking-store";

type BookingRequestBody = {
  name: string;
  phone: string;
  game: string;
  date: string;
  timeSlot: string;
  players: string;
};

export const Route = createFileRoute("/api/bookings")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          console.log("[API] Booking submission received");
          
          const body = (await request.json()) as BookingRequestBody;
          console.log("[API] Booking data:", JSON.stringify(body, null, 2));

          // Validate required fields
          if (!body.name || !body.phone || !body.game || !body.date || !body.timeSlot || !body.players) {
            console.error("[API] Missing required fields:", {
              name: !!body.name,
              phone: !!body.phone,
              game: !!body.game,
              date: !!body.date,
              timeSlot: !!body.timeSlot,
              players: !!body.players,
            });
            return new Response(
              JSON.stringify({ 
                error: "Missing required fields",
                details: "Please provide name, phone, game, date, time slot, and number of players"
              }), 
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Validate phone number format
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(body.phone.replace(/\D/g, ''))) {
            console.error("[API] Invalid phone number format:", body.phone);
            return new Response(
              JSON.stringify({ 
                error: "Invalid phone number",
                details: "Please provide a valid 10-digit phone number"
              }), 
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Validate players count
          const players = parseInt(body.players);
          if (isNaN(players) || players < 1 || players > 20) {
            console.error("[API] Invalid players count:", body.players);
            return new Response(
              JSON.stringify({ 
                error: "Invalid players count",
                details: "Number of players must be between 1 and 20"
              }), 
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Validate date format
          const dateObj = new Date(body.date);
          if (isNaN(dateObj.getTime())) {
            console.error("[API] Invalid date format:", body.date);
            return new Response(
              JSON.stringify({ 
                error: "Invalid date format",
                details: "Please provide a valid date"
              }), 
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Determine batch from time slot
          const timeSlotParts = body.timeSlot.split('-');
          const hour = parseInt(timeSlotParts[0]);
          let batch: TimeBatch = "morning";
          if (hour >= 12 && hour < 17) batch = "afternoon";
          else if (hour >= 17 && hour < 21) batch = "evening";
          else if (hour >= 21 || hour < 6) batch = "night";

          // Create booking object with proper date handling
          // Use ISO date format to avoid timezone issues
          const bookingDate = new Date(body.date + 'T00:00:00.000Z');
          const bookingDateTime = new Date(bookingDate);
          bookingDateTime.setUTCHours(hour, 0, 0, 0);
          
          // Validate the created date
          if (isNaN(bookingDateTime.getTime())) {
            console.error("[API] Invalid booking datetime created");
            return new Response(
              JSON.stringify({ 
                error: "Invalid date or time",
                details: "The selected date and time combination is invalid"
              }), 
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }
          
          const booking: Booking = {
            id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: body.name.trim(),
            phone: body.phone.replace(/\D/g, ''),
            turf: body.game,
            sport: body.game,
            datetime: bookingDateTime.toISOString(),
            players: players,
            price: 500, // Default price, can be adjusted based on game
            status: "pending",
            createdAt: new Date().toISOString(),
            batch: batch,
            preferredLocation: "Chennimalai",
            dealNotes: `Time slot: ${body.timeSlot}`,
            called: false,
          };

          console.log("[API] Created booking:", JSON.stringify(booking, null, 2));

          // In a real application, you would save this to a database here
          // For now, we'll just return success with the booking details
          // The client-side localStorage will handle storage for this demo

          return new Response(
            JSON.stringify({ 
              success: true,
              booking: booking,
              message: "Booking submitted successfully"
            }), 
            { status: 201, headers: { "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error("[API] Booking submission error:", error);
          return new Response(
            JSON.stringify({ 
              error: "Internal server error",
              details: error instanceof Error ? error.message : "Unknown error occurred"
            }), 
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
