import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

/** Precise venue coordinates */
const VENUE_COORDS: Record<string, [number, number]> = {
  "Madison Square Garden": [40.7505, -73.9934],
  "Electric Ballroom":     [51.5395,  -0.1428],
  "O2 Academy Brixton":    [51.4651,  -0.1148],
  "O2 Arena":              [51.5030,   0.0038],
  "United Center":         [41.8807, -87.6742],
  "Blue Note":             [40.7296, -74.0021],
  "Alexandra Palace":      [51.5960,  -0.1238],
  "Berghain":              [52.5111,  13.4402],
  "Fabric":                [51.5203,  -0.1009],
  "Roundhouse":            [51.5437,  -0.1480],
  "Royal Albert Hall":     [51.5009,  -0.1774],
  "SSE Arena Wembley":     [51.5562,  -0.2797],
  "Wembley Stadium":       [51.5560,  -0.2796],
  "Columbiahalle":         [52.4892,  13.3530],
  "Brooklyn Steel":        [40.7221,  -73.9442],
  "AO Arena":              [53.4858,   -2.2462],
  "Tempodrom":             [52.5046,  13.3727],
};

const CITY_FALLBACK: Record<string, [number, number]> = {
  "New York":    [40.7128, -74.0060],
  London:        [51.5074,  -0.1278],
  Chicago:       [41.8781, -87.6298],
  Berlin:        [52.5200,  13.4050],
  Paris:         [48.8566,   2.3522],
  Manchester:    [53.4808,  -2.2426],
  Brighton:      [50.8229,  -0.1363],
};

function VenueMap({ venue, city, artistName }: { venue: string; city: string; artistName: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const coord = VENUE_COORDS[venue] ?? CITY_FALLBACK[city];
    if (!coord) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false });
    mapInstanceRef.current = map;

    // Enable scroll zoom only while hovering over the map
    const container = mapRef.current;
    const enableScroll  = () => map.scrollWheelZoom.enable();
    const disableScroll = () => map.scrollWheelZoom.disable();
    container.addEventListener("mouseenter", enableScroll);
    container.addEventListener("mouseleave", disableScroll);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="width:34px;height:34px;background:#E5381E;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
             </div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    map.setView(coord, 15);

    L.marker(coord, { icon: pinIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:sans-serif;min-width:160px;padding:4px 0"><b style="color:#E5381E;font-size:13px">${artistName}</b><br/><span style="color:#555;font-size:12px">${venue}<br/>${city}</span></div>`
      )
      .openPopup();

    return () => {
      container.removeEventListener("mouseenter", enableScroll);
      container.removeEventListener("mouseleave", disableScroll);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [venue, city, artistName]);

  return <div ref={mapRef} style={{ width: "100%", height: "280px", borderRadius: "8px" }} />;
}

