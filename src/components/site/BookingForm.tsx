import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addBooking } from "@/lib/booking-store";
import type { TimeBatch } from "@/lib/booking-store";

const GAMES = ["Kabaddi", "Cricket", "Badminton", "Karate"] as const;
const TIME_SLOTS = [
  { slot: "8-9", batch: "morning" },
  { slot: "9-10", batch: "morning" },
  { slot: "10-11", batch: "morning" },
  { slot: "11-12", batch: "morning" },
  { slot: "12-1", batch: "afternoon" },
  { slot: "1-2", batch: "afternoon" },
  { slot: "2-3", batch: "afternoon" },
  { slot: "3-4", batch: "afternoon" },
  { slot: "4-5", batch: "evening" },
  { slot: "5-6", batch: "evening" }
] as const;

export function BookingForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    game: "",
    date: "",
    timeSlot: "",
    players: ""
  });

  const getBatch = (timeSlot: string): TimeBatch => {
    const slotData = TIME_SLOTS.find(s => s.slot === timeSlot);
    const batch = slotData?.batch || "morning";
    // Type guard to ensure the value is a valid TimeBatch
    if (batch === "morning" || batch === "afternoon" || batch === "evening" || batch === "night") {
      return batch;
    }
    return "morning"; // Fallback
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    
    // Check if all required fields are filled
    if (!formData.name || !formData.phone || !formData.game || !formData.date || !formData.timeSlot || !formData.players) {
      console.error("Missing required fields");
      alert("Please fill in all required fields");
      return;
    }
    
    const batch = getBatch(formData.timeSlot);
    const displayBatch = batch.charAt(0).toUpperCase() + batch.slice(1);
    
    console.log("Batch determined:", batch, "Display:", displayBatch);
    
    // Ensure batch is a valid TimeBatch value
    const validBatch: TimeBatch = (
      batch === "morning" || batch === "afternoon" || batch === "evening" || batch === "night"
        ? batch
        : "morning"
    );
    
    console.log("Valid batch:", validBatch);
    
    // Save booking to store
    try {
      addBooking({
        name: formData.name,
        phone: formData.phone,
        turf: formData.game, // Using game name as turf for simplicity
        sport: formData.game,
        datetime: new Date(`${formData.date}T${formData.timeSlot.split('-')[0]}:00:00`).toISOString(),
        players: parseInt(formData.players),
        price: 500, // Default price, can be adjusted based on game
        batch: validBatch,
        preferredLocation: "Chennimalai",
        dealNotes: `Time slot: ${formData.timeSlot}`,
      });
      console.log("Booking saved successfully");
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Error saving booking. Please try again.");
      return;
    }
    
    // Send WhatsApp message
    const message = `New Booking Request:
Name: ${formData.name}
Phone: ${formData.phone}
Game: ${formData.game}
Date: ${formData.date}
Time: ${formData.timeSlot}
Batch: ${displayBatch}
Players: ${formData.players}`;

    console.log("WhatsApp message:", message);
    
    // Try the phone number without country code first
    const phoneNumber = "8883921424"; // Original number provided
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    console.log("WhatsApp URL:", whatsappUrl);
    
    // Try to open WhatsApp, with fallback for popup blockers
    try {
      const newWindow = window.open(whatsappUrl, "_blank");
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // If popup blocked, open in same tab
        console.log("Popup blocked, opening in same tab");
        window.location.href = whatsappUrl;
      } else {
        console.log("WhatsApp opened in new tab");
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      // Fallback: try direct location change
      window.location.href = whatsappUrl;
    }
    
    // Close dialog and reset form
    setOpen(false);
    setFormData({
      name: "",
      phone: "",
      game: "",
      date: "",
      timeSlot: "",
      players: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:opacity-90 transition">
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Your Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="game">Game</Label>
            <Select required value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {GAMES.map((game) => (
                  <SelectItem key={game} value={game}>{game}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeSlot">Time Slot</Label>
            <Select required value={formData.timeSlot} onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((item) => (
                  <SelectItem key={item.slot} value={item.slot}>
                    <div className="flex items-center justify-between w-full">
                      <span>{item.slot}</span>
                      <span className="text-xs text-muted-foreground ml-2">({item.batch.charAt(0).toUpperCase() + item.batch.slice(1)})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.timeSlot && (
              <div className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-primary-glow">
                  Batch: {getBatch(formData.timeSlot).charAt(0).toUpperCase() + getBatch(formData.timeSlot).slice(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.timeSlot} falls in {getBatch(formData.timeSlot)} session
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="players">Number of Players</Label>
            <Input
              id="players"
              required
              type="number"
              min="1"
              value={formData.players}
              onChange={(e) => setFormData({ ...formData, players: e.target.value })}
              placeholder="Enter number of players"
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:opacity-90 transition">
            Submit & Send to WhatsApp
          </Button>
          
          {/* Test button for debugging */}
          <Button 
            type="button" 
            onClick={() => {
              const testMessage = "Test message from booking form";
              const testUrl = `https://wa.me/8883921424?text=${encodeURIComponent(testMessage)}`;
              console.log("Test WhatsApp URL:", testUrl);
              window.open(testUrl, "_blank");
            }}
            className="w-full bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition"
          >
            Test WhatsApp Connection
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}