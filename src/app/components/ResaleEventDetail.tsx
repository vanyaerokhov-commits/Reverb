import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Tag,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  MessageCircle,
  Send,
  X,
  CheckCircle2,
  Users,
  Bell,
  BellOff,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockResaleTickets, mockEvents, mockArtists, ResaleTicket } from "../data/mockData";
import { useCart } from "../context/CartContext";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";
import geometricPattern from "../../imports/image-10.png";

function getResaleImage(artistId: string) {
  if (artistId === "1") return bmthImage;
  if (artistId === "7") return architectsImage;
  if (artistId === "8") return hunnaImage;
  if (artistId === "9") return punctualImage;
  if (artistId === "10") return foalsImage;
  return mockArtists.find((a) => a.id === artistId)?.image || "";
}

/** Deterministic fake sale count from seller name */
function getSellerSales(seller: string) {
  return (
    (seller.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 13) % 80 + 5
  );
}

const QUICK_REPLIES = [
  "Is the ticket still available?",
  "Can you send a photo of the ticket?",
  "Would you accept a lower price?",
];

export function ResaleEventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const event = mockEvents.find((e) => e.id === eventId);
  const tickets = mockResaleTickets.filter((t) => t.eventId === eventId);

  // Group tickets by section, sorted cheapest first within each section
  const sectionMap = tickets.reduce(
    (acc, t) => {
      if (!acc[t.section]) acc[t.section] = [];
      acc[t.section].push(t);
      return acc;
    },
    {} as Record<string, ResaleTicket[]>
  );
  Object.values(sectionMap).forEach((arr) =>
    arr.sort((a, b) => a.resalePrice - b.resalePrice)
  );

  const sectionEntries = Object.entries(sectionMap).sort(
    ([, a], [, b]) =>
      Math.min(...a.map((t) => t.resalePrice)) -
      Math.min(...b.map((t) => t.resalePrice))
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sectionEntries.length > 0 ? [sectionEntries[0][0]] : [])
  );
  const [messageTicket, setMessageTicket] = useState<ResaleTicket | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [boughtId, setBoughtId] = useState<string | null>(null);
  const [alertActive, setAlertActive] = useState(() => {
    try {
      const alerts = JSON.parse(localStorage.getItem("reverb_price_alerts") || "[]");
      return (alerts as { eventId: string }[]).some((a) => a.eventId === eventId);
    } catch { return false; }
  });
  const [showAlertInput, setShowAlertInput] = useState(false);
  const [alertPrice, setAlertPrice] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const handleBuy = (ticket: ResaleTicket) => {
    addItem({
      eventId: ticket.eventId,
      artistName: ticket.artistName,
      venue: ticket.venue,
      city: ticket.city,
      date: ticket.date,
      time: ticket.time,
      tier: `${ticket.section} · ${ticket.seat} (Resale)`,
      price: ticket.resalePrice,
      quantity: 1,
      image: getResaleImage(ticket.artistId),
    });
    setBoughtId(ticket.id);
    setTimeout(() => {
      navigate("/cart");
    }, 600);
  };

  const openMessage = (ticket: ResaleTicket) => {
    setMessageTicket(ticket);
    setMessageText(
      `Hi ${ticket.seller}, I'm interested in your ticket for ${ticket.artistName}. `
    );
    setMessageSent(false);
  };

  const handleSend = () => {
    setMessageSent(true);
    setTimeout(() => {
      setMessageTicket(null);
      setMessageSent(false);
      setMessageText("");
    }, 2200);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!", { description: "Share with friends", icon: "🔗" });
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleSetAlert = () => {
    const price = parseFloat(alertPrice);
    if (!eventId || isNaN(price) || price <= 0) return;
    try {
      const existing = JSON.parse(localStorage.getItem("reverb_price_alerts") || "[]") as object[];
      const filtered = (existing as { eventId: string }[]).filter((a) => a.eventId !== eventId);
      filtered.push({
        eventId,
        eventName: displayEvent?.artistName ?? "Event",
        maxPrice: price,
        currentMinPrice: minPrice,
        date: displayEvent?.date ?? "",
      });
      localStorage.setItem("reverb_price_alerts", JSON.stringify(filtered));
    } catch { /* ignore */ }
    setAlertActive(true);
    setShowAlertInput(false);
    setAlertPrice("");
    toast.success(`Price alert set for $${price.toFixed(0)}`, { icon: "🔔" });
  };

  const handleRemoveAlert = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("reverb_price_alerts") || "[]") as { eventId: string }[];
      localStorage.setItem("reverb_price_alerts", JSON.stringify(existing.filter((a) => a.eventId !== eventId)));
    } catch { /* ignore */ }
    setAlertActive(false);
    toast.info("Price alert removed", { icon: "🔕" });
  };

  if (tickets.length === 0 && !event) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Tag className="w-12 h-12 text-[#C7C1B6] mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Event not found</h2>
        <p className="text-[#C7C1B6] mb-6">
          We couldn't find resale listings for this event.
        </p>
        <Link to="/resale">
          <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a]">
            Back to Resale Market
          </Button>
        </Link>
      </div>
    );
  }

  const displayEvent = event ?? tickets[0];
  const totalTickets = tickets.length;
  const dealsCount = tickets.filter((t) => t.resalePrice < t.originalPrice).length;
  const minPrice = Math.min(...tickets.map((t) => t.resalePrice));
  const artistId = tickets[0]?.artistId ?? "";

  return (
    <div className="relative space-y-6 pb-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img src={geometricPattern} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute -left-56 top-1/3 w-[800px] h-[800px] rounded-full bg-[#242221]" />
        <div className="absolute right-1/3 -bottom-48 w-[900px] h-[900px] rounded-full bg-[#242221]" />
      </div>

      {/* Back link */}
      <div className="relative z-10">
        <Link to="/resale" className="inline-block">
          <Button variant="ghost" className="text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E]">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Resale Market
          </Button>
        </Link>
      </div>

      {/* ── EVENT HERO ── */}
      <Card className="relative z-10 overflow-hidden bg-[#141111]/60 border-[#242221]">
        <div className="relative h-52 sm:h-72">
          <img
            src={getResaleImage(artistId)}
            alt={displayEvent.artistName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141111] via-[#141111]/60 to-transparent" />
          {/* Genre badge */}
          <Badge className="absolute top-4 left-4 bg-[#E5381E]/90 text-white border-0 text-xs">
            {tickets[0]?.genre}
          </Badge>
          {/* Share button */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-[#E5381E] flex items-center justify-center transition-colors"
            title="Share event"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {/* Event info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {displayEvent.artistName}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#C7C1B6]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {displayEvent.venue}, {displayEvent.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                {new Date(displayEvent.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                {displayEvent.time}
              </span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 divide-x divide-[#242221] border-t border-[#242221]">
          <div className="p-4 text-center">
            <p className="text-xl font-bold text-white">{totalTickets}</p>
            <p className="text-xs text-[#C7C1B6] mt-0.5 flex items-center justify-center gap-1">
              <Users className="w-3 h-3" />
              Available
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xl font-bold text-green-400">{dealsCount}</p>
            <p className="text-xs text-[#C7C1B6] mt-0.5">Below face value</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xl font-bold text-white">${minPrice.toFixed(0)}</p>
            <p className="text-xs text-[#C7C1B6] mt-0.5">From (cheapest)</p>
          </div>
        </div>
      </Card>

      {/* Trust banner */}
      <div className="relative z-10 flex items-center gap-2.5 px-4 py-3 bg-[#E5381E]/10 border border-[#E5381E]/30 rounded-xl">
        <ShieldCheck className="w-5 h-5 text-[#E5381E] flex-shrink-0" />
        <p className="text-sm text-[#C7C1B6]">
          Tickets are verified before transfer. Payment is held until you
          successfully enter the venue.
        </p>
      </div>

      {/* Price drop alert */}
      <div className="relative z-10">
        {alertActive ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
            <Bell className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-300 flex-1">Price alert is active for this event.</p>
            <button
              onClick={handleRemoveAlert}
              className="text-xs text-yellow-400/70 hover:text-yellow-300 flex items-center gap-1 transition-colors"
            >
              <BellOff className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        ) : showAlertInput ? (
          <div className="flex items-center gap-2 px-4 py-3 bg-[#141111]/50 border border-[#242221] rounded-xl">
            <Bell className="w-4 h-4 text-[#C7C1B6] flex-shrink-0" />
            <span className="text-sm text-[#C7C1B6] whitespace-nowrap">Alert me below $</span>
            <input
              type="number"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              placeholder={String(Math.max(1, minPrice - 5))}
              className="flex-1 min-w-0 bg-[#242221] text-white text-sm rounded-lg px-3 py-1.5 outline-none border border-[#242221] focus:border-[#E5381E] max-w-[100px]"
              onKeyDown={(e) => e.key === "Enter" && handleSetAlert()}
            />
            <Button size="sm" onClick={handleSetAlert} className="bg-[#E5381E] text-white hover:bg-[#991a0a] flex-shrink-0">
              Set
            </Button>
            <button onClick={() => setShowAlertInput(false)} className="text-[#C7C1B6] hover:text-white transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAlertInput(true)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-[#141111]/50 border border-dashed border-[#242221] rounded-xl text-[#C7C1B6] hover:border-[#E5381E]/50 hover:text-white transition-all text-sm"
          >
            <Bell className="w-4 h-4" />
            Alert me if price drops below a limit — currently from ${minPrice.toFixed(0)}
          </button>
        )}
      </div>

      {/* ── SECTIONS ── */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]" />
          <h2 className="text-xl font-bold text-white">Available Tickets</h2>
        </div>

        {sectionEntries.length === 0 ? (
          <Card className="bg-[#141111]/50 border-[#242221] p-12 text-center">
            <Tag className="w-10 h-10 text-[#C7C1B6] mx-auto mb-3" />
            <p className="text-[#C7C1B6]">No resale tickets for this event yet.</p>
          </Card>
        ) : (
          sectionEntries.map(([sectionName, sectionTickets]) => {
            const isExpanded = expandedSections.has(sectionName);
            const minSectionPrice = Math.min(...sectionTickets.map((t) => t.resalePrice));
            const hasDeals = sectionTickets.some(
              (t) => t.resalePrice < t.originalPrice
            );

            return (
              <Card
                key={sectionName}
                className="bg-[#141111]/50 border-[#242221] overflow-hidden"
              >
                {/* Section header — clickable */}
                <button
                  className="w-full flex items-center justify-between gap-3 p-4 hover:bg-[#242221]/50 transition-colors text-left"
                  onClick={() => toggleSection(sectionName)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-1.5 h-10 bg-[#E5381E]/60 rounded-full flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold">{sectionName}</p>
                        {hasDeals && (
                          <span className="text-xs px-1.5 py-0.5 bg-green-900/60 text-green-300 rounded font-medium">
                            Deal available
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#C7C1B6] mt-0.5">
                        {sectionTickets.length} seller
                        {sectionTickets.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[#C7C1B6] text-xs">from</p>
                      <p className="text-white font-bold text-lg leading-tight">
                        ${minSectionPrice.toFixed(0)}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#C7C1B6]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#C7C1B6]" />
                    )}
                  </div>
                </button>

                {/* Expanded seller list */}
                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-[#242221] divide-y divide-[#242221]/60">
                      {sectionTickets.map((ticket) => {
                        const isPriceUp =
                          ticket.resalePrice > ticket.originalPrice;
                        const pricePct = Math.round(
                          (Math.abs(ticket.resalePrice - ticket.originalPrice) /
                            ticket.originalPrice) *
                            100
                        );
                        const sales = getSellerSales(ticket.seller);
                        const isBought = boughtId === ticket.id;

                        return (
                          <div
                            key={ticket.id}
                            className="p-4 sm:p-5 hover:bg-[#242221]/30 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              {/* Seller avatar — links to profile */}
                              <Link
                                to={`/user/${ticket.seller}`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-[#E5381E]/50 to-[#E5381E]/10 border border-[#E5381E]/30 flex items-center justify-center hover:ring-2 hover:ring-[#E5381E]/50 transition-all"
                              >
                                <span className="text-white font-bold text-lg uppercase">
                                  {ticket.seller[0]}
                                </span>
                              </Link>

                              {/* Main content */}
                              <div className="flex-1 min-w-0">
                                {/* Top row: name + price */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <Link
                                      to={`/user/${ticket.seller}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-white font-semibold truncate hover:text-[#E5381E] transition-colors block"
                                    >
                                      {ticket.seller}
                                    </Link>
                                    {/* Stars + sales */}
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                      <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                          <Star
                                            key={i}
                                            className={`w-3 h-3 ${
                                              i <=
                                              Math.round(ticket.sellerRating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-[#C7C1B6]/30 fill-[#C7C1B6]/10"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-yellow-400 text-xs font-semibold">
                                        {ticket.sellerRating.toFixed(1)}
                                      </span>
                                      <span className="text-[#C7C1B6] text-xs">
                                        · {sales} sales
                                      </span>
                                    </div>
                                  </div>

                                  {/* Price column */}
                                  <div className="text-right flex-shrink-0">
                                    <div className="flex items-center gap-1.5 justify-end mb-0.5">
                                      <span className="text-[#C7C1B6] text-xs line-through">
                                        ${ticket.originalPrice.toFixed(2)}
                                      </span>
                                      <span
                                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                          isPriceUp
                                            ? "bg-red-900/50 text-red-300"
                                            : "bg-green-900/60 text-green-300"
                                        }`}
                                      >
                                        {isPriceUp ? (
                                          <TrendingUp className="w-2.5 h-2.5" />
                                        ) : (
                                          <TrendingDown className="w-2.5 h-2.5" />
                                        )}
                                        {isPriceUp ? "+" : "-"}
                                        {pricePct}%
                                      </span>
                                    </div>
                                    <p className="text-white text-2xl font-bold leading-none">
                                      ${ticket.resalePrice.toFixed(2)}
                                    </p>
                                    <p className="text-[#C7C1B6] text-xs mt-0.5">
                                      per ticket
                                    </p>
                                  </div>
                                </div>

                                {/* Seat info */}
                                <p className="text-[#C7C1B6] text-sm mt-2">
                                  <span className="text-white/70">
                                    {ticket.section}
                                  </span>{" "}
                                  · {ticket.seat}
                                </p>

                                {/* Action buttons */}
                                <div className="flex gap-2 mt-3">
                                  <Button
                                    size="sm"
                                    className={`flex-1 h-10 font-semibold transition-all ${
                                      isBought
                                        ? "bg-green-600 hover:bg-green-600 text-white"
                                        : "bg-[#E5381E] hover:bg-[#991a0a] text-white"
                                    }`}
                                    onClick={() => handleBuy(ticket)}
                                    disabled={isBought}
                                  >
                                    {isBought ? (
                                      <>
                                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                        Added to cart
                                      </>
                                    ) : (
                                      <>
                                        <Tag className="w-3.5 h-3.5 mr-1.5" />
                                        Buy · ${ticket.resalePrice.toFixed(2)}
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-10 border-[#242221] bg-transparent text-[#C7C1B6] hover:bg-[#242221] hover:text-white hover:border-[#C7C1B6]/30"
                                    onClick={() => openMessage(ticket)}
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                                    Ask Seller
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ── MESSAGE DIALOG OVERLAY ── */}
      {messageTicket && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMessageTicket(null);
              setMessageSent(false);
            }
          }}
        >
          <Card className="w-full max-w-lg bg-[#141111] border-[#242221] shadow-2xl">
            {messageSent ? (
              /* Success state */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Message sent!
                </h3>
                <p className="text-[#C7C1B6]">
                  <span className="text-white font-semibold">
                    {messageTicket.seller}
                  </span>{" "}
                  will be notified and can reply via the app.
                </p>
              </div>
            ) : (
              <>
                {/* Dialog header */}
                <div className="flex items-center justify-between p-5 border-b border-[#242221]">
                  <div>
                    <h3 className="text-white font-bold text-lg">Ask a question</h3>
                    <p className="text-[#C7C1B6] text-sm">
                      Message the seller before you buy
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-[#C7C1B6] hover:text-white hover:bg-[#242221]"
                    onClick={() => setMessageTicket(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Seller info row */}
                  <div className="flex items-center gap-3 p-3 bg-[#242221]/60 rounded-xl">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E5381E]/50 to-[#E5381E]/10 border border-[#E5381E]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-base uppercase">
                        {messageTicket.seller[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {messageTicket.seller}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i <= Math.round(messageTicket.sellerRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-[#C7C1B6]/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-yellow-400 text-xs font-semibold">
                          {messageTicket.sellerRating.toFixed(1)}
                        </span>
                        <span className="text-[#C7C1B6] text-xs">
                          · {getSellerSales(messageTicket.seller)} sales
                        </span>
                      </div>
                    </div>
                    {/* Ticket mini info */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-sm font-bold">
                        ${messageTicket.resalePrice.toFixed(2)}
                      </p>
                      <p className="text-[#C7C1B6] text-xs">
                        {messageTicket.section}
                      </p>
                    </div>
                  </div>

                  {/* Quick reply chips */}
                  <div>
                    <p className="text-[#C7C1B6] text-xs font-medium mb-2 uppercase tracking-wide">
                      Quick questions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((q) => (
                        <button
                          key={q}
                          onClick={() => setMessageText(q)}
                          className="text-xs px-3 py-1.5 bg-[#242221] hover:bg-[#E5381E]/20 border border-[#242221] hover:border-[#E5381E]/40 text-[#C7C1B6] hover:text-white rounded-full transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text area */}
                  <div>
                    <p className="text-[#C7C1B6] text-xs font-medium mb-2 uppercase tracking-wide">
                      Your message
                    </p>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={4}
                      placeholder={`Hi ${messageTicket.seller}, I'm interested in your ticket…`}
                      className="w-full bg-[#242221]/80 border border-[#242221] hover:border-[#C7C1B6]/20 focus:border-[#E5381E]/50 rounded-xl p-3 text-white text-sm placeholder:text-[#C7C1B6]/50 resize-none outline-none transition-colors"
                    />
                  </div>

                  {/* Send button */}
                  <Button
                    className="w-full h-11 bg-[#E5381E] hover:bg-[#991a0a] text-white font-semibold"
                    disabled={!messageText.trim()}
                    onClick={handleSend}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
