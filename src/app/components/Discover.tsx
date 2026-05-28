import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, DollarSign, BadgeCheck, Bell, TrendingUp, Sparkles, Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { mockEvents, mockArtists, mockTickets, genres } from "../data/mockData";
import { getGenreColors } from "../utils/genreColors";
import { GeoWaves, GeoArcs } from "./GeometricDecor";
import { useWishlist } from "../context/WishlistContext";
import heroBackground from "../../imports/identity/identity-4.jpg";
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
    if (!searchQuery.trim()) { setSuggestion(""); return; }
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

  const getEventImage = (event: typeof mockEvents[0]) =>
    event.artistId === "1" ? bmthImage
    : event.artistId === "7" ? architectsImage
    : event.artistId === "8" ? hunnaImage
    : event.artistId === "9" ? punctualImage
    : event.artistId === "10" ? foalsImage
    : event.image;

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || event.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Sort by date ascending
  const sortedFilteredEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Use grouped view for genre-specific or search queries
  const isGrouped = selectedGenre !== "All" || searchQuery.trim() !== "";

  // Group events by artistId (preserving date order within each group)
  const artistGroups = Object.values(
    sortedFilteredEvents.reduce((acc, event) => {
      if (!acc[event.artistId]) acc[event.artistId] = [];
      acc[event.artistId].push(event);
      return acc;
    }, {} as Record<string, typeof sortedFilteredEvents>)
  );

  // For "All" ungrouped view: show next 12 soonest events
  const featuredEvents = sortedFilteredEvents.slice(0, 12);

  const toggleNotification = (artistId: string) => {
    setNotificationsEnabled((prev) =>
      prev.includes(artistId)
        ? prev.filter((id) => id !== artistId)
        : [...prev, artistId]
    );
  };

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

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-[#242221] p-8 md:p-12 z-10">
        <div className="absolute inset-0">
          <img
            src={heroBackground}
            alt=""
            className="w-full h-full object-cover brightness-[0.55] opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141111]/80 via-[#141111]/30 to-[#141111]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141111]/60 to-transparent"></div>
        </div>
        <GeoArcs className="absolute -bottom-16 -right-16 w-72 text-[#E5381E] pointer-events-none" opacity={0.25} />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The echo of one concert</h2>
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
        {genres.map((genre) => {
          const gc = genre === "All" ? null : getGenreColors(genre);
          const isActive = selectedGenre === genre;
          return (
            <Button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              variant="outline"
              style={
                isActive && gc
                  ? { backgroundColor: gc.accent, borderColor: gc.accent, color: "#fff" }
                  : isActive
                  ? { backgroundColor: "#E5381E", borderColor: "#E5381E", color: "#fff" }
                  : {}
              }
              className={`whitespace-nowrap transition-all ${
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

      {/* For You — only in "All" view */}
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
                  <Card className="bg-[#141111]/50 border-[#242221] overflow-hidden transition-all group cursor-pointer flex flex-col w-full">
                    <div className="aspect-video overflow-hidden relative flex-shrink-0">
                      <img
                        src={getEventImage(event)}
                        alt={event.artistName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141111] to-transparent"></div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to top, ${getGenreColors(event.genre).accent}33, transparent)` }}></div>
                      <Badge className="absolute top-3 left-3 text-white border-0" style={{ backgroundColor: getGenreColors(event.genre).accent }}>
                        {event.genre}
                      </Badge>
                      <button
                        onClick={(e) => handleWishlist(e, event)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isWishlisted(event.id) ? "bg-[#E5381E] text-white" : "bg-black/40 text-white hover:bg-[#E5381E]"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted(event.id) ? "fill-white" : ""}`} />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#C7C1B6] transition-colors">{event.artistName}</h4>
                      <div className="space-y-2 text-sm text-[#C7C1B6] flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#C7C1B6] flex-shrink-0" />
                          <span>{event.venue}, {event.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#C7C1B6] flex-shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {event.time}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 mt-auto">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-white font-semibold">${event.price}</span>
                          </div>
                          <Button size="sm" className="bg-[#E5381E] text-white hover:bg-[#991a0a]">Get Tickets</Button>
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

      {/* Trending Artists — only in "All" unfiltered view */}
      {selectedGenre === "All" && !searchQuery && (
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
                <h4 className="text-white font-semibold text-sm mb-1 truncate">{artist.name}</h4>
                <p className="text-[#C7C1B6] text-xs mb-2">{artist.genre}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleNotification(artist.id)}
                  className={`w-full ${notificationsEnabled.includes(artist.id) ? "bg-[#E5381E]/20 text-[#C7C1B6]" : "text-[#C7C1B6]"}`}
                >
                  <Bell className="w-3 h-3 mr-1" />
                  <span className="text-xs">{notificationsEnabled.includes(artist.id) ? "Notifying" : "Notify"}</span>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="relative z-10">
        <div className="relative flex items-center gap-2 mb-4">
          <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
          <h3 className="text-xl font-bold text-white">
            Upcoming Events{selectedGenre !== "All" ? ` • ${selectedGenre}` : ""}
            {searchQuery && ` • "${searchQuery}"`}
          </h3>
          <GeoWaves className="absolute right-0 top-1/2 -translate-y-1/2 w-64 text-[#E5381E] pointer-events-none" opacity={0.15} />
        </div>

        {isLoading ? (
          /* Skeleton */
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
        ) : isGrouped ? (
          /* ── Grouped by artist (genre filter or search) ── */
          artistGroups.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {artistGroups.map((events) => {
                const firstEvent = events[0];
                const artist = mockArtists.find((a) => a.id === firstEvent.artistId);
                const gc = getGenreColors(firstEvent.genre);
                return (
                  <Card
                    key={firstEvent.artistId}
                    className="bg-[#141111]/50 border-[#242221] overflow-hidden group"
                  >
                    {/* Artist photo header */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={getEventImage(firstEvent)}
                        alt={firstEvent.artistName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141111] via-[#141111]/20 to-transparent" />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(to top, ${gc.accent}40, transparent)` }}
                      />
                      <Badge
                        className="absolute top-3 left-3 text-white border-0"
                        style={{ backgroundColor: gc.accent }}
                      >
                        {firstEvent.genre}
                      </Badge>
                      {artist?.verified && (
                        <div className="absolute top-3 right-3 bg-[#E5381E] rounded-full p-1">
                          <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-4 right-4">
                        <h4 className="text-white font-bold text-xl leading-tight drop-shadow-lg">
                          {firstEvent.artistName}
                        </h4>
                        <p className="text-[#C7C1B6] text-xs mt-0.5">
                          {events.length} upcoming show{events.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Event rows */}
                    <div className="divide-y divide-[#242221]/60">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                        >
                          {/* Date pill */}
                          <div className="flex-shrink-0 w-9 text-center">
                            <p className="text-[#E5381E] font-bold text-[10px] leading-none uppercase tracking-wide">
                              {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                            </p>
                            <p className="text-white font-bold text-xl leading-tight">
                              {new Date(event.date).getDate()}
                            </p>
                          </div>
                          {/* Venue + city */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{event.venue}</p>
                            <p className="text-[#C7C1B6] text-xs truncate">{event.city} • {event.time}</p>
                          </div>
                          {/* Price + actions */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-green-400 font-semibold text-sm">${event.price}</span>
                            <Link to={`/event/${event.id}/tickets`} onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" className="bg-[#E5381E] text-white hover:bg-[#991a0a] h-7 text-xs px-2.5">
                                Tickets
                              </Button>
                            </Link>
                            <button
                              onClick={(e) => handleWishlist(e, event)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isWishlisted(event.id)
                                  ? "bg-[#E5381E] text-white"
                                  : "bg-[#242221] text-[#C7C1B6] hover:bg-[#E5381E] hover:text-white"
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${isWishlisted(event.id) ? "fill-white" : ""}`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer link */}
                    <Link
                      to={`/event/${events[0].id}`}
                      className="flex items-center justify-end gap-1 px-4 py-2.5 text-[#C7C1B6] hover:text-[#E5381E] text-xs transition-colors border-t border-[#242221]/60"
                    >
                      View details
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#C7C1B6] text-lg">No events found. Try adjusting your search or filters.</p>
            </div>
          )
        ) : (
          /* ── Individual cards for "All" unfiltered view ── */
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <Link key={event.id} to={`/event/${event.id}`}>
                  <Card className="bg-[#141111]/50 border-[#242221] overflow-hidden transition-all group cursor-pointer">
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={getEventImage(event)}
                        alt={event.artistName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141111] to-transparent"></div>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(to top, ${getGenreColors(event.genre).accent}33, transparent)` }}
                      ></div>
                      <Badge
                        className="absolute top-3 left-3 text-white border-0"
                        style={{ backgroundColor: getGenreColors(event.genre).accent }}
                      >
                        {event.genre}
                      </Badge>
                      <button
                        onClick={(e) => handleWishlist(e, event)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isWishlisted(event.id) ? "bg-[#E5381E] text-white" : "bg-black/40 text-white hover:bg-[#E5381E]"
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
                          <span>{event.venue}, {event.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#C7C1B6]" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
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
            {sortedFilteredEvents.length > 12 && (
              <div className="text-center mt-6">
                <Link to="/events">
                  <Button
                    variant="outline"
                    className="bg-[#141111]/50 text-[#C7C1B6] border-[#242221] hover:bg-[#C7C1B6] hover:text-[#E5381E] hover:border-[#C7C1B6]"
                  >
                    See all {sortedFilteredEvents.length} upcoming events
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
