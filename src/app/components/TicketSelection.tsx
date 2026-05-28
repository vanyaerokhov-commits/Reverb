import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ChevronLeft, Minus, Plus, ShoppingCart, CheckCircle2, Users, Info } from "lucide-react";
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

export function TicketSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-[#C7C1B6] text-lg">Event not found</p>
        <Link to="/events">
          <Button className="mt-4 bg-[#E5381E] text-white">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const eventImage =
    event.artistId === "1" ? bmthImage
    : event.artistId === "7" ? architectsImage
    : event.artistId === "8" ? hunnaImage
    : event.artistId === "9" ? punctualImage
    : event.artistId === "10" ? foalsImage
    : event.image;

  const tiers = [
    {
      id: "ga",
      name: "General Admission",
      description: "Standing area — full access to floor",
      price: event.price,
      available: true,
      capacity: "~500 left",
    },
    {
      id: "floor",
      name: "Floor",
      description: "Front standing area, closest to stage",
      price: +(event.price * 1.5).toFixed(2),
      available: true,
      capacity: "~80 left",
    },
    {
      id: "vip",
      name: "VIP",
      description: "Premium package: front section, dedicated bar & lounge",
      price: +(event.price * 2.5).toFixed(2),
      available: true,
      capacity: "~20 left",
    },
    {
      id: "balcony",
      name: "Balcony",
      description: "Elevated seated view of the stage",
      price: +(event.price * 0.75).toFixed(2),
      available: false,
      capacity: "Sold out",
    },
  ];

  const getQty = (tierId: string) => quantities[tierId] ?? 1;
  const setQty = (tierId: string, value: number) =>
    setQuantities((prev) => ({ ...prev, [tierId]: Math.max(1, Math.min(10, value)) }));

  const handleAddToCart = (tier: (typeof tiers)[0]) => {
    addItem({
      eventId: event.id,
      artistName: event.artistName,
      venue: event.venue,
      city: event.city,
      date: event.date,
      time: event.time,
      tier: tier.name,
      price: tier.price,
      quantity: getQty(tier.id),
      image: eventImage,
    });
    setJustAdded(tier.id);
    setTimeout(() => setJustAdded(null), 2000);
  };

  const selectionSubtotal = tiers
    .filter((t) => t.available)
    .reduce((sum, t) => sum + t.price * getQty(t.id), 0);

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
        <Link to={`/event/${event.id}`}>
          <Button variant="ghost" className="text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E]">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Event
          </Button>
        </Link>
        <Link to="/cart">
          <Button
            variant="outline"
            className="bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 relative"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E5381E] text-white text-xs rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Event info strip */}
      <Card className="relative z-10 bg-[#141111]/50 border-[#242221] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-56 h-40 md:h-auto relative flex-shrink-0">
            <img
              src={eventImage}
              alt={event.artistName}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#141111] to-transparent" />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <Badge className="bg-[#E5381E]/90 text-white border-0 self-start mb-2">
              {event.genre}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {event.artistName}
            </h1>
            <p className="text-[#C7C1B6]">
              {event.venue}, {event.city}
            </p>
            <p className="text-[#C7C1B6] text-sm mt-1">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · {event.time}
            </p>
          </div>
        </div>
      </Card>

      {/* Section header */}
      <div className="relative z-10 flex items-start gap-3">
        <div className="w-1 h-12 bg-[#E5381E] rounded-[10px] mt-1 flex-shrink-0"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Select Tickets</h2>
          <p className="text-[#C7C1B6]">Choose your ticket type and quantity</p>
        </div>
      </div>

      {/* Tiers + sidebar */}
      <div className="relative z-10 grid lg:grid-cols-3 gap-6">
        {/* Tier cards */}
        <div className="lg:col-span-2 space-y-4">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`p-6 transition-all ${
                tier.available
                  ? "bg-[#141111]/50 border-[#242221] hover:border-[#E5381E]/50"
                  : "bg-[#141111]/30 border-[#242221]/50 opacity-50"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    {!tier.available && (
                      <Badge className="bg-[#C7C1B6]/20 text-[#C7C1B6] border-[#C7C1B6]/30">
                        Sold Out
                      </Badge>
                    )}
                  </div>
                  <p className="text-[#C7C1B6] text-sm mb-2">{tier.description}</p>
                  <div className="flex items-center gap-1 text-xs text-[#C7C1B6]">
                    <Users className="w-3.5 h-3.5" />
                    <span>{tier.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${tier.price}</p>
                    <p className="text-xs text-[#C7C1B6]">per ticket</p>
                  </div>

                  {tier.available && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#242221] rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQty(tier.id, getQty(tier.id) - 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-white font-semibold text-sm">
                          {getQty(tier.id)}
                        </span>
                        <button
                          onClick={() => setQty(tier.id, getQty(tier.id) + 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(tier)}
                        className={`transition-all min-w-[130px] ${
                          justAdded === tier.id
                            ? "bg-green-600 hover:bg-green-600 text-white"
                            : "bg-[#E5381E] hover:bg-[#991a0a] text-white"
                        }`}
                      >
                        {justAdded === tier.id ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          <div className="flex items-start gap-2 text-xs text-[#C7C1B6] p-3 bg-[#141111]/30 rounded-lg border border-[#242221]/50">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Prices are in USD and exclude booking fees. Maximum 10 tickets per order. All
              sales are final.
            </p>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div>
          <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/30 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
              <h3 className="text-lg font-bold text-white">Your Selection</h3>
            </div>

            <div className="space-y-3 mb-4 min-h-[60px]">
              {tiers
                .filter((t) => t.available)
                .map((tier) => (
                  <div key={tier.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-semibold">{tier.name}</p>
                      <p className="text-[#C7C1B6] text-xs">× {getQty(tier.id)}</p>
                    </div>
                    <p className="text-white text-sm">
                      ${(tier.price * getQty(tier.id)).toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>

            <div className="border-t border-[#242221] pt-3 flex justify-between items-center mb-4">
              <p className="text-[#C7C1B6] text-sm">Subtotal</p>
              <p className="text-white font-bold text-lg">${selectionSubtotal.toFixed(2)}</p>
            </div>

            <Button
              className="w-full h-11 bg-[#E5381E] text-white hover:bg-[#991a0a]"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Go to Cart
              {totalItems > 0 && (
                <span className="ml-2 bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
