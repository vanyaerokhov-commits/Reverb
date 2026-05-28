import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ChevronLeft,
  Star,
  Tag,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  ShieldCheck,
  MessageCircle,
  Send,
  X,
  CheckCircle2,
  BadgeCheck,
  Zap,
  Trophy,
  ThumbsUp,
  Users,
  Package,
  Clock,
  Music,
  Sparkles,
  Globe,
  DollarSign,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  mockUserProfiles,
  mockUserReviews,
  mockResaleTickets,
  mockArtists,
  ResaleTicket,
} from "../data/mockData";
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

function getAvatarGradient(username: string) {
  const gradients = [
    "from-[#E5381E]/70 to-[#E5381E]/20",
    "from-purple-600/70 to-purple-600/20",
    "from-blue-600/70 to-blue-600/20",
    "from-emerald-600/70 to-emerald-600/20",
    "from-amber-600/70 to-amber-600/20",
    "from-pink-600/70 to-pink-600/20",
    "from-cyan-600/70 to-cyan-600/20",
  ];
  const idx =
    username.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    gradients.length;
  return gradients[idx];
}

/** Deterministic fake fan stats from username */
function getFanStats(username: string) {
  const h = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    concerts: ((h * 7) % 95) + 8,
    countries: ((h * 3) % 11) + 1,
    artists: ((h * 11) % 58) + 5,
    totalSpent: ((h * 17) % 4200) + 350,
  };
}

/** Genre breakdown using user's genre list + deterministic weights */
function getGenreBreakdown(genres: string[], username: string) {
  if (!genres.length) return [];
  const h = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const raw = genres.slice(0, 5).map((g, i) => ({
    genre: g,
    weight: Math.max(2, ((h * (i * 7 + 5)) % 14) + (i === 0 ? 14 : 2)),
  }));
  const total = raw.reduce((s, r) => s + r.weight, 0);
  // normalise to 100 and keep them summing correctly
  let remaining = 100;
  return raw.map((r, i) => {
    const pct =
      i === raw.length - 1
        ? remaining
        : Math.round((r.weight / total) * 100);
    remaining -= pct;
    return { genre: r.genre, pct };
  });
}

