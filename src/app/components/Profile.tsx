import { useState } from "react";
import { Link } from "react-router";
import {
  Music, MapPin, Star, Trophy, Sparkles, Clock,
  ChevronDown, ChevronUp, Tag, ShieldCheck, Zap,
  BadgeCheck, Package, ThumbsUp, TrendingUp, TrendingDown,
  Calendar, MessageCircle, ExternalLink, Heart, Bell, BellOff, DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import {
  mockBadges, mockTickets, mockEvents,
  mockResaleTickets, mockUserReviews,
} from "../data/mockData";
import { useWishlist } from "../context/WishlistContext";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";
import geometricPattern from "../../imports/image-10.png";

const OWN_USERNAME = "musiclover";

function getResaleImage(artistId: string) {
  if (artistId === "1") return bmthImage;
  if (artistId === "7") return architectsImage;
  if (artistId === "8") return hunnaImage;
  if (artistId === "9") return punctualImage;
  if (artistId === "10") return foalsImage;
  return "";
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-[#C7C1B6]/20 fill-[#C7C1B6]/10"}`} />
      ))}
    </div>
  );
}

export function Profile() {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlist();
  const [priceAlerts, setPriceAlerts] = useState<{ eventId: string; eventName: string; maxPrice: number }[]>(() => {
    try { return JSON.parse(localStorage.getItem("reverb_price_alerts") || "[]"); }
    catch { return []; }
  });

  const removeAlert = (eventId: string) => {
    const updated = priceAlerts.filter((a) => a.eventId !== eventId);
    setPriceAlerts(updated);
    localStorage.setItem("reverb_price_alerts", JSON.stringify(updated));
    toast.info("Alert removed", { icon: "🔕" });
  };

  const totalConcerts = mockTickets.length;
  const totalSpent = mockTickets.reduce((sum, t) => sum + t.price, 0);
  const uniqueArtists = new Set(mockTickets.map((t) => t.artistName)).size;
  const uniqueCities = new Set(mockTickets.map((t) => t.city)).size;

  const genreCounts = mockTickets.reduce((acc, ticket) => {
    const event = mockEvents.find((e) => e.id === ticket.eventId);
    if (event) acc[event.genre] = (acc[event.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalGenreCount = Object.values(genreCounts).reduce((a, b) => a + b, 0);
  const genreBreakdown = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => ({ genre, pct: Math.round((count / totalGenreCount) * 100) }));

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Music, Trophy, Sparkles, MapPin, Star, Clock };
    return icons[iconName] || Music;
  };

  const earnedCount = mockBadges.filter((b) => b.earned).length;
  const visibleBadges = showAllBadges ? mockBadges : mockBadges.slice(0, 4);

  // Seller data for own user
  const myListings = mockResaleTickets.filter((t) => t.seller === OWN_USERNAME);
  const myReviews = mockUserReviews.filter((r) => r.sellerUsername === OWN_USERNAME);
  const positivePct = myReviews.length > 0
    ? Math.round((myReviews.filter((r) => r.rating >= 4).length / myReviews.length) * 100)
    : 100;

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

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-1 h-12 bg-[#E5381E] rounded-[10px] mt-1 flex-shrink-0"></div>
        <div className="flex-1 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Profile</h2>
            <p className="text-[#C7C1B6]">Your music journey</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <p className="text-white font-bold">Music Fan</p>
                <BadgeCheck className="w-4 h-4 text-[#E5381E]" />
              </div>
              <p className="text-[#C7C1B6] text-sm">@{OWN_USERNAME} · since Jan 2026</p>
            </div>
            <Link to={`/user/${OWN_USERNAME}`} className="group relative">
              <div className="w-14 h-14 bg-[#E5381E] rounded-full flex items-center justify-center flex-shrink-0 group-hover:ring-2 group-hover:ring-[#E5381E]/50 transition-all">
                <span className="text-xl font-bold text-white">MF</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#141111] border border-[#242221] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-2.5 h-2.5 text-[#C7C1B6]" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/30 border-[#242221] p-6 text-center">
          <div className="w-12 h-12 bg-[#E5381E]/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Music className="w-6 h-6 text-[#C7C1B6]" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalConcerts}</p>
          <p className="text-sm text-[#C7C1B6]">Concerts</p>
        </Card>
        <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/30 border-[#242221] p-6 text-center">
          <div className="w-12 h-12 bg-[#E5381E]/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-[#C7C1B6]" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{uniqueArtists}</p>
          <p className="text-sm text-[#C7C1B6]">Artists</p>
        </Card>
        <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/30 border-[#242221] p-6 text-center">
          <div className="w-12 h-12 bg-[#E5381E]/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6 text-[#C7C1B6]" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{uniqueCities}</p>
          <p className="text-sm text-[#C7C1B6]">Cities</p>
        </Card>
        <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/30 border-[#242221] p-6 text-center">
          <div className="w-12 h-12 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${totalSpent.toFixed(0)}</p>
          <p className="text-sm text-[#C7C1B6]">Total Spent</p>
        </Card>
      </div>

      {/* Badges & Achievements */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
          <Trophy className="w-5 h-5 text-[#C7C1B6]" />
          <h3 className="text-xl font-bold text-white">Badges & Achievements</h3>
          <Badge className="ml-auto bg-[#E5381E]/20 text-[#C7C1B6] border-[#E5381E]/30">
            {earnedCount}/{mockBadges.length} earned
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {visibleBadges.map((badge) => {
            const IconComponent = getIconComponent(badge.icon);
            return (
              <Card key={badge.id} className={`p-6 ${badge.earned ? "bg-gradient-to-r from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/50" : "bg-[#141111]/50 border-[#242221] opacity-60"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${badge.earned ? "bg-gradient-to-br from-[#E5381E] to-[#E5381E]/80" : "bg-[#242221]"}`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-white">{badge.name}</h4>
                      {badge.earned && <Badge className="bg-[#E5381E] text-white border-0 flex-shrink-0">Earned</Badge>}
                    </div>
                    <p className="text-sm text-[#C7C1B6] mb-3">{badge.description}</p>
                    {!badge.earned && badge.progress !== undefined && badge.total !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs text-[#C7C1B6] mb-1">
                          <span>Progress</span><span>{badge.progress}/{badge.total}</span>
                        </div>
                        <Progress value={(badge.progress / badge.total) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {mockBadges.length > 4 && (
          <button onClick={() => setShowAllBadges(!showAllBadges)} className="mt-3 w-full py-2 text-sm text-[#C7C1B6] hover:text-white flex items-center justify-center gap-2 transition-colors">
            {showAllBadges ? <><ChevronUp className="w-4 h-4" />Show less</> : <><ChevronDown className="w-4 h-4" />Show all {mockBadges.length} badges</>}
          </button>
        )}
      </div>

      {/* Recent Activity */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
          <Clock className="w-5 h-5 text-[#C7C1B6]" />
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        </div>
        <Card className="bg-[#141111]/50 border-[#242221] divide-y divide-[#242221]">
          {mockTickets.slice(0, 3).map((ticket) => (
            <div key={ticket.id} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E5381E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-[#C7C1B6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{ticket.artistName}</p>
                <p className="text-sm text-[#C7C1B6]">
                  {new Date(ticket.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {ticket.venue}
                </p>
              </div>
              <Badge className={ticket.status === "upcoming" ? "bg-green-600/20 text-green-400 border-green-600/30 flex-shrink-0" : "bg-[#C7C1B6]/20 text-[#C7C1B6] border-[#C7C1B6]/30 flex-shrink-0"}>
                {ticket.status === "upcoming" ? "Upcoming" : "Attended"}
              </Badge>
            </div>
          ))}
        </Card>
      </div>

      {/* Genre Breakdown */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
          <Sparkles className="w-5 h-5 text-[#C7C1B6]" />
          <h3 className="text-xl font-bold text-white">Your Music Taste</h3>
        </div>
        <Card className="bg-[#141111]/50 border-[#242221] p-6">
          {genreBreakdown.length > 0 ? (
            <div className="space-y-4">
              {genreBreakdown.map(({ genre, pct }) => (
                <div key={genre}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">{genre}</span>
                    <span className="text-[#C7C1B6]">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2 bg-[#C7C1B6]/20 [&>div]:bg-[#C7C1B6]" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#C7C1B6] text-sm">Attend some concerts to see your music taste!</p>
          )}
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SELLER DASHBOARD                                      */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 pt-4 border-t border-[#242221]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-12 bg-[#E5381E] rounded-[10px]"></div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Seller Dashboard</h2>
            <p className="text-[#C7C1B6] text-sm">Your resale activity and buyer feedback</p>
          </div>
          <Link to="/resale">
            <Button variant="outline" className="bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90">
              <Tag className="w-4 h-4 mr-2" />List a ticket
            </Button>
          </Link>
        </div>

        {/* Seller stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
            <Package className="w-5 h-5 text-[#E5381E] mx-auto mb-1.5" />
            <p className="text-xl font-bold text-white">{myListings.length}</p>
            <p className="text-xs text-[#C7C1B6] mt-0.5">Active listings</p>
          </Card>
          <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1.5" />
            <p className="text-xl font-bold text-white">3</p>
            <p className="text-xs text-[#C7C1B6] mt-0.5">Completed sales</p>
          </Card>
          <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
            <ThumbsUp className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
            <p className="text-xl font-bold text-white">{positivePct}%</p>
            <p className="text-xs text-[#C7C1B6] mt-0.5">Positive reviews</p>
          </Card>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141111]/50 border border-[#242221] rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5381E]" />
            <span className="text-xs text-[#C7C1B6] font-medium">Identity Verified</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141111]/50 border border-blue-500/30 rounded-full">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Fast Responder</span>
          </div>
        </div>

        {/* My active listings */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
            <h3 className="text-lg font-bold text-white">My Active Listings</h3>
            {myListings.length > 0 && <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0">{myListings.length}</Badge>}
          </div>

          {myListings.length === 0 ? (
            <Card className="bg-[#141111]/50 border-[#242221] p-8 text-center">
              <Tag className="w-10 h-10 text-[#C7C1B6] mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">No active listings</p>
              <p className="text-[#C7C1B6] text-sm mb-4">Have a spare ticket? Sell it safely to other fans.</p>
              <Link to="/resale">
                <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a]">
                  <Tag className="w-4 h-4 mr-2" />List your first ticket
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myListings.map((ticket) => {
                const isPriceUp = ticket.resalePrice > ticket.originalPrice;
                const pricePct = Math.round((Math.abs(ticket.resalePrice - ticket.originalPrice) / ticket.originalPrice) * 100);
                return (
                  <Card key={ticket.id} className="bg-[#141111]/50 border-[#242221] overflow-hidden hover:border-[#E5381E]/30 transition-all group">
                    <div className="h-36 overflow-hidden relative">
                      <img src={getResaleImage(ticket.artistId)} alt={ticket.artistName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141111] to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-[#E5381E]/90 text-white border-0 text-xs">{ticket.genre}</Badge>
                      <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isPriceUp ? "bg-red-900/80 text-red-300" : "bg-green-900/80 text-green-300"}`}>
                        {isPriceUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPriceUp ? "+" : "-"}{pricePct}%
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-bold mb-1">{ticket.artistName}</h4>
                      <div className="flex items-center gap-1 text-[#C7C1B6] text-xs mb-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{ticket.venue}, {ticket.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#C7C1B6] text-xs mb-3">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{new Date(ticket.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {ticket.time}</span>
                      </div>
                      <div className="flex items-end justify-between pt-3 border-t border-[#242221]">
                        <div>
                          <p className="text-[#C7C1B6] text-xs">{ticket.section} · {ticket.seat}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#C7C1B6] text-xs line-through">${ticket.originalPrice.toFixed(2)}</p>
                          <p className="text-white text-xl font-bold">${ticket.resalePrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* My reviews from buyers */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
            <h3 className="text-lg font-bold text-white">Reviews from Buyers</h3>
            {myReviews.length > 0 && <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0">{myReviews.length}</Badge>}
          </div>

          {myReviews.length === 0 ? (
            <Card className="bg-[#141111]/50 border-[#242221] p-8 text-center">
              <MessageCircle className="w-10 h-10 text-[#C7C1B6] mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">No reviews yet</p>
              <p className="text-[#C7C1B6] text-sm">Complete your first sale to start receiving buyer feedback.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {myReviews.map((review) => (
                <Card key={review.id} className="bg-[#141111]/50 border-[#242221] p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/50 to-purple-600/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm uppercase">{review.buyerUsername[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <Link to={`/user/${review.buyerUsername}`} className="text-white font-semibold text-sm hover:text-[#E5381E] transition-colors">@{review.buyerUsername}</Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRow rating={review.rating} />
                            <span className="text-[#C7C1B6] text-xs">{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        </div>
                        <Badge className="bg-[#242221] text-[#C7C1B6] border-[#242221] text-xs flex-shrink-0">{review.eventName.split(" @ ")[0]}</Badge>
                      </div>
                      <p className="text-[#C7C1B6] text-sm mt-2 leading-relaxed">"{review.comment}"</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── WISHLIST ── */}
      <Card className="bg-[#141111]/50 border-[#242221] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]" />
          <Heart className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-bold text-white">Saved Events</h3>
          <Badge className="bg-pink-900/30 text-pink-300 border-0">{wishlistItems.length}</Badge>
        </div>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-10 h-10 text-[#C7C1B6]/30 mx-auto mb-3" />
            <p className="text-[#C7C1B6] text-sm">No saved events yet.</p>
            <p className="text-[#C7C1B6]/60 text-xs mt-1">Tap ♡ on any event card to save it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#242221]/50">
                <Link to={`/event/${item.id}`} className="flex-1 flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-[#E5381E]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Music className="w-5 h-5 text-[#E5381E]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{item.artistName}</p>
                    <p className="text-[#C7C1B6] text-xs truncate">{item.venue}, {item.city}</p>
                    <p className="text-[#C7C1B6] text-xs mt-0.5">
                      {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {" "}· <span className="text-green-400">${item.price}</span>
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => { removeWishlistItem(item.id); toast.info("Removed from wishlist", { icon: "🤍" }); }}
                  className="text-[#C7C1B6]/40 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                >
                  <Heart className="w-4 h-4 fill-pink-400 text-pink-400 hover:fill-none hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── PRICE ALERTS ── */}
      <Card className="bg-[#141111]/50 border-[#242221] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]" />
          <Bell className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Price Alerts</h3>
          <Badge className="bg-yellow-900/30 text-yellow-300 border-0">{priceAlerts.length}</Badge>
        </div>
        {priceAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-10 h-10 text-[#C7C1B6]/30 mx-auto mb-3" />
            <p className="text-[#C7C1B6] text-sm">No active price alerts.</p>
            <p className="text-[#C7C1B6]/60 text-xs mt-1">Set alerts on the Resale Market to get notified.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {priceAlerts.map((alert) => (
              <div key={alert.eventId} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-900/10 border border-yellow-600/20">
                <Bell className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{alert.eventName}</p>
                  <p className="text-yellow-300/80 text-xs mt-0.5 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Alert when below ${alert.maxPrice}
                  </p>
                </div>
                <Link to={`/resale/event/${alert.eventId}`} className="text-xs text-[#E5381E] hover:underline flex-shrink-0 mr-2">
                  View
                </Link>
                <button
                  onClick={() => removeAlert(alert.eventId)}
                  className="text-[#C7C1B6]/40 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <BellOff className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
