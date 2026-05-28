import { useState } from "react";
import {
  Search,
  Tag,
  TrendingUp,
  TrendingDown,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  SlidersHorizontal,
  BadgePercent,
  ListFilter,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Link } from "react-router";
import { mockResaleTickets, mockArtists } from "../data/mockData";
import { getGenreColors } from "../utils/genreColors";
import resaleHero from "../../imports/identity/identity-5.jpg";
import geometricPattern from "../../imports/image-10.png";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";

function getResaleImage(artistId: string) {
  if (artistId === "1") return bmthImage;
  if (artistId === "7") return architectsImage;
  if (artistId === "8") return hunnaImage;
  if (artistId === "9") return punctualImage;
  if (artistId === "10") return foalsImage;
  return mockArtists.find((a) => a.id === artistId)?.image || "";
}

const resaleGenres = ["All", "Rock", "Electronic", "Indie", "Alternative", "Pop", "Hip Hop", "Jazz"];

export function ResaleMarket() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dealsOnly, setDealsOnly] = useState(false);

  const filtered = mockResaleTickets.filter((ticket) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      ticket.artistName.toLowerCase().includes(q) ||
      ticket.city.toLowerCase().includes(q) ||
      ticket.venue.toLowerCase().includes(q) ||
      ticket.genre.toLowerCase().includes(q);
    const matchGenre = selectedGenre === "All" || ticket.genre === selectedGenre;
    const matchPrice =
      priceFilter === "all" ||
      (priceFilter === "under50" && ticket.resalePrice < 50) ||
      (priceFilter === "50to100" && ticket.resalePrice >= 50 && ticket.resalePrice <= 100) ||
      (priceFilter === "over100" && ticket.resalePrice > 100);
    const matchDeals = !dealsOnly || ticket.resalePrice < ticket.originalPrice;
    return matchSearch && matchGenre && matchPrice && matchDeals;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "priceLow") return a.resalePrice - b.resalePrice;
    if (sortBy === "priceHigh") return b.resalePrice - a.resalePrice;
    if (sortBy === "dateAsc")
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });

  const totalListings = mockResaleTickets.length;
  const dealsCount = mockResaleTickets.filter(
    (t) => t.resalePrice < t.originalPrice
  ).length;
  const avgRating =
    mockResaleTickets.reduce((s, t) => s + t.sellerRating, 0) /
    mockResaleTickets.length;

  const priceOptions = [
    { id: "all", label: "All Prices" },
    { id: "under50", label: "Under $50" },
    { id: "50to100", label: "$50 – $100" },
    { id: "over100", label: "$100+" },
  ];

  return (
    <div className="relative space-y-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img src={geometricPattern} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute -right-48 top-1/4 w-[650px] h-[650px] rounded-full bg-[#242221]"></div>
        <div className="absolute left-1/4 -bottom-40 w-[850px] h-[850px] rounded-full bg-[#242221]"></div>
      </div>

      {/* Hero Banner */}
      <div className="relative z-10 overflow-hidden rounded-2xl h-44 md:h-56">
        <img src={resaleHero} alt="" className="w-full h-full object-cover brightness-[0.45]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141111]/80 via-transparent to-[#141111]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141111]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <div className="flex items-start gap-3">
            <div className="w-1 h-12 bg-[#E5381E] rounded-[10px] mt-1" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Resale Market</h2>
              <p className="text-[#C7C1B6]">Buy and sell tickets safely within the community</p>
            </div>
          </div>
          <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a] hidden md:flex">
            <Tag className="w-4 h-4 mr-2" />
            List Your Ticket
          </Button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative z-10 grid grid-cols-3 gap-4">
        <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
          <p className="text-2xl font-bold text-white">{totalListings}</p>
          <p className="text-sm text-[#C7C1B6] mt-0.5">Active Listings</p>
        </Card>
        <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{dealsCount}</p>
          <p className="text-sm text-[#C7C1B6] mt-0.5">Below Face Value</p>
        </Card>
        <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{avgRating.toFixed(1)}</p>
          <p className="text-sm text-[#C7C1B6] mt-0.5">Avg Seller Rating</p>
        </Card>
      </div>

      {/* Trust banner */}
      <div className="relative z-10 flex items-center gap-2 px-4 py-3 bg-[#E5381E]/10 border border-[#E5381E]/30 rounded-xl">
        <ShieldCheck className="w-5 h-5 text-[#E5381E] flex-shrink-0" />
        <p className="text-sm text-[#C7C1B6]">
          All resale tickets are verified. Sellers are identity-checked and rated by buyers. Payments are protected until entry is confirmed.
        </p>
      </div>

      {/* Search */}
      <div className="relative z-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C7C1B6] pointer-events-none z-10" />
        <Input
          type="text"
          placeholder="Search artist, city, or venue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 border-[#242221] text-white placeholder:text-[#C7C1B6] focus:border-[#E5381E] bg-[#141111]/50"
        />
      </div>

      {/* Filters row */}
      <div className="relative z-10 space-y-3">
        {/* Genre chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {resaleGenres.map((genre) => {
            const gc = genre === "All" ? null : getGenreColors(genre);
            const isActive = selectedGenre === genre;
            return (
              <Button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                variant="outline"
                size="sm"
                style={
                  isActive && gc
                    ? { backgroundColor: gc.accent, borderColor: gc.accent, color: "#fff" }
                    : isActive
                    ? { backgroundColor: "#E5381E", borderColor: "#E5381E", color: "#fff" }
                    : {}
                }
                className={`whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive
                    ? "border-0"
                    : "bg-[#141111]/50 text-[#C7C1B6] border-[#242221] hover:bg-[#C7C1B6] hover:text-[#E5381E] hover:border-[#C7C1B6]"
                }`}
              >
                {genre}
              </Button>
            );
          })}
        </div>

        {/* Price + Deals + Sort */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 text-[#C7C1B6] mr-1">
            <ListFilter className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Price:</span>
          </div>
          {priceOptions.map((opt) => (
            <Button
              key={opt.id}
              onClick={() => setPriceFilter(opt.id)}
              variant="outline"
              size="sm"
              className={`whitespace-nowrap ${
                priceFilter === opt.id
                  ? "bg-[#E5381E] text-white border-[#E5381E]"
                  : "bg-[#141111]/50 text-[#C7C1B6] border-[#242221] hover:bg-[#E5381E]/20 hover:text-white"
              }`}
            >
              {opt.label}
            </Button>
          ))}

          <Button
            onClick={() => setDealsOnly(!dealsOnly)}
            variant="outline"
            size="sm"
            className={`ml-auto whitespace-nowrap ${
              dealsOnly
                ? "bg-green-700 text-white border-green-700"
                : "bg-[#141111]/50 text-[#C7C1B6] border-[#242221] hover:bg-green-700/20 hover:text-white"
            }`}
          >
            <BadgePercent className="w-3.5 h-3.5 mr-1.5" />
            Deals only
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-[#141111]/50 border-[#242221] text-[#C7C1B6] h-9">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#141111] border-[#242221]">
              <SelectItem value="newest" className="text-[#C7C1B6] focus:bg-[#E5381E]/20 focus:text-white">Newest first</SelectItem>
              <SelectItem value="priceLow" className="text-[#C7C1B6] focus:bg-[#E5381E]/20 focus:text-white">Price: Low → High</SelectItem>
              <SelectItem value="priceHigh" className="text-[#C7C1B6] focus:bg-[#E5381E]/20 focus:text-white">Price: High → Low</SelectItem>
              <SelectItem value="dateAsc" className="text-[#C7C1B6] focus:bg-[#E5381E]/20 focus:text-white">Date: Soonest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-[#C7C1B6] text-sm">
          <span className="text-white font-semibold">{sorted.length}</span>{" "}
          listing{sorted.length !== 1 ? "s" : ""} found
        </p>
        {(searchQuery || selectedGenre !== "All" || priceFilter !== "all" || dealsOnly) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("All");
              setPriceFilter("all");
              setDealsOnly(false);
            }}
            className="text-sm text-[#E5381E] hover:text-[#E5381E]/80 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Cards grid */}
      <div className="relative z-10">
        {sorted.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((ticket) => {
              const isPriceUp = ticket.resalePrice > ticket.originalPrice;
              const priceDiff = Math.abs(ticket.resalePrice - ticket.originalPrice);
              const pricePct = Math.round(
                (priceDiff / ticket.originalPrice) * 100
              );

              // Count all resale tickets for this event
              const eventTicketCount = mockResaleTickets.filter(
                (t) => t.eventId === ticket.eventId
              ).length;

              return (
                <Link
                  key={ticket.id}
                  to={`/resale/event/${ticket.eventId}`}
                  className="block"
                >
                  <Card className="bg-[#141111]/50 border-[#242221] overflow-hidden transition-all group h-full" style={{ ["--tw-border-opacity" as string]: "1" }}>
                    {/* Image */}
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={getResaleImage(ticket.artistId)}
                        alt={ticket.artistName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141111] to-transparent" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to top, ${getGenreColors(ticket.genre).accent}33, transparent)` }} />
                      <Badge className="absolute top-3 left-3 text-white border-0" style={{ backgroundColor: getGenreColors(ticket.genre).accent }}>
                        {ticket.genre}
                      </Badge>
                      <div
                        className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                          isPriceUp
                            ? "bg-red-900/80 text-red-300"
                            : "bg-green-900/80 text-green-300"
                        }`}
                      >
                        {isPriceUp ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isPriceUp ? "+" : "-"}{pricePct}%
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="text-white font-bold text-lg mb-1 group-hover:text-[#E5381E] transition-colors">
                        {ticket.artistName}
                      </h4>
                      <div className="flex items-center gap-1 text-[#C7C1B6] text-sm mb-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{ticket.venue}, {ticket.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#C7C1B6] text-sm mb-3">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          {new Date(ticket.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {ticket.time}
                        </span>
                      </div>

                      {/* Price range */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[#C7C1B6] text-xs">From</p>
                          <p className="text-white text-2xl font-bold">
                            ${ticket.resalePrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#C7C1B6] text-xs">Sellers</p>
                          <p className="text-white text-2xl font-bold">
                            {eventTicketCount}
                          </p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="pt-3 border-t border-[#242221]">
                        <div className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors text-sm font-semibold" style={{ backgroundColor: `${getGenreColors(ticket.genre).accent}1A`, color: getGenreColors(ticket.genre).accent }}>
                          <Tag className="w-3.5 h-3.5" />
                          View all tickets
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="bg-[#141111]/50 border-[#242221] p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-[#C7C1B6]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No listings found</h3>
              <p className="text-[#C7C1B6]">Try adjusting your search or filters.</p>
            </div>
          </Card>
        )}
      </div>

      {/* Sell Your Ticket CTA */}
      <Card className="relative z-10 bg-gradient-to-r from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/30 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]" />
          <h3 className="text-xl font-bold text-white">Want to sell your ticket?</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {[
            { step: "1", title: "List it", desc: "Upload your ticket — we verify it automatically in minutes." },
            { step: "2", title: "Get paid", desc: "Buyer pays securely through Reverb. Funds released after entry." },
            { step: "3", title: "Done", desc: "Transfer is handled digitally. No meetups, no risk." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="w-9 h-9 bg-[#E5381E] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                {step}
              </div>
              <div>
                <p className="text-white font-semibold mb-1">{title}</p>
                <p className="text-[#C7C1B6] text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a] h-11 px-6">
          <Tag className="w-4 h-4 mr-2" />
          List Your Ticket Now
        </Button>
      </Card>
    </div>
  );
}
