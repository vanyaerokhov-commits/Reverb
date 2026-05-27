import { useState } from "react";
import { useParams, Link } from "react-router";
import { MapPin, Calendar, Clock, DollarSign, Share2, Heart, ChevronLeft, Users, Music2, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { mockEvents, mockArtists } from "../data/mockData";
import { useWishlist } from "../context/WishlistContext";
import { downloadCalendar } from "../utils/calendarExport";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";
import geometricPattern from "../../imports/image-10.png";

export function EventDetail() {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);
  const artist = event ? mockArtists.find((a) => a.id === event.artistId) : null;
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggle, isWishlisted } = useWishlist();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", { description: "Share it with your friends", icon: "🔗" });
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleWishlist = () => {
    if (!event) return;
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

  const handleCalendar = () => {
    if (!event) return;
    downloadCalendar({
      title: event.artistName,
      startDate: event.date,
      startTime: event.time,
      venue: event.venue,
      city: event.city,
      country: event.country,
    });
    toast.success("Calendar event downloaded!", { icon: "📅" });
  };

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-[#C7C1B6] text-lg">Event not found</p>
        <Link to="/">
          <Button className="mt-4 bg-gradient-to-r from-[#E5381E] to-[#E5381E]/80 text-white">
            Back to Discover
          </Button>
        </Link>
      </div>
    );
  }

  const relatedEvents = mockEvents
    .filter((e) => e.genre === event.genre && e.id !== event.id)
    .slice(0, 3);

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
        <div className="absolute -left-40 -top-40 w-[600px] h-[600px] rounded-full bg-[#242221]"></div>
        <div className="absolute -right-60 top-1/3 w-[800px] h-[800px] rounded-full bg-[#242221]"></div>
      </div>

      {/* Back Button */}
      <Link to="/" className="relative z-10 inline-block">
        <Button
          variant="ghost"
          className="text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E]"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </Link>

      {/* Hero Image */}
      <Card className="relative z-10 overflow-hidden border-[#242221] bg-[#141111]/50">
        <div className="relative h-96">
          <img
            src={event.artistId === "1" ? bmthImage : event.artistId === "7" ? architectsImage : event.artistId === "8" ? hunnaImage : event.artistId === "9" ? punctualImage : event.artistId === "10" ? foalsImage : event.image}
            alt={event.artistName}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141111] via-[#141111]/50 to-transparent"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              onClick={handleWishlist}
              className="bg-[#E5381E] hover:bg-[#991a0a] text-white transition-colors"
              title={isWishlisted(event.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${isWishlisted(event.id) ? "fill-white" : ""}`} />
            </Button>
            <Button
              size="icon"
              onClick={handleShare}
              className="bg-[#E5381E] hover:bg-[#991a0a] text-white"
              title="Share event"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <Badge className="bg-[#E5381E] text-white border-0 mb-3">
              {event.genre}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {event.artistName}
            </h1>
            <p className="text-xl text-slate-300">
              {event.venue}, {event.city}
            </p>
          </div>
        </div>
      </Card>

      <div className="relative z-10 grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Info */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
              <h2 className="text-2xl font-bold text-white">Event Details</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E5381E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#C7C1B6]" />
                </div>
                <div>
                  <p className="text-sm text-[#C7C1B6] mb-1">Date</p>
                  <p className="text-white font-semibold">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E5381E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#C7C1B6]" />
                </div>
                <div>
                  <p className="text-sm text-[#C7C1B6] mb-1">Time</p>
                  <p className="text-white font-semibold">{event.time}</p>
                  <p className="text-sm text-[#C7C1B6]">Doors open 1 hour earlier</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E5381E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#C7C1B6]" />
                </div>
                <div>
                  <p className="text-sm text-[#C7C1B6] mb-1">Venue</p>
                  <p className="text-white font-semibold">{event.venue}</p>
                  <p className="text-sm text-[#C7C1B6]">
                    {event.city}, {event.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-[#C7C1B6] mb-1">Price</p>
                  <p className="text-white font-semibold text-2xl">
                    ${event.price}
                  </p>
                  <p className="text-sm text-[#C7C1B6]">Starting from</p>
                </div>
              </div>
            </div>
          </Card>

          {/* About the Artist */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
              <h2 className="text-2xl font-bold text-white">About {event.artistName}</h2>
            </div>
            <div className="flex items-center gap-4 mb-4">
              {artist && (
                <Link to={`/artist/${artist.id}`} className="flex-shrink-0 group relative">
                  <img
                    src={artist.id === "1" ? bmthImage : artist.id === "7" ? architectsImage : artist.id === "8" ? hunnaImage : artist.id === "9" ? punctualImage : artist.image}
                    alt={artist.name}
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#E5381E] transition-all"
                  />
                </Link>
              )}
              <div>
                <Link to={`/artist/${event.artistId}`} className="hover:text-[#E5381E] transition-colors">
                  <h3 className="text-xl font-bold text-white">{event.artistName}</h3>
                </Link>
                <p className="text-[#C7C1B6]">{event.genre} • Verified Artist</p>
              </div>
            </div>
            <Separator className="my-4 bg-[#242221]" />
            <div className="text-slate-300 leading-relaxed space-y-3">
              {event.artistId === "9" ? (
                <>
                  <p>
                    Punctual is a rising UK-based electronic music producer and DJ known for his sharp, groove-driven sound that blends house, bass music, and melodic electronic production. With a meticulous approach to rhythm and arrangement — true to his name — Punctual has become a standout voice in the new wave of British electronic artists.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> His productions are defined by punchy basslines, layered synth textures, and an infectious energy that translates seamlessly from headphones to the dancefloor. He draws influence from UK garage, future bass, and deep house, crafting tracks that are both club-ready and emotionally resonant.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Highlights:</span> Punctual has gained significant traction through support from tastemaker blogs and playlist placements across major streaming platforms. He has performed at prominent UK venues and festivals, steadily building a loyal fanbase across Europe.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Latest Release:</span> His most recent project showcases a more mature, atmospheric direction while retaining the dancefloor-focused energy that first put him on the map.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Based in:</span> United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "10" ? (
                <>
                  <p>
                    Foals are an English rock band from Oxford, formed in 2005. Renowned for their hypnotic rhythms, intricate guitar work, and frontman Yannis Philippakis's soaring vocals, they have grown from an underground cult act into one of Britain's most celebrated alternative rock bands.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Current Lineup:</span> Yannis Philippakis (vocals, guitar), Jack Bevan (drums), Jimmy Smith (guitar), Edwin Congreave (keyboards), Walter Gervers (bass).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Foals blend art rock, math rock, and dance-punk into a sound that is both cerebral and physically infectious. Their music is characterised by interlocking polyrhythmic guitars, driving grooves, and atmospheric builds that surge into euphoric crescendos.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Antidotes (2008), Total Life Forever (2010), Holy Fire (2013), What Went Down (2015), Everything Not Saved Will Be Lost Pt. 1 &amp; Pt. 2 (2019), Life Is Yours (2022).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Oxford, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "8" ? (
                <>
                  <p>
                    The Hunna are a British indie rock band from Hertfordshire, England, formed in 2015. Blending catchy guitar-driven hooks with raw, emotionally charged lyricism, they quickly rose through the UK indie scene and built a devoted international fanbase.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Current Lineup:</span> Ryan Potter (vocals, guitar), Dan Dorney (guitar), Jermaine Angin (bass), Jack Metcalfe (drums).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Known for high-energy live performances and an anthemic sound at the crossroads of indie rock, alternative, and pop-punk — driving guitar riffs, melodic choruses, and honest storytelling.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> 100 (2016, UK Top 40), Dare (2018), Vision (2020). The band continues to tour extensively across the UK, Europe, and North America.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Hertfordshire, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "7" ? (
                <>
                  <p>
                    Architects are a highly influential British metalcore band from Brighton, England, formed in 2004 by twin brothers Dan and Tom Searle. Known for fusing crushing riffs with emotional, purpose-driven songwriting, they have become a defining force in modern heavy music.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Current Lineup:</span> Sam Carter (vocals), Dan Searle (drums), Alex Dean (bass), Adam Christianson (guitar).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Evolution:</span> They started with chaotic, rhythmically complex mathcore and later moved into atmospheric and melodic metalcore. In recent years the band has embraced alternative metal and industrial-influenced anthems.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Lost Forever // Lost Together (2014), All Our Gods Have Abandoned Us (2016), and their latest album The Sky, The Earth &amp; All Between (2025).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Brighton, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p>
                    Bring Me The Horizon is a five-piece band from Sheffield, England. Despite only forming in March 2004, the band has gathered a surprisingly large fan base both in the UK and the U.S. Their debut EP, This Is What The Edge Of Your Seat Was Made For, came out in December 2004 and was the first release from the independent label Thirty Days Of Night Records.
                  </p>
                  {isExpanded && (
                    <>
                      <p>
                        The band has since embarked on a number of UK tours supporting well-established bands such as Bleeding Through and Aiden, and also signed with Visible Noise Records in the autumn of 2005. The EP was re-released in January 2006 via Visible Noise, to a mainly positive critical response.
                      </p>
                      <p>
                        In September 2006 the band won Best British Newcomer at the Kerrang! Magazine Awards. Their debut album, Count Your Blessings, was released on 30th October 2006 amid a large headlining UK tour.
                      </p>
                      <div className="pt-2 border-t border-[#242221]">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Band Members:</span> Matt Kean: bass | Oliver Sykes: vocals | Matthew Nicholls: drums | Lee Malia: guitars
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold text-white">Hometown:</span> Sheffield, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#E5381E] hover:text-[#E5381E]/80 font-medium transition-colors"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            </div>
          </Card>

          {/* Map Placeholder */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
              <h2 className="text-2xl font-bold text-white">Location</h2>
            </div>
            <div className="aspect-video bg-[#242221] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#C7C1B6] mx-auto mb-2" />
                <p className="text-[#C7C1B6]">Map Integration</p>
                <p className="text-sm text-[#C7C1B6]">
                  {event.venue}, {event.city}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90"
            >
              Get Directions
            </Button>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/50 p-6 relative overflow-hidden self-start">
            <div className="text-center mb-6 relative z-10">
              <p className="text-sm text-[#C7C1B6] mb-2">Starting from</p>
              <p className="text-4xl font-bold text-white mb-1">
                ${event.price}
              </p>
              <p className="text-sm text-[#C7C1B6]">+ fees</p>
            </div>
            <Link to={`/event/${event.id}/tickets`}>
              <Button className="w-full bg-[#E5381E] text-white hover:bg-[#991a0a] h-12 text-lg font-semibold mb-3">
                Get Tickets
              </Button>
            </Link>
            <Button
              onClick={handleWishlist}
              variant="outline"
              className="w-full mb-2 bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90 transition-colors"
            >
              <Heart className={`w-4 h-4 mr-2 ${isWishlisted(event.id) ? "fill-[#E5381E]" : ""}`} />
              {isWishlisted(event.id) ? "Saved to Wishlist" : "Add to Wishlist"}
            </Button>
            <Button
              onClick={handleCalendar}
              variant="outline"
              className="w-full bg-transparent border-[#242221] text-[#C7C1B6] hover:bg-[#242221] hover:text-white"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
            <Separator className="my-4 bg-[#242221]" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C7C1B6]" />
                  Interested
                </span>
                <span className="font-semibold text-white">2.4K</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-[#C7C1B6]" />
                  Going
                </span>
                <span className="font-semibold text-white">856</span>
              </div>
            </div>
          </Card>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <Card className="bg-[#141111]/50 border-[#242221] p-6 relative mt-4">
                <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-[#E5381E] rounded-[10px] -ml-1"></div>
                <h3 className="text-lg font-bold text-white">
                  More {event.genre} Events
                </h3>
              </div>
              <div className="space-y-4">
                {relatedEvents.map((relatedEvent) => (
                  <Link key={relatedEvent.id} to={`/event/${relatedEvent.id}`}>
                    <div className="flex gap-3 hover:bg-[#E5381E]/10 p-2 rounded-lg transition-colors cursor-pointer">
                      <img
                        src={relatedEvent.artistId === "1" ? bmthImage : relatedEvent.artistId === "7" ? architectsImage : relatedEvent.artistId === "8" ? hunnaImage : relatedEvent.artistId === "9" ? punctualImage : relatedEvent.image}
                        alt={relatedEvent.artistName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">
                          {relatedEvent.artistName}
                        </p>
                        <p className="text-xs text-[#C7C1B6] truncate">
                          {relatedEvent.city}
                        </p>
                        <p className="text-xs text-[#C7C1B6]">
                          {new Date(relatedEvent.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