/** A small badge set derived from user stats */
function getAchievements(salesCount: number, genres: string[], joinDate: string) {
  const yearsActive =
    (Date.now() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  return [
    {
      id: "a1",
      name: "First Concert",
      description: "Attended their first live event",
      icon: Music,
      earned: true,
    },
    {
      id: "a2",
      name: "Festival Devotee",
      description: "Attended 10+ different events",
      icon: Trophy,
      earned: salesCount >= 10,
      progress: Math.min(salesCount, 10),
      total: 10,
    },
    {
      id: "a3",
      name: "Genre Explorer",
      description: "Into 3+ different genres",
      icon: Sparkles,
      earned: genres.length >= 3,
      progress: Math.min(genres.length, 3),
      total: 3,
    },
    {
      id: "a4",
      name: "World Traveller",
      description: "Attended shows in 3+ countries",
      icon: Globe,
      earned: true,
    },
    {
      id: "a5",
      name: "Trusted Seller",
      description: "Completed 20+ verified sales",
      icon: ShieldCheck,
      earned: salesCount >= 20,
      progress: Math.min(salesCount, 20),
      total: 20,
    },
    {
      id: "a6",
      name: "Community Veteran",
      description: "Active member for 1+ year",
      icon: Star,
      earned: yearsActive >= 1,
    },
  ];
}

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sz} ${
            i <= Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-[#C7C1B6]/20 fill-[#C7C1B6]/10"
          }`}
        />
      ))}
    </div>
  );
}

const QUICK_REPLIES = [
  "Is this ticket still available?",
  "Can you send a photo of the ticket?",
  "Would you consider a lower price?",
];

export function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const user = mockUserProfiles.find((u) => u.username === username);
  const userListings = mockResaleTickets.filter((t) => t.seller === username);
  const userReviews = mockUserReviews.filter((r) => r.sellerUsername === username);

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [boughtId, setBoughtId] = useState<string | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Users className="w-12 h-12 text-[#C7C1B6] mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
        <p className="text-[#C7C1B6] mb-6">This profile doesn't exist or has been removed.</p>
        <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a]" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

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
    setTimeout(() => navigate("/cart"), 600);
  };

  const openMessage = () => {
    setMessageText(`Hi ${user.displayName}, I'm interested in one of your listings. `);
    setMessageSent(false);
    setMessageOpen(true);
  };

  const handleSend = () => {
    setMessageSent(true);
    setTimeout(() => { setMessageOpen(false); setMessageSent(false); setMessageText(""); }, 2200);
  };

  const memberSince = new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const positiveReviews = userReviews.filter((r) => r.rating >= 4).length;
  const positivePct = userReviews.length > 0 ? Math.round((positiveReviews / userReviews.length) * 100) : 100;

  const fanStats = getFanStats(user.username);
  const genreBreakdown = getGenreBreakdown(user.genres, user.username);
  const achievements = getAchievements(user.salesCount, user.genres, user.joinDate);
  const earnedCount = achievements.filter((a) => a.earned).length;
  const visibleAchievements = showAllAchievements ? achievements : achievements.slice(0, 4);

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

      {/* Back */}
      <div className="relative z-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-[#C7C1B6] hover:text-white transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" />Back
        </button>
      </div>

      {/* ── PROFILE HERO ── */}
      <Card className="relative z-10 bg-gradient-to-br from-[#141111]/80 to-[#242221]/60 border-[#E5381E]/20 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#E5381E]/30 via-[#E5381E]/10 to-transparent relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(229,56,30,0.1) 10px, rgba(229,56,30,0.1) 11px)" }} />
        </div>
        <div className="px-6 pb-6 -mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getAvatarGradient(user.username)} border-2 border-[#242221] flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <span className="text-white font-bold text-3xl uppercase">{user.username[0]}</span>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
                {user.verified && <BadgeCheck className="w-5 h-5 text-[#E5381E] flex-shrink-0" />}
              </div>
              <p className="text-[#C7C1B6] text-sm mb-2">@{user.username}</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <StarRow rating={user.rating} />
                  <span className="text-yellow-400 text-sm font-bold">{user.rating.toFixed(1)}</span>
                </div>
                <span className="text-[#C7C1B6] text-xs">·</span>
                <span className="text-[#C7C1B6] text-sm">{user.salesCount} sales</span>
                <span className="text-[#C7C1B6] text-xs">·</span>
                <div className="flex items-center gap-1 text-[#C7C1B6] text-sm">
                  <Clock className="w-3.5 h-3.5" />Member since {memberSince}
                </div>
              </div>
            </div>
            <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a] h-10 px-5 flex-shrink-0" onClick={openMessage}>
              <MessageCircle className="w-4 h-4 mr-2" />Message
            </Button>
          </div>
          <p className="text-[#C7C1B6] text-sm mt-4 leading-relaxed max-w-2xl">{user.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {user.genres.map((g) => (
              <span key={g} className="text-xs px-2.5 py-1 bg-[#E5381E]/10 border border-[#E5381E]/20 text-[#C7C1B6] rounded-full">{g}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* ── FAN STATS ── */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/30 border-[#242221] p-5 text-center">
          <div className="w-11 h-11 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Music className="w-5 h-5 text-[#C7C1B6]" />
          </div>
          <p className="text-3xl font-bold text-white mb-0.5">{fanStats.concerts}</p>
          <p className="text-xs text-[#C7C1B6]">Concerts</p>
        </Card>
        <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/30 border-[#242221] p-5 text-center">
          <div className="w-11 h-11 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Globe className="w-5 h-5 text-[#C7C1B6]" />
          </div>
          <p className="text-3xl font-bold text-white mb-0.5">{fanStats.countries}</p>
          <p className="text-xs text-[#C7C1B6]">Countries</p>
        </Card>
        <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/30 border-[#242221] p-5 text-center">
          <div className="w-11 h-11 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Star className="w-5 h-5 text-[#C7C1B6]" />
          </div>
          <p className="text-3xl font-bold text-white mb-0.5">{fanStats.artists}</p>
          <p className="text-xs text-[#C7C1B6]">Artists seen</p>
        </Card>
        <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/30 border-[#242221] p-5 text-center">
          <div className="w-11 h-11 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-0.5">${fanStats.totalSpent.toLocaleString()}</p>
          <p className="text-xs text-[#C7C1B6]">Total spent</p>
        </Card>
      </div>

      {/* ── SELLER STATS ── */}
      <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
          <Package className="w-5 h-5 text-[#E5381E] mx-auto mb-1.5" />
          <p className="text-xl font-bold text-white">{userListings.length}</p>
          <p className="text-xs text-[#C7C1B6] mt-0.5">Active listings</p>
        </Card>
        <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
          <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-white">{user.salesCount}</p>
          <p className="text-xs text-[#C7C1B6] mt-0.5">Completed sales</p>
        </Card>
        <Card className="bg-[#141111]/50 border-[#242221] p-4 text-center">
          <ThumbsUp className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-white">{positivePct}%</p>
          <p className="text-xs text-[#C7C1B6] mt-0.5">Positive reviews</p>
        </Card>
      </div>

      {/* Trust badges */}
      {(user.verified || user.topSeller || user.fastResponder) && (
        <div className="relative z-10 flex flex-wrap gap-2">
          {user.verified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141111]/50 border border-[#242221] rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5381E]" />
              <span className="text-xs text-[#C7C1B6] font-medium">Identity Verified</span>
            </div>
          )}
          {user.topSeller && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141111]/50 border border-yellow-500/30 rounded-full">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">Top Seller</span>
            </div>
          )}
          {user.fastResponder && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141111]/50 border border-blue-500/30 rounded-full">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">Fast Responder</span>
            </div>
          )}
        </div>
      )}

      {/* ── MUSIC TASTE ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]" />
          <Sparkles className="w-5 h-5 text-[#C7C1B6]" />
          <h2 className="text-xl font-bold text-white">Music Taste</h2>
        </div>
        <Card className="bg-[#141111]/50 border-[#242221] p-6">
          <div className="space-y-4">
            {genreBreakdown.map(({ genre, pct }) => (
              <div key={genre}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white">{genre}</span>
                  <span className="text-[#C7C1B6]">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2 bg-[#C7C1B6]/20 [&>div]:bg-[#C7C1B6]" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── ACHIEVEMENTS ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]" />
          <Trophy className="w-5 h-5 text-[#C7C1B6]" />
          <h2 className="text-xl font-bold text-white">Achievements</h2>
          <Badge className="ml-auto bg-[#E5381E]/20 text-[#C7C1B6] border-[#E5381E]/30">
            {earnedCount}/{achievements.length} earned
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {visibleAchievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <Card key={ach.id} className={`p-5 ${ach.earned ? "bg-gradient-to-r from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/40" : "bg-[#141111]/50 border-[#242221] opacity-60"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${ach.earned ? "bg-gradient-to-br from-[#E5381E] to-[#E5381E]/70" : "bg-[#242221]"}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white">{ach.name}</h4>
                      {ach.earned && <Badge className="bg-[#E5381E] text-white border-0 text-xs flex-shrink-0">Earned</Badge>}
                    </div>
                    <p className="text-xs text-[#C7C1B6] mb-2">{ach.description}</p>
                    {"progress" in ach && !ach.earned && ach.progress !== undefined && ach.total !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs text-[#C7C1B6] mb-1">
                          <span>Progress</span><span>{ach.progress}/{ach.total}</span>
                        </div>
                        <Progress value={(ach.progress / ach.total) * 100} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {achievements.length > 4 && (
          <button onClick={() => setShowAllAchievements(!showAllAchievements)} className="mt-3 w-full py-2 text-sm text-[#C7C1B6] hover:text-white flex items-center justify-center gap-2 transition-colors">
            {showAllAchievements ? "Show less ↑" : `Show all ${achievements.length} achievements ↓`}
          </button>
        )}
      </div>

      {/* ── ACTIVE LISTINGS ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]" />
          <h2 className="text-xl font-bold text-white">Active Listings</h2>
          {userListings.length > 0 && <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0">{userListings.length}</Badge>}
        </div>
        {userListings.length === 0 ? (
          <Card className="bg-[#141111]/50 border-[#242221] p-8 text-center">
            <Package className="w-10 h-10 text-[#C7C1B6] mx-auto mb-3" />
            <p className="text-[#C7C1B6]">No active listings at the moment.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {userListings.map((ticket) => {
              const isPriceUp = ticket.resalePrice > ticket.originalPrice;
              const pricePct = Math.round((Math.abs(ticket.resalePrice - ticket.originalPrice) / ticket.originalPrice) * 100);
              const isBought = boughtId === ticket.id;
              return (
                <Card key={ticket.id} className="bg-[#141111]/50 border-[#242221] overflow-hidden hover:border-[#E5381E]/30 transition-all group">
                  <div className="aspect-video overflow-hidden relative">
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
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p className="text-[#C7C1B6] text-xs">{ticket.section}</p>
                        <p className="text-white text-xs">{ticket.seat}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#C7C1B6] text-xs line-through">${ticket.originalPrice.toFixed(2)}</p>
                        <p className="text-white text-2xl font-bold leading-none">${ticket.resalePrice.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-[#242221]">
                      <Button size="sm" className={`flex-1 h-9 font-semibold transition-all ${isBought ? "bg-green-600 hover:bg-green-600 text-white" : "bg-[#E5381E] hover:bg-[#991a0a] text-white"}`} onClick={() => handleBuy(ticket)} disabled={isBought}>
                        {isBought ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Added</> : <><Tag className="w-3.5 h-3.5 mr-1.5" />Buy · ${ticket.resalePrice.toFixed(2)}</>}
                      </Button>
                      <Link to={`/resale/event/${ticket.eventId}`}>
                        <Button size="sm" variant="outline" className="h-9 border-[#242221] bg-transparent text-[#C7C1B6] hover:bg-[#242221] hover:text-white">All sellers</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── REVIEWS ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]" />
          <h2 className="text-xl font-bold text-white">Reviews</h2>
          {userReviews.length > 0 && <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0">{userReviews.length}</Badge>}
        </div>
        {userReviews.length === 0 ? (
          <Card className="bg-[#141111]/50 border-[#242221] p-8 text-center">
            <Star className="w-10 h-10 text-[#C7C1B6] mx-auto mb-3" />
            <p className="text-[#C7C1B6]">No reviews yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {userReviews.map((review) => (
              <Card key={review.id} className="bg-[#141111]/50 border-[#242221] p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(review.buyerUsername)} flex items-center justify-center flex-shrink-0`}>
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

      {/* ── MESSAGE DIALOG ── */}
      {messageOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setMessageOpen(false); setMessageSent(false); } }}>
          <Card className="w-full max-w-lg bg-[#141111] border-[#242221] shadow-2xl">
            {messageSent ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
                <p className="text-[#C7C1B6]"><span className="text-white font-semibold">{user.displayName}</span> will be notified and can reply via the app.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-[#242221]">
                  <div>
                    <h3 className="text-white font-bold text-lg">Message {user.displayName}</h3>
                    <p className="text-[#C7C1B6] text-sm">@{user.username}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-[#C7C1B6] hover:text-white hover:bg-[#242221]" onClick={() => setMessageOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-[#242221]/60 rounded-xl">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarGradient(user.username)} border border-[#E5381E]/20 flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-base uppercase">{user.username[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{user.displayName}</p>
                      <div className="flex items-center gap-1.5">
                        <StarRow rating={user.rating} />
                        <span className="text-yellow-400 text-xs font-semibold">{user.rating.toFixed(1)}</span>
                        <span className="text-[#C7C1B6] text-xs">· {user.salesCount} sales</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#C7C1B6] text-xs font-medium mb-2 uppercase tracking-wide">Quick questions</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((q) => (
                        <button key={q} onClick={() => setMessageText(q)} className="text-xs px-3 py-1.5 bg-[#242221] hover:bg-[#E5381E]/20 border border-[#242221] hover:border-[#E5381E]/40 text-[#C7C1B6] hover:text-white rounded-full transition-colors">{q}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[#C7C1B6] text-xs font-medium mb-2 uppercase tracking-wide">Your message</p>
                    <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={4} placeholder={`Hi ${user.displayName}…`} className="w-full bg-[#242221]/80 border border-[#242221] hover:border-[#C7C1B6]/20 focus:border-[#E5381E]/50 rounded-xl p-3 text-white text-sm placeholder:text-[#C7C1B6]/50 resize-none outline-none transition-colors" />
                  </div>
                  <Button className="w-full h-11 bg-[#E5381E] hover:bg-[#991a0a] text-white font-semibold" disabled={!messageText.trim()} onClick={handleSend}>
                    <Send className="w-4 h-4 mr-2" />Send Message
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
