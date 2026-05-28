import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle2,
  SkipForward,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockEvents } from "../data/mockData";
import { useCart } from "../context/CartContext";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";
import geometricPattern from "../../imports/image-10.png";

function getEventImage(artistId: string, fallback: string) {
  return artistId === "1" ? bmthImage
    : artistId === "7" ? architectsImage
    : artistId === "8" ? hunnaImage
    : artistId === "9" ? punctualImage
    : artistId === "10" ? foalsImage
    : fallback;
}

function getTiers(basePrice: number) {
  return [
    { id: "ga", name: "General Admission", description: "Standing area — full access to floor", price: basePrice, available: true },
    { id: "floor", name: "Floor", description: "Front standing area, closest to stage", price: +(basePrice * 1.5).toFixed(2), available: true },
    { id: "vip", name: "VIP", description: "Premium package: front section & dedicated bar", price: +(basePrice * 2.5).toFixed(2), available: true },
    { id: "balcony", name: "Balcony", description: "Elevated seated view of the stage", price: +(basePrice * 0.75).toFixed(2), available: false },
  ];
}

export function RouteCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();

  const eventIds = (searchParams.get("events") || "").split(",").filter(Boolean);
  const events = eventIds
    .map((id) => mockEvents.find((e) => e.id === id))
    .filter(Boolean) as typeof mockEvents;

  const [step, setStep] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState("ga");
  const [qty, setQty] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const goBack = () => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.delete(step - 1);
      return next;
    });
    setStep(step - 1);
    setSelectedTierId("ga");
    setQty(1);
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#C7C1B6] text-lg mb-4">No events selected.</p>
        <Link to="/route-planner">
          <Button variant="ghost" className="text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E]">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Route Planner
          </Button>
        </Link>
      </div>
    );
  }

  const currentEvent = events[step];
  const isLastStep = step === events.length - 1;
  const tiers = getTiers(currentEvent.price);
  const selectedTier = tiers.find((t) => t.id === selectedTierId)!;
  const eventImage = getEventImage(currentEvent.artistId, currentEvent.image);

  const advance = (addTicket: boolean) => {
    if (addTicket && selectedTier.available) {
      addItem({
        eventId: currentEvent.id,
        artistName: currentEvent.artistName,
        venue: currentEvent.venue,
        city: currentEvent.city,
        date: currentEvent.date,
        time: currentEvent.time,
        tier: selectedTier.name,
        price: selectedTier.price,
        quantity: qty,
        image: eventImage,
      });
      setCompleted((prev) => new Set([...prev, step]));
    }
    if (isLastStep) {
      navigate("/cart");
    } else {
      setStep(step + 1);
      setSelectedTierId("ga");
      setQty(1);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img src={geometricPattern} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute -left-48 top-1/4 w-[650px] h-[650px] rounded-full bg-[#242221]"></div>
        <div className="absolute right-1/4 -bottom-40 w-[850px] h-[850px] rounded-full bg-[#242221]"></div>
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between">
        <Link to="/route-planner">
          <Button variant="ghost" className="text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E]">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Edit Route
          </Button>
        </Link>
        <Link to="/cart">
          <Button variant="outline" className="bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 relative">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E5381E] text-white text-xs rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Progress stepper */}
      <Card className="relative z-10 bg-[#141111]/50 border-[#242221] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#C7C1B6] text-sm uppercase tracking-wider mb-1">Route Checkout</p>
            <h2 className="text-2xl font-bold text-white">
              Step {step + 1} of {events.length}
            </h2>
          </div>
          <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-[#E5381E]/30 text-sm px-3 py-1">
            {events.length - step - 1} event{events.length - step - 1 !== 1 ? "s" : ""} remaining
          </Badge>
        </div>

        {/* Step circles */}
        <div className="flex items-start">
          {events.map((event, idx) => (
            <div key={event.id} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                    completed.has(idx)
                      ? "bg-green-600 text-white"
                      : idx === step
                      ? "bg-[#E5381E] text-white ring-4 ring-[#E5381E]/30"
                      : "bg-[#242221] text-[#C7C1B6] border border-[#242221]"
                  }`}
                >
                  {completed.has(idx) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <p
                  className={`text-xs mt-1.5 text-center max-w-[64px] truncate ${
                    idx === step ? "text-white font-semibold" : "text-[#C7C1B6]"
                  }`}
                >
                  {event.artistName.split(" ")[0]}
                </p>
              </div>
              {idx < events.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-5 mx-1 transition-all ${
                    completed.has(idx) ? "bg-green-600" : idx < step ? "bg-[#E5381E]/50" : "bg-[#242221]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Current event info */}
      <Card className="relative z-10 bg-[#141111]/50 border-[#242221] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-52 h-40 md:h-auto relative flex-shrink-0">
            <img
              src={eventImage}
              alt={currentEvent.artistName}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#141111] to-transparent" />
            <Badge className="absolute top-3 left-3 bg-[#E5381E]/90 text-white border-0">
              {currentEvent.genre}
            </Badge>
          </div>
          <div className="p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-1">{currentEvent.artistName}</h3>
            <div className="flex items-center gap-1 text-[#C7C1B6] text-sm mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentEvent.venue}, {currentEvent.city}</span>
            </div>
            <div className="flex items-center gap-1 text-[#C7C1B6] text-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(currentEvent.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {currentEvent.time}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Ticket selection */}
      <div className="relative z-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#141111]/50 border-[#242221] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
              <h3 className="text-lg font-bold text-white">Choose your ticket</h3>
            </div>

            <div className="space-y-3 mb-6">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => tier.available && setSelectedTierId(tier.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    !tier.available
                      ? "border-[#242221]/50 opacity-40 cursor-not-allowed"
                      : selectedTierId === tier.id
                      ? "border-[#E5381E] bg-[#E5381E]/10 cursor-pointer"
                      : "border-[#242221] hover:border-[#E5381E]/50 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedTierId === tier.id && tier.available
                            ? "border-[#E5381E] bg-[#E5381E]"
                            : "border-[#C7C1B6]/40"
                        }`}
                      >
                        {selectedTierId === tier.id && tier.available && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{tier.name}</p>
                        <p className="text-[#C7C1B6] text-xs">{tier.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-white font-bold">${tier.price}</p>
                      {!tier.available && (
                        <p className="text-[#C7C1B6] text-xs">Sold out</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-4 border-t border-[#242221]">
              <div className="flex items-center gap-4">
                <p className="text-white font-semibold">Quantity</p>
                <div className="flex items-center border border-[#242221] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-white font-semibold text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#C7C1B6] text-xs">Subtotal</p>
                <p className="text-white font-bold text-xl">
                  ${(selectedTier.available ? selectedTier.price * qty : 0).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar — remaining events preview */}
        <div>
          <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
              <h3 className="text-base font-bold text-white">Route Overview</h3>
            </div>
            <div className="space-y-3">
              {events.map((event, idx) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    idx === step
                      ? "bg-[#E5381E]/15 border border-[#E5381E]/30"
                      : "opacity-50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      completed.has(idx)
                        ? "bg-green-600 text-white"
                        : idx === step
                        ? "bg-[#E5381E] text-white"
                        : "bg-[#242221] text-[#C7C1B6]"
                    }`}
                  >
                    {completed.has(idx) ? "✓" : idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{event.artistName}</p>
                    <p className="text-[#C7C1B6] text-xs truncate">{event.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={goBack}
            title="Back"
            className="h-12 w-12 flex-shrink-0 bg-transparent border-[#242221] text-[#C7C1B6] hover:bg-[#242221] hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => advance(false)}
          title="Skip"
          className="h-12 w-12 flex-shrink-0 bg-transparent border-[#242221] text-[#C7C1B6] hover:bg-[#242221] hover:text-white"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
        <Button
          className="flex-1 h-12 bg-[#E5381E] text-white hover:bg-[#991a0a] text-base font-semibold"
          onClick={() => advance(true)}
        >
          {isLastStep ? (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart & Finish
            </>
          ) : (
            <>
              Add to Cart & Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
