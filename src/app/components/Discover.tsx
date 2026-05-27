import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, DollarSign, BadgeCheck, Bell, TrendingUp, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { mockEvents, mockArtists, mockTickets, genres } from "../data/mockData";
import { useWishlist } from "../context/WishlistContext";
import heroBackground from "../../imports/MusicIndustryAppConcept/0855a66402410ede87ce1fb0b3cf420d5551536e.png";
import geometricPattern from "../../imports/image-10.png";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";

export function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [notificationsEnabled, setNotificationsEnabled] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const handleWishlist = (e: React.MouseEvent, event: typeof mockEvents[0]) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle({
      id: event.id,
      artistId: event.artistId,
      artistName: event.artistName,
      venue: event.venue,
      city: event.city,
      date: event.date,
      time: event.time,
      genre: event.genre,
      price: event.price,
      image: event.image,
    });
    toast[added ? "success" : "info"](
      added ? "Saved to wishlist" : "Removed from wishlist",
      { icon: added ? "❤️" : "🤍" }
    );
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestion("");
      return;
    }
    const query = searchQuery.toLowerCase();
    const allTerms = [
      ...mockArtists.map((a) => a.name),
      ...[...new Set(mockEvents.map((e) => e.city))],
      ...[...new Set(mockEvents.map((e) => e.venue))],
    ];
    const match = allTerms.find(
      (term) => term.toLowerCase().startsWith(query) && term.toLowerCase() !== query
    );
    setSuggestion(match || "");
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Tab" || e.key === "ArrowRight") && suggestion) {
      e.preventDefault();
      setSearchQuery(suggestion);
      setSuggestion("");
    } else if (e.key === "Escape") {
      setSuggestion("");
    }
  };

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || event.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const toggleNotification = (artistId: string) => {
    setNotificationsEnabled((prev) =>
      prev.includes(artistId)
        ? prev.filter((id) => id !== artistId)
        : [...prev, artistId]
    );
  };

  return (
    <div className="relative space-y-6">
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <img
          src={geometricPattern}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Circular Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute left-1/4 -top-60 w-[700px] h-[700px] rounded-full bg-[#242221]"></div>
        <div className="absolute right-0 top-1/2 w-[900px] h-[900px] rounded-full bg-[#242221]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-[#242221] p-8 md:p-12 z-10">
        {/* Background Image with Blur and Darkening */}
        <div className="absolute inset-0">
          <img
            src={heroBackground}
            alt=""
            className="w-full h-full object-cover blur-[2px] brightness-[0.4] opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#242221]/60 via-transparent to-[#242221]/60"></div>
        </div>
        {/* Brand Accent Slab */}
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            The echo of one concert
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E5381E] to-[#E5381E]/80 mb-4">
            calls to the next
          </h3>
          <p className="text-[#C7C1B6] max-w-xl">
            Find concerts, festivals, and tours from your favorite artists. Never miss a show again.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C7C1B6] z-10 pointer-events-none" />

        {/* Ghost text layer */}
        <input
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          value={suggestion}
          className="absolute inset-0 w-full pl-12 pr-4 h-14 rounded-md border border-transparent bg-[#141111]/50 text-[#C7C1B6]/40 text-sm pointer-events-none select-none"
          style={{ caretColor: "transparent" }}
        />

        <Input
          type="text"
          placeholder={!searchQuery ? "Search artists, cities, or venues..." : ""}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="pl-12 h-14 border-[#242221] text-white placeholder:text-[#C7C1B6] focus:border-[#E5381E] relative !bg-transparent"
        />

        {suggestion && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none z-10">
            <kbd className="px-1.5 py-0.5 bg-[#242221] border border-[#C7C1B6]/20 rounded text-[10px] text-[#C7C1B6]/60 font-mono">Tab</kbd>
            <span className="text-xs text-[#C7C1B6]/50">to accept</span>
          </div>
        )}
      </div>

      {/* Genre Filters */}
      <div className="relative z-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {genres.map((genre) => (
          <Button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            variant={selectedGenre === genre ? "default" : "outline"}
            className={`whitespace-nowrap ${
              selectedGenre === genre
                ? "bg-[#E5381E] text-white border-0"
                : "bg-[#141111]/50 text-[#C7C1B6] border-[#242221] hover:bg-[#E5381E]/20 hover:text-white"
            }`}
          >
            {genre}
          </Button>
        ))}
      </div>

      {/* For You - Personalized Recommendations */}
      {selectedGenre === "All" && !searchQuery && (() => {
        const preferredGenres = new Set(
          mockTickets
            .map((t) => mockEvents.find((e) => e.id === t.eventId)?.genre)
            .filter((g): g is string => Boolean(g))
        );
        const recommended = mockEvents
          .filter((e) => preferredGenres.has(e.genre))
          .slice(0, 4);

        if (recommended.length === 0) return null;

        return (
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
              <Sparkles className="w-5 h-5 text-[#C7C1B6]" />
              <h3 className="text-xl font-bold text-white">For You</h3>
              <span className="text-sm text-[#C7C1B6]">based on your tickets</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
              {recommended.map((event) => (
                <Link key={event.id} to={`/event/${event.id}`} className="flex">
                  <Card className="bg-[#141111]/50 border-[#242221] overflow-hidden hover:bg-[#E5381E]/10 transition-all group cursor-pointer flex flex-col w-full">
                    <div className="aspect-video overflow-hidden relative flex-shrink-0">
                      <img
                        src={event.artistId === "1" ? bmthImage : event.artistId === "7" ? architectsImage : event.artistId === "8" ? hunnaImage : event.artistId === "9" ? punctualImage : event.artistId === "10" ? foalsImage : event.image}
                        alt={event.artistName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#242221] to-transparent"></div>
                      <Badge className="absolute top-3 left-3 bg-[#E5381E]/90 text-white border-0">
                        {event.genre}
                      </Badge>
                      <button
                        onClick={(e) => handleWishlist(e, event)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isWishlisted(event.id)
                            ? "bg-[#E5381E] text-white"
                            : "bg-black/40 text-white hover:bg-[#E5381E]"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted(event.id) ? "fill-white" : ""}`} />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#C7C1B6] transition-colors">
                        {event.artistName}
                      </h4>
                      <div className="space-y-2 text-sm text-[#C7C1B6] flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#C7C1B6] flex-shrink-0" />
                          <span>{event.venue}, {event.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#C7C1B6] flex-shrink-0" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 mt-auto">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-white font-semibold">${event.price}</span>
                          </div>
                          <Button size="sm" className="bg-[#E5381E] text-white hover:bg-[#991a0a]">
                            Get Tickets
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Trending Artists block */}
      {(() => {
        const trendingBlock = (
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
              <TrendingUp className="w-5 h-5 text-[#C7C1B6]" />
              <h3 className="text-xl font-bold text-white">Trending Artists</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mockArtists.map((artist) => (
                <Card
                  key={artist.id}
                  className="bg-[#141111]/50 border-[#242221] p-4 hover:bg-[#E5381E]/10 transition-all cursor-pointer group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
                    <img
                      src={artist.id === "1" ? bmthImage : artist.id === "7" ? architectsImage : artist.id === "8" ? hunnaImage : artist.id === "9" ? punctualImage : artist.id === "10" ? foalsImage : artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {artist.verified && (
                      <div className="absolute top-2 right-2 bg-[#E5381E] rounded-full p-1">
                        <BadgeCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1 truncate">
                    {artist.name}
                  </h4>
                  <p className="text-[#C7C1B6] text-xs mb-2">{artist.genre}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleNotification(artist.id)}
                    className={`w-full ${
                      notificationsEnabled.includes(artist.id)
                        ? "bg-[#E5381E]/20 text-[#C7C1B6]"
                        : "text-[#C7C1B6]"
                    }`}
                  >
                    <Bell className="w-3 h-3 mr-1" />
                    <span className="text-xs">
                      {notificationsEnabled.includes(artist.id) ? "Notifying" : "Notify"}
                    </span>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        );

        const eventsBlock = (
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
              <h3 className="text-xl font-bold text-white">
                Upcoming Events {selectedGenre !== "All" && `• ${selectedGenre}`}
              </h3>
            </div>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-[#242221] bg-[#141111]/50">
                    <Skeleton className="aspect-video w-full bg-[#242221]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4 bg-[#242221]" />
                      <Skeleton className="h-3 w-full bg-[#242221]" />
                      <Skeleton className="h-3 w-2/3 bg-[#242221]" />
                      <Skeleton className="h-8 w-24 mt-3 bg-[#E5381E]/20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Link key={event.id} to={`/event/${event.id}`}>
                  <Card className="bg-[#141111]/50 border-[#242221] overflow-hidden hover:bg-[#E5381E]/10 transition-all group cursor-pointer">
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={event.artistId === "1" ? bmthImage : event.artistId === "7" ? architectsImage : event.artistId === "8" ? hunnaImage : event.artistId === "9" ? punctualImage : event.artistId === "10" ? foalsImage : event.image}
                        alt={event.artistName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#242221] to-transparent"></div>
                      <Badge className="absolute top-3 left-3 bg-[#E5381E]/90 text-white border-0">
                        {event.genre}
                      </Badge>
                      <button
                        onClick={(e) => handleWishlist(e, event)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isWishlisted(event.id)
                            ? "bg-[#E5381E] text-white"
                            : "bg-black/40 text-white hover:bg-[#E5381E]"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted(event.id) ? "fill-white" : ""}`} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#C7C1B6] transition-colors">
                        {event.artistName}
                      </h4>
                      <div className="space-y-2 text-sm text-[#C7C1B6]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#C7C1B6]" />
                          <span>
                            {event.venue}, {event.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#C7C1B6]" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-white font-semibold">
                              ${event.price}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#E5381E] text-white hover:bg-[#991a0a]"
                          >
                            Get Tickets
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#C7C1B6] text-lg">
                  No events found. Try adjusting your search or filters.
                </p>
              </div>
            )}
            </>
            )}
          </div>
        );

        return selectedGenre === "All" ? (
          <>{trendingBlock}{eventsBlock}</>
        ) : (
          <>{eventsBlock}{trendingBlock}</>
        );
      })()}
    </div>
  );
}