function getArtistImagePosition(artistId: string): string {
  if (artistId === "24") return "object-[50%_40%]"; // Dua Lipa – tight crop, show mid-face
  if (["23", "25"].includes(artistId)) return "object-[50%_20%]";
  return "object-top";
}

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="relative z-10 text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E]"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Discover
      </Button>

      {/* Hero Image */}
      <Card className="relative z-10 overflow-hidden border-[#242221] bg-[#141111]/50">
        <div className="relative h-56 sm:h-80 md:h-96">
          <img
            src={event.artistId === "1" ? bmthImage : event.artistId === "7" ? architectsImage : event.artistId === "8" ? hunnaImage : event.artistId === "9" ? punctualImage : event.artistId === "10" ? foalsImage : event.image}
            alt={event.artistName}
            className={`w-full h-full object-cover ${getArtistImagePosition(event.artistId)}`}
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
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              {event.artistName}
            </h1>
            <p className="text-sm sm:text-xl text-slate-300">
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
              ) : event.artistId === "11" ? (
                <>
                  <p>
                    Bad Omens are an American rock band from Richmond, Virginia, formed in 2015. Fronted by the charismatic Noah Sebastian, they have rapidly evolved from a bedroom project into one of the most exciting forces in modern metalcore and alternative metal, blending crushing heaviness with an undeniable pop sensibility.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Current Lineup:</span> Noah Sebastian (vocals), Nicholas Ruffilo (bass), Nicholas Ryan (guitar), Joakim Karlsson (guitar), Noah Rauch (drums).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Bad Omens occupy a unique space between arena-ready anthems and bone-crushing metalcore. Their sound is marked by soaring clean vocals, djent-influenced riffing, electronic production elements, and emotionally charged lyrics that resonate with a generation searching for connection.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Bad Omens (2016), Finding God Before God Finds Me (2019), The Death of Peace of Mind (2022). Their 2022 album debuted at No. 11 on the Billboard 200 and spawned the viral hit "Just Pretend."
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Richmond, Virginia, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "12" ? (
                <>
                  <p>
                    Sleep Token are a British rock collective shrouded in mystique, led by the enigmatic masked vocalist known only as Vessel. Since emerging in 2016, they have captivated audiences worldwide with a sound that defies easy categorisation — weaving together progressive metal, R&amp;B, soul, and ambient music into something genuinely unique.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Sleep Token's music moves fluidly between hushed, intimate R&amp;B verses and colossal, polyrhythmic metal crescendos. Vessel's extraordinary vocal range — capable of tender falsetto and guttural roars — sits at the centre of their mesmerising, ritualistic sound.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Sundowning (2019), This Place Will Become Your Home (2021), Take Me Back to Eden (2023). Their 2023 album debuted at No. 2 on the UK Albums Chart and earned widespread critical acclaim.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> London, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "13" ? (
                <>
                  <p>
                    Linkin Park are one of the best-selling music artists of all time, with over 100 million records sold worldwide. Formed in Agoura Hills, California in 1996, the band pioneered nu-metal and alternative metal, creating a sound that defined a generation and continues to resonate across the globe. In 2024 the band announced their return with new vocalist Emily Armstrong.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Current Lineup:</span> Mike Shinoda (vocals, keys, guitar), Brad Delson (guitar), Dave Farrell (bass), Joe Hahn (DJ/samples), Rob Bourdon (drums), Emily Armstrong (lead vocals).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Linkin Park fuse heavy guitar riffs, turntablism, hip hop rhythms, and emotionally raw vocals into anthems that span rap-rock, alternative metal, and post-grunge. Their ability to balance aggression with melody set them apart from the moment they arrived.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Hybrid Theory (2000, Diamond certified), Meteora (2003), Minutes to Midnight (2007), A Thousand Suns (2010), The Hunting Party (2014), From Zero (2024).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Agoura Hills, California, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "14" ? (
                <>
                  <p>
                    Falling in Reverse are an American rock band from Las Vegas, Nevada, fronted by the flamboyant and polarising Ronnie Radke. Known for their theatrical live shows, genre-defying sound, and Radke's undeniable stage charisma, the band have built a fiercely devoted following over more than a decade of boundary-pushing music.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Current Lineup:</span> Ronnie Radke (vocals), Christian Thompson (guitar), Tyler Burgess (bass), Max Georgiev (guitar), Brandon Richter (drums).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Falling in Reverse blend post-hardcore, metalcore, hip hop, and electronic elements into a relentless and highly entertaining live experience. Radke's rapping, melodic singing, and unhinged stage presence make every show an event in itself.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> The Drug in Me Is You (2011), Fashionably Late (2013), Coming Home (2017), Popular Monster (2020), "Zombified" (2022, viral single).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Las Vegas, Nevada, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "15" ? (
                <>
                  <p>
                    Slaughter to Prevail are a Russian deathcore band formed in Yekaterinburg in 2014, now based internationally. Fronted by the towering Alex Terrible — one of the most technically gifted extreme vocalists in modern metal — the band have risen from underground obscurity to headline acts on the world's biggest heavy music stages.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Current Lineup:</span> Alex Terrible (vocals), Dmitriy Grebenshchikov (guitar), Sergey Terekhov (guitar), Artem Davydov (bass), Kirill Reznik (drums).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Slaughter to Prevail deliver crushing deathcore built on down-tuned, pneumatic riffs, blast-beat drumming, and Alex Terrible's inhuman vocal range — spanning guttural lows, mid-range barks, and piercing shrieks that have made him a YouTube sensation with hundreds of millions of views.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Chapters of Misery (2016), Kostolom (2021), Chapters of Misery II (2023). Their track "Baba Yaga" became a viral deathcore anthem and introduced millions to the band.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Yekaterinburg, Russia
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "16" ? (
                <>
                  <p>
                    Electric Callboy are a German metalcore band from Castrop-Rauxel, formed in 2010 under the name Eskimo Callboy before rebranding in 2022. Celebrated for injecting infectious humour, euphoric electronic dance music, and unrelenting heaviness into their music, they have become one of the most entertaining and distinctive live acts in modern heavy music.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Current Lineup:</span> Kevin Ratajczak (vocals), Nico Sallach (vocals/synths), David Pargac (guitar), Anton Ratajczak (guitar), Daniel Jenal (bass), Nico Sallach (drums).
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Electric Callboy are the undisputed kings of "party metalcore" — their live shows are an outrageous blend of crowd-surfing, confetti cannons, Eurodance synth lines, and face-melting breakdowns. You leave their shows sweaty, exhausted, and grinning uncontrollably.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Hypa Hypa (2021, viral hit), Tekkno (2022), NEON (2024). "Hypa Hypa" became a TikTok phenomenon and launched them into international prominence.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Castrop-Rauxel, Germany
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "2" ? (
                <>
                  <p>
                    Electric Dreams are a London-based electronic music duo known for their immersive live shows and euphoric, synth-driven sound. Blending influences from classic rave culture, progressive house, and ambient electronica, they have built a reputation for crafting soundscapes that transport audiences far beyond the venue walls.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Their live sets are a seamless journey through layered synth textures, driving four-to-the-floor rhythms, and euphoric melodic breakdowns — a full sensory experience designed for the dancefloor and the mind simultaneously.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Highlights:</span> Electric Dreams have headlined major UK electronic festivals, released multiple chart-topping EPs, and earned a loyal following across Europe and North America with their high-energy performances.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Based in:</span> London, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "3" ? (
                <>
                  <p>
                    Luna &amp; The Stardust are a dreamy indie-pop collective led by vocalist Luna Vasquez, celebrated for their ethereal harmonies, shimmering guitar textures, and introspective lyricism. Drawing from shoegaze, dream pop, and indie folk, they create intimate yet expansive soundscapes that resonate deeply with audiences seeking authenticity and emotion.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Delicate fingerpicked guitars, layered reverb-drenched vocals, and unhurried rhythms define their sound — music built for late nights, open roads, and quiet introspection.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Highlights:</span> Their debut album reached the Top 20 on the UK Indie Chart and earned praise from publications including NME and The Guardian. The band tours extensively across the UK and Europe.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Based in:</span> London, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "4" ? (
                <>
                  <p>
                    Neon Skyline are a modern pop phenomenon known for their bold visual aesthetic, stadium-filling anthems, and infectious hook-driven songwriting. Bridging polished pop production with sincere emotional storytelling, they have become one of the most-streamed emerging acts of the past decade.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Neon Skyline fuse bright, maximalist pop production with heartfelt, relatable lyrics. Their songs are built on soaring choruses, vibrant synth layers, and the kind of melodies that stay with you long after the show ends.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Highlights:</span> Multiple UK Top 40 singles, sold-out arena tours, and a growing international audience across Europe and North America. Their live performances are renowned for spectacular production and non-stop energy.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Based in:</span> London, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "5" ? (
                <>
                  <p>
                    MC Rhythm is a New York-based rapper and lyricist celebrated for his sharp flow, rapid-fire delivery, and socially conscious wordplay. Rooted in the golden-age East Coast hip hop tradition, he blends vivid storytelling, intricate rhyme schemes, and hard-hitting production to deliver performances that are as intellectually engaging as they are electrifying.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> MC Rhythm draws heavily from the lyrical traditions of East Coast hip hop — dense multi-syllable rhymes, sharp social commentary, and beat selections that range from boom-bap classics to modern trap-infused productions.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Highlights:</span> His debut mixtape went viral, earning millions of streams within the first week of release. He has performed at major hip hop festivals across the USA and Europe and collaborated with some of the genre's most respected producers.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> New York, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "6" ? (
                <>
                  <p>
                    The Jazz Collective are a New York ensemble of virtuoso musicians bringing the timeless art of jazz into the 21st century. Their performances weave together bebop, cool jazz, and contemporary improvisation, creating a sophisticated live experience that speaks equally to longtime jazz aficionados and curious newcomers.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Rooted in the bebop tradition yet unafraid to push boundaries, The Jazz Collective blend classic chord changes with modern harmonic ideas, free improvisation, and occasional forays into jazz fusion — every show is a unique, unrepeatable experience.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Highlights:</span> Resident performers at Blue Note New York, featured at the Montreux and North Sea Jazz Festivals, and recipients of a prestigious NEA Jazz Masters Fellowship nomination.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> New York, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "17" ? (
                <>
                  <p>
                    Deadmau5 is the stage name of Canadian electronic music producer and DJ Joel Zimmermann, instantly recognisable worldwide for his iconic oversized mouse head helmet. One of the most influential figures in modern electronic music, he blends progressive house, techno, and ambient electronica into immersive, meticulously crafted live experiences.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Deadmau5 is known for long-form, slowly evolving tracks built on hypnotic synth arpeggios, driving four-to-the-floor rhythms, and moments of euphoric release. His live shows are fully designed productions — the cube stage, light shows, and signature helmet make every performance an event.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Random Album Title (2008), 4x4=12 (2010), album title goes here (2011), W:/2016ALBUM/ (2016). Tracks like "Strobe", "Ghosts 'n' Stuff", and "I Remember" are electronic music classics.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Niagara Falls, Ontario, Canada
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "18" ? (
                <>
                  <p>
                    The Chemical Brothers — Tom Rowlands and Ed Simons — are one of the most important acts in the history of electronic music. Pioneers of the big beat movement in the 1990s, the Manchester duo have spent three decades pushing the boundaries of dance music with a sound that blends psychedelia, rave culture, and cinematic production.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Explosive live shows featuring custom visuals and relentless energy define the Chemical Brothers experience. Their sound encompasses acid house, techno, big beat, and psychedelic rock — genre boundaries simply do not apply.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Exit Planet Dust (1995), Dig Your Own Hole (1997), Come With Us (2002), We Are the Night (2007), Born in the Echoes (2015). Tracks like "Block Rockin' Beats" (Grammy winner), "Setting Sun", and "Hey Boy Hey Girl" are dancefloor anthems.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Manchester, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "19" ? (
                <>
                  <p>
                    Disclosure are brothers Howard and Guy Lawrence from Surrey, England, who became one of the defining acts of the 2010s UK electronic scene. Their fusion of UK garage, house, and pop turned them into global stars almost overnight, with debut album Settle establishing them as a major creative force.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Disclosure weave together the skip rhythms of UK garage with deep house basslines, soulful vocals, and impeccably polished production. Their music is equally at home on a festival main stage as it is in a late-night club.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Settle (2013), Caracal (2015), Energy (2020). "Latch" (feat. Sam Smith) and "White Noise" became defining anthems of the era.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Surrey, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "20" ? (
                <>
                  <p>
                    Arctic Monkeys are a Sheffield indie rock band who rose from playing small Yorkshire pubs to becoming one of the biggest bands in the world. Fronted by Alex Turner, whose razor-sharp lyrical wit and effortless cool have defined a generation, they remain the most successful British rock band of the 21st century.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Arctic Monkeys have reinvented themselves with each album — from the raw indie punk of their debut to the sleek desert rock of Humbug, the glam stomp of Suck It and See, and the cinematic lounge-rock of Tranquility Base Hotel + Casino. Every era is distinctly brilliant.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Whatever People Say I Am, That's What I'm Not (2006), AM (2013), Tranquility Base Hotel + Casino (2018), The Car (2022). "R U Mine?", "Do I Wanna Know?", and "505" are among the most-streamed rock tracks of the decade.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Sheffield, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "21" ? (
                <>
                  <p>
                    The 1975 are a Manchester indie pop and rock band led by the charismatic and provocative Matthew Healy. Known for their chameleonic genre-blending — from 80s synth-pop and ambient jazz to post-hardcore — and Healy's outspoken, deeply personal lyrics, they have become one of the most culturally significant British bands of their generation.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> The 1975 defy easy categorisation — their albums are immersive, genre-fluid experiences spanning shimmering pop, intense guitar rock, ambient interludes, and jazz-influenced passages. Live, they are known for spectacular production and emotionally charged performances.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> The 1975 (2013), I Like It When You Sleep (2016), A Brief Inquiry Into Online Relationships (2018), Notes on a Conditional Form (2020), Being Funny in a Foreign Language (2022). Tracks like "Chocolate", "Somebody Else", and "The Sound" are modern classics.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Manchester, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "22" ? (
                <>
                  <p>
                    Tame Impala is the psychedelic music project of multi-instrumentalist and producer Kevin Parker from Perth, Australia. What began as a solo recording experiment became a global phenomenon, with Parker's densely layered, bedroom-crafted soundscapes evolving into some of the most critically acclaimed psychedelic rock and pop of the 21st century.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Tame Impala's music is defined by shimmering, heavily processed guitars, dreamy vocals buried in reverb, propulsive krautrock-influenced rhythms, and lush synthesiser arrangements. The transition from psychedelic rock on Innerspeaker to disco-influenced synth-pop on Currents was a landmark moment in modern music.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Innerspeaker (2010), Lonerism (2012), Currents (2015), The Slow Rush (2020). "Let It Happen", "The Less I Know The Better", and "Borderline" are essential modern psychedelic pop tracks.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Perth, Australia
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "23" ? (
                <>
                  <p>
                    Billie Eilish is a Los Angeles singer-songwriter who became a global pop phenomenon as a teenager, redefining what commercial pop music could sound like. Her breathy, intimate vocals, dark thematic lyricism, and genre-blurring production — crafted largely in collaboration with her brother Finneas — set her apart from every other artist of her generation.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Billie Eilish's music exists at the intersection of whispered intimacy and emotionally overwhelming production — sparse bedroom pop alongside orchestral grandeur, ASMR-influenced vocal delivery alongside arena-ready anthems. Her live shows are visually stunning, immersive experiences.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> When We All Fall Asleep, Where Do We Go? (2019), Happier Than Ever (2021), Hit Me Hard and Soft (2024). "Bad Guy", "Happier Than Ever", and "What Was I Made For?" have become cultural landmarks.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Los Angeles, California, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "24" ? (
                <>
                  <p>
                    Dua Lipa is a British-Albanian pop superstar from London who has established herself as one of the dominant forces in global pop music. With an irresistible blend of disco-influenced production, powerfully delivered vocals, and impeccable stylistic sense, she created one of the defining pop albums of the decade with Future Nostalgia.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Dua Lipa draws from 70s and 80s disco, funk, and Italo-disco, combining retro warmth with crisp modern production and her distinctive deep, smooth vocal timbre. Her live performances are high-energy choreographed spectacles backed by world-class production.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Dua Lipa (2017), Future Nostalgia (2020), Radical Optimism (2024). "Levitating", "Don't Start Now", "New Rules", and "Houdini" are among the biggest pop songs of their respective years.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> London, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "25" ? (
                <>
                  <p>
                    Harry Styles is a British pop star from Holmes Chapel, Cheshire, who first found fame as a member of One Direction before establishing himself as a major solo artist in his own right. With a flamboyant personal style, an eclectic musical palette drawing from 70s pop-rock, folk, and soul, and an extraordinary rapport with audiences, he has become one of the biggest live performers in the world.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Harry Styles blends Bowie-esque glam rock, Fleetwood Mac soft rock, Beatles-influenced songwriting, and modern pop into a warm, instantly likeable sound. His concerts are joyful, inclusive celebrations — fans describe them as the most welcoming and euphoric live shows they have attended.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Harry Styles (2017), Fine Line (2019), Harry's House (2022). "Watermelon Sugar" (Grammy winner), "As It Was" (one of the most-streamed songs of 2022), and "Adore You" are among his most beloved tracks.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Holmes Chapel, Cheshire, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "26" ? (
                <>
                  <p>
                    Kendrick Lamar is a rapper and songwriter from Compton, California, widely regarded as one of the greatest and most important artists in hip hop history. His densely layered concept albums, extraordinary technical mastery, and willingness to confront systemic racism, personal trauma, and moral complexity head-on have earned him Pulitzer Prize recognition — making him the first non-classical, non-jazz musician to win the award.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Kendrick Lamar's music is uncompromisingly intelligent — intricate multi-layered narratives, jazz and funk-infused West Coast production, shifting vocal personas, and deeply personal confessions. His live shows are theatrical, choreographed spectacles that treat hip hop with the gravity of art.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> good kid, m.A.A.d city (2012), To Pimp a Butterfly (2015), DAMN. (2017, Pulitzer Prize winner), Mr. Morale &amp; The Big Steppers (2022), GNX (2024). "HUMBLE.", "Alright", "Not Like Us", and "Swimming Pools" are cultural touchstones.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Compton, California, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "27" ? (
                <>
                  <p>
                    Travis Scott is a Houston rapper, singer, and record producer whose genre-blurring music, mind-bending production, and immersive live spectacle have made him one of the most influential and commercially dominant artists in contemporary music. His concerts are legendary — elaborate, trippy audio-visual experiences that blur the line between hip hop show and carnival ride.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Travis Scott operates in a haze of auto-tuned melodies, thunderous bass, psychedelic trap production, and hypnotic hooks. His music is as much about texture and atmosphere as it is about lyrics — an overwhelming sensory experience both on record and on stage.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Rodeo (2015), Birds in the Trap Sing McKnight (2016), Astroworld (2018), Utopia (2023). "Sicko Mode", "Goosebumps", "FE!N", and "Antidote" are streaming giants.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Houston, Texas, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "28" ? (
                <>
                  <p>
                    Tyler, the Creator is a Los Angeles rapper, producer, director, and fashion designer who has built one of the most unique and celebrated careers in music. Beginning with provocative, raw mixtapes, he has evolved into a Grammy-winning artist of breathtaking range — crafting lush, orchestrated rap albums that draw from jazz, soul, funk, and avant-garde pop.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Tyler's musical palette is extraordinarily wide — from abrasive punk-rap to sun-drenched neo-soul, from ominous orchestral soundscapes to breezy, jazz-inflected pop. His live shows are chaotic, joyful, and deeply personal celebrations of creative freedom.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Wolf (2013), Cherry Bomb (2015), Flower Boy (2017), IGOR (2019, Grammy winner), Call Me If You Get Lost (2021), Chromakopia (2024). "Earfquake", "See You Again", and "New Magic Wand" showcase his extraordinary evolution.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Ladera Heights, Los Angeles, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "29" ? (
                <>
                  <p>
                    Norah Jones is a New York singer-songwriter and pianist whose debut album Come Away with Me became one of the best-selling debut albums in history, earning eight Grammy Awards in a single night. Her warm, smoky voice, intimate piano playing, and ability to blend jazz, country, pop, and soul into something uniquely her own have made her one of the most beloved artists of the past two decades.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Norah Jones inhabits a warm space between jazz, folk, country, and pop — her music is intimate and unpretentious, built on honest songwriting, delicate piano, and a voice that feels like a conversation. Her live performances are quietly devastating in their emotional impact.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Come Away with Me (2002), Feels Like Home (2004), Not Too Late (2007), Little Broken Hearts (2012), Visions (2024). "Don't Know Why" and "Come Away with Me" are modern jazz-pop classics.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> New York, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "30" ? (
                <>
                  <p>
                    Kamasi Washington is a Los Angeles-based tenor saxophonist and bandleader who single-handedly reignited mainstream interest in jazz with his staggering 2015 triple album The Epic. A central figure in a new generation of spiritually minded, politically engaged jazz musicians, Washington has performed at festivals worldwide and collaborated with artists including Kendrick Lamar and Herbie Hancock.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Kamasi Washington's music is vast and symphonic — his ensembles incorporate strings, choirs, and percussion alongside jazz quartet formats, building to ecstatic spiritual crescendos in the tradition of John Coltrane and Sun Ra. Live shows are transcendent communal experiences.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> The Epic (2015), Harmony of Difference (2017), Heaven and Earth (2018), Fearless Movement (2024). His saxophone feature on Kendrick Lamar's To Pimp a Butterfly introduced him to millions of new listeners.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Los Angeles, California, USA
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "31" ? (
                <>
                  <p>
                    GoGo Penguin are a Manchester-based piano trio — Chris Illingworth, Nick Blacka, and Rob Turner — who have redefined what acoustic jazz can be in the 21st century. Signed to Blue Note Records, their music incorporates electronic music influences, post-rock textures, and minimalist classical composition into a sound that is both rooted in jazz tradition and entirely forward-looking.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> GoGo Penguin blend acoustic jazz trio instrumentation with rhythmic complexity drawn from electronic music — stuttering, off-kilter grooves, driving arpeggiated piano patterns, and intricate polyrhythmic drumming create music that connects equally with jazz fans and fans of artists like Aphex Twin or Boards of Canada.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> v2.0 (2014, Mercury Prize nominated), Man Made Object (2016), A Humdrum Star (2018), GoGo Penguin (2020), Everything Is Going to Be OK (2023). Mercury Prize nomination confirmed them as one of the UK's most important contemporary ensembles.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Manchester, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "32" ? (
                <>
                  <p>
                    Radiohead are an Oxford rock band widely considered among the most important and influential of the past thirty years. Fronted by Thom Yorke — whose distinctive, emotionally harrowing falsetto has become one of rock music's most recognisable voices — the band have consistently evolved, from the art-rock anthems of their early career to the electronic experimentalism of Kid A and beyond.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Radiohead defy genre — their catalogue moves from distorted post-grunge rock to ambient electronica, jazz-influenced chamber music, minimalist drone, and back again. Their live shows are austere yet overwhelming — a five-piece band performing with extraordinary precision and emotional intensity.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> The Bends (1995), OK Computer (1997), Kid A (2000), Amnesiac (2001), Hail to the Thief (2003), In Rainbows (2007), The King of Limbs (2011), A Moon Shaped Pool (2016). "Creep", "Fake Plastic Trees", "No Surprises", and "Exit Music" are modern rock landmarks.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Abingdon, Oxfordshire, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "33" ? (
                <>
                  <p>
                    Muse are a Devon rock band — Matt Bellamy, Chris Wolstenholme, and Dominic Howard — who have built a career on breathtaking ambition: theatrical stadium rock productions, genre-spanning music that blends progressive rock, space rock, electronic music, and classical orchestration, and Bellamy's extraordinary guitar and piano playing. Few bands can claim to have genuinely redefined what a stadium concert looks like.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Muse operate at maximum grandeur — their songs are built on enormous riffs, operatic vocal performances, thunderous rhythms, and dystopian conceptual themes. Their live shows are some of the most spectacular in music: giant floating robots, fighter jet projections, rotating stages, and pyrotechnics on an unimaginable scale.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Showbiz (1999), Origin of Symmetry (2001), Absolution (2003), Black Holes and Revelations (2006), The Resistance (2009), Drones (2015), Will of the People (2022). "Supermassive Black Hole", "Uprising", "Madness", and "Knights of Cydonia" are modern rock anthems.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> Teignmouth, Devon, United Kingdom
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : event.artistId === "34" ? (
                <>
                  <p>
                    Interpol are a New York City post-punk revival band formed in 1997, whose debut album Turn On the Bright Lights is widely regarded as one of the finest debut albums in rock history. Fronted by the stoic, baritone-voiced Paul Banks, Interpol's music is dark, atmospheric, and elegant — a New York take on the cold wave and post-punk traditions pioneered by Joy Division and The Cure.
                  </p>
                  {isExpanded && (
                    <>
                      <div className="pt-2 border-t border-[#242221] space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold text-white">Musical Style:</span> Interpol build their music on the interplay between Daniel Kessler's chiming, reverb-drenched guitar lines, Carlos Dengler's melodic bass, and Banks' cool, detached vocal delivery. Their sound is cinematic and melancholic — music perfectly suited to late nights and urban landscapes.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Key Discography:</span> Turn On the Bright Lights (2002), Antics (2004), Our Love to Admire (2007), El Pintor (2014), The Other Side of Make-Believe (2022). "Obstacle 1", "Slow Hands", "Evil", and "Stella Was a Diver" are post-punk touchstones.
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-white">Hometown:</span> New York, USA
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

          {/* Venue Map */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
              <h2 className="text-2xl font-bold text-white">Location</h2>
            </div>
            <div className="rounded-lg overflow-hidden">
              <VenueMap venue={event.venue} city={event.city} artistName={event.artistName} />
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ", " + event.city)}`, "_blank")}
            >
              <MapPin className="w-4 h-4 mr-2" />
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
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
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
