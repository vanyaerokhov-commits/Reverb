import { useState } from "react";
import { Link } from "react-router";
import { QrCode, MapPin, Calendar, Upload, Download, Share2, MoreVertical, Tag, ArrowRight, ShieldCheck, TrendingDown, SlidersHorizontal } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { mockTickets } from "../data/mockData";
import bmthImage from "../../imports/image-3.png";
import hunnaImage from "../../imports/image-15.png";
import architectsImage from "../../imports/image-14.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";
import geometricPattern from "../../imports/image-10.png";

export function MyTickets() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("dateAsc");

  const upcomingRaw = mockTickets.filter((t) => t.status === "upcoming");
  const usedRaw = mockTickets.filter((t) => t.status === "used");

  const sortTickets = (arr: typeof mockTickets) =>
    [...arr].sort((a, b) => {
      if (sortBy === "dateAsc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "dateDesc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "artist") return a.artistName.localeCompare(b.artistName);
      if (sortBy === "city") return a.city.localeCompare(b.city);
      return 0;
    });

  const upcomingTickets = sortTickets(upcomingRaw);
  const usedTickets = sortTickets(usedRaw);

  const getTicketImage = (artistName: string, fallback: string) =>
    artistName === "Bring Me the Horizon" ? bmthImage
    : artistName === "The Hunna" ? hunnaImage
    : artistName === "Architects" ? architectsImage
    : artistName === "Punctual" ? punctualImage
    : artistName === "Foals" ? foalsImage
    : fallback;

  const TicketCard = ({ ticket }: { ticket: typeof mockTickets[0] }) => {
    const isExpanded = selectedTicket === ticket.id;

    return (
      <Card
        className={`bg-gradient-to-br from-[#141111] to-[#242221] border-[#E5381E]/30 overflow-hidden cursor-pointer ${
          isExpanded ? "ring-2 ring-[#E5381E]" : ""
        }`}
        onClick={() => setSelectedTicket(isExpanded ? null : ticket.id)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Event Image */}
          <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
            <img
              src={getTicketImage(ticket.artistName, ticket.image)}
              alt={ticket.artistName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#141111] to-transparent"></div>
          </div>

          {/* Right Side - Ticket Info */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-[#E5381E]/30 mb-2">
                  {ticket.platform}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {ticket.artistName}
                </h3>
                <div className="flex items-center gap-2 text-[#C7C1B6] text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {ticket.venue}, {ticket.city}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-[#C7C1B6] hover:bg-[#C7C1B6]/20 hover:text-[#E5381E]"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[#C7C1B6] text-sm mb-1">Date & Time</p>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-[#C7C1B6]" />
                  <span className="text-sm font-semibold">
                    {new Date(ticket.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {ticket.time}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[#C7C1B6] text-sm mb-1">Section & Seat</p>
                <p className="text-white text-sm font-semibold">
                  {ticket.section}
                  <br />
                  {ticket.seat}
                </p>
              </div>
            </div>

            {/* Expanded Content - CSS grid height animation */}
            <div
              className="grid transition-all duration-500 ease-in-out"
              style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="mt-6 pt-6 border-t border-[#E5381E]/30">
                  <div className="flex flex-col items-center gap-6">
                    <div className="bg-[#C7C1B6] p-4 rounded-xl">
                      <div className="w-40 h-40 flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-[#242221]" />
                      </div>
                      <p className="text-center text-[#242221] text-xs mt-2 font-mono font-bold tracking-widest">
                        {ticket.qrCode}
                      </p>
                      <p className="text-center text-[#242221]/50 text-[10px] mt-1 font-mono tracking-wider">
                        {new Date(ticket.date).getFullYear()} · {ticket.venue.slice(0, 3).toUpperCase()} · {String(ticket.id).padStart(6, "0")}
                      </p>
                    </div>
                    <div className="w-full space-y-3">
                      <Button className="w-full bg-[#E5381E] text-white hover:bg-[#991a0a] group">
                        <Download className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:scale-110" />
                        Download Ticket
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Transfer Ticket
                      </Button>
                      <div className="bg-[#E5381E]/20 rounded-lg p-4 text-sm text-slate-300">
                        <p className="font-semibold text-[#C7C1B6] mb-1">
                          Important Information
                        </p>
                        <ul className="text-xs space-y-1 text-[#C7C1B6]">
                          <li>• Present this QR code at the venue entrance</li>
                          <li>• Gates open 1 hour before show time</li>
                          <li>• No refunds or exchanges</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Show QR Code button - CSS grid height animation */}
            <div
              className="grid transition-all duration-500 ease-in-out"
              style={{ gridTemplateRows: !isExpanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <Button
                  variant="outline"
                  className="w-full bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90 mt-2"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="relative space-y-6">
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img
          src={geometricPattern}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Circular Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute left-1/3 -top-48 w-[750px] h-[750px] rounded-full bg-[#242221]"></div>
        <div className="absolute -right-64 top-2/3 w-[950px] h-[950px] rounded-full bg-[#242221]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-start gap-3">
          <div className="w-1 h-12 bg-[#E5381E] rounded-[10px] mt-1"></div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">My Tickets</h2>
            <p className="text-[#C7C1B6]">
              All your tickets from different platforms in one place
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 bg-[#141111]/50 border-[#242221] text-[#C7C1B6] h-9">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#141111] border-[#242221]">
              <SelectItem value="dateAsc" className="text-[#C7C1B6] focus:bg-[#E5381E]/20 focus:text-white">Date: Soonest first</SelectItem>
              <SelectItem value="dateDesc" className="text-[#C7C1B6] focus:bg-[#E5381E]/20 focus:text-white">Date: Latest first</SelectItem>
              <SelectItem value="artist" className="text-[#C7C1B6] focus:bg-[#E5381E]/20 focus:text-white">Artist A → Z</SelectItem>
              <SelectItem value="city" className="text-[#C7C1B6] focus:bg-[#E5381E]/20 focus:text-white">City A → Z</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Ticket
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="relative z-10 w-full">
        <TabsList className="bg-[#141111]/50 border border-[#242221] p-1">
          <TabsTrigger
            value="upcoming"
            className="text-[#C7C1B6] data-[state=active]:bg-[#E5381E] data-[state=active]:text-white data-[state=active]:shadow-none rounded-md transition-all"
          >
            Upcoming ({upcomingTickets.length})
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="text-[#C7C1B6] data-[state=active]:bg-[#E5381E] data-[state=active]:text-white data-[state=active]:shadow-none rounded-md transition-all"
          >
            Past Events ({usedTickets.length})
          </TabsTrigger>
          <TabsTrigger
            value="resale"
            className="text-[#C7C1B6] data-[state=active]:bg-[#E5381E] data-[state=active]:text-white data-[state=active]:shadow-none rounded-md transition-all"
          >
            Resale Market
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingTickets.length > 0 ? (
            upcomingTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          ) : (
            <Card className="bg-[#141111]/50 border-[#242221] p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-[#C7C1B6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Upcoming Tickets
                </h3>
                <p className="text-[#C7C1B6] mb-6">
                  Import your tickets from Ticketmaster, Eventbrite, or other platforms
                  to keep them all in one place.
                </p>
                <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a]">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Your First Ticket
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {usedTickets.length > 0 ? (
            usedTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="bg-gradient-to-br from-[#141111] to-[#242221] border-[#242221] overflow-hidden opacity-80"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-36 md:h-auto relative flex-shrink-0">
                    <img
                      src={getTicketImage(ticket.artistName, ticket.image)}
                      alt={ticket.artistName}
                      className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#141111] to-transparent" />
                    <Badge className="absolute top-2 left-2 bg-[#242221] text-[#C7C1B6] border-[#C7C1B6]/20 text-xs">
                      Attended
                    </Badge>
                  </div>
                  <div className="flex-1 p-5">
                    <h3 className="text-lg font-bold text-white mb-1">{ticket.artistName}</h3>
                    <div className="flex items-center gap-1 text-[#C7C1B6] text-sm mb-1">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{ticket.venue}, {ticket.city}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#C7C1B6] text-sm mb-4">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>
                        {new Date(ticket.date).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric",
                        })} · {ticket.time}
                      </span>
                    </div>
                    <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-[#E5381E]/30">
                      {ticket.section} · {ticket.seat}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-[#141111]/50 border-[#242221] p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-[#C7C1B6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Past Events Yet</h3>
                <p className="text-[#C7C1B6]">Your attended concerts will appear here.</p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Resale Market Tab */}
        <TabsContent value="resale" className="mt-6">
          <Card className="bg-gradient-to-br from-[#141111]/80 to-[#242221]/80 border-[#E5381E]/30 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <Tag className="w-8 h-8 text-[#E5381E]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Resale Market</h3>
              <p className="text-[#C7C1B6] mb-6 leading-relaxed">
                Browse hundreds of verified resale tickets — find last-minute deals, below-face-value listings, and premium seats for sold-out shows.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#141111]/60 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">10+</p>
                  <p className="text-xs text-[#C7C1B6]">Live listings</p>
                </div>
                <div className="bg-[#141111]/60 rounded-xl p-3">
                  <p className="text-2xl font-bold text-green-400">6</p>
                  <p className="text-xs text-[#C7C1B6]">Below face value</p>
                </div>
                <div className="bg-[#141111]/60 rounded-xl p-3">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingDown className="w-4 h-4 text-green-400" />
                    <p className="text-2xl font-bold text-green-400">4.7</p>
                  </div>
                  <p className="text-xs text-[#C7C1B6]">Avg seller rating</p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center mb-6 text-sm text-[#C7C1B6]">
                <ShieldCheck className="w-4 h-4 text-[#E5381E]" />
                <span>All tickets verified · Buyer protection included</span>
              </div>

              <Link to="/resale">
                <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a] h-12 px-8 text-base font-semibold">
                  Browse Resale Market
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Instructions */}
      {upcomingTickets.length > 0 && (
        <Card className="bg-gradient-to-r from-[#141111]/30 to-[#242221]/30 border-[#E5381E]/30 p-6 relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
            <h3 className="text-lg font-bold text-white">
              How to Import Tickets
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#E5381E] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div className="text-slate-300">
                <p className="font-semibold text-white mb-1">Scan QR Code</p>
                <p className="text-[#C7C1B6]">
                  Use your camera to scan ticket QR codes
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#E5381E] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div className="text-slate-300">
                <p className="font-semibold text-white mb-1">Email Forward</p>
                <p className="text-[#C7C1B6]">
                  Forward confirmation emails to import tickets
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#E5381E] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div className="text-slate-300">
                <p className="font-semibold text-white mb-1">Link Accounts</p>
                <p className="text-[#C7C1B6]">
                  Connect Ticketmaster, Eventbrite, and more
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
