import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ChevronLeft, MapPin, Calendar, Users, BadgeCheck, Music2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { mockEvents, mockArtists } from "../data/mockData";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";
import geometricPattern from "../../imports/image-10.png";

function getArtistImagePosition(artistId: string): string {
  if (artistId === "24") return "object-[50%_40%]"; // Dua Lipa – tight crop, show mid-face
  if (["23", "25"].includes(artistId)) return "object-[50%_20%]";
  return "object-top";
}

export function getArtistImage(artistId: string, fallback = "") {
  if (artistId === "1") return bmthImage;
  if (artistId === "7") return architectsImage;
  if (artistId === "8") return hunnaImage;
  if (artistId === "9") return punctualImage;
  if (artistId === "10") return foalsImage;
  return fallback;
}

const BIOS: Record<string, { short: string; long: string; members?: string; hometown: string }> = {
  "1": {
    short:
      "Bring Me The Horizon is a five-piece band from Sheffield, England. Despite only forming in March 2004, the band has gathered a surprisingly large fan base both in the UK and the US.",
    long:
      "The band has embarked on countless world tours supporting well-established acts and headlined major festivals across the globe. They won Best British Newcomer at the Kerrang! Awards in September 2006 and have since released seminal heavy records that redefined the genre.",
    members: "Oliver Sykes: vocals · Lee Malia: guitars · Matt Kean: bass · Matthew Nicholls: drums · Jordan Fish: keys",
    hometown: "Sheffield, United Kingdom",
  },
  "7": {
    short:
      "Architects are a highly influential British metalcore band from Brighton, formed in 2004. Known for fusing crushing riffs with emotional, purpose-driven songwriting.",
    long:
      "They have become a defining force in modern heavy music. Their evolution from mathcore to atmospheric metalcore to industrial-influenced anthems makes them one of the most respected acts in heavy music today. Albums like 'All Our Gods Have Abandoned Us' and 'Holy Hell' are considered genre classics.",
    members: "Sam Carter: vocals · Dan Searle: drums · Alex Dean: bass · Adam Christianson: guitar",
    hometown: "Brighton, United Kingdom",
  },
  "8": {
    short:
      "The Hunna are a British indie rock band from Hertfordshire, formed in 2015. They rose quickly through the UK indie scene with catchy guitar hooks and raw lyricism.",
    long:
      "Their debut album '100' charted in the UK Top 40, and they have since toured extensively across the UK, Europe, and North America. Known for high-energy live performances at the crossroads of indie rock, alternative, and pop-punk.",
    members: "Ryan Potter: vocals, guitar · Dan Dorney: guitar · Jermaine Angin: bass · Jack Metcalfe: drums",
    hometown: "Hertfordshire, United Kingdom",
  },
  "9": {
    short:
      "Punctual is a rising UK-based electronic music producer and DJ known for his sharp, groove-driven sound blending house, bass music, and melodic electronic production.",
    long:
      "With a meticulous approach to rhythm and arrangement, Punctual has become a standout voice in the new wave of British electronic artists. His productions are defined by punchy basslines, layered synth textures, and an infectious energy that translates seamlessly from headphones to the dancefloor.",
    hometown: "United Kingdom",
  },
  "10": {
    short:
      "Foals are an English rock band from Oxford, formed in 2005. Renowned for hypnotic rhythms, intricate guitar work, and Yannis Philippakis's soaring vocals.",
    long:
      "Foals have grown from an underground cult act into one of Britain's most celebrated alternative rock bands. They are known for explosive live performances and one of the most distinctive catalogues in British indie music, spanning art rock, math rock, and dance-punk.",
    members: "Yannis Philippakis: vocals, guitar · Jack Bevan: drums · Jimmy Smith: guitar · Edwin Congreave: keyboards · Walter Gervers: bass",
    hometown: "Oxford, United Kingdom",
  },
};

export function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllEvents, setShowAllEvents] = useState(false);
  const artist = mockArtists.find((a) => a.id === id);

  if (!artist) {
    return (
      <div className="text-center py-20">
        <Music2 className="w-12 h-12 text-[#C7C1B6] mx-auto mb-4" />
        <p className="text-[#C7C1B6] text-lg mb-4">Artist not found</p>
        <Link to="/events">
          <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a]">Browse Events</Button>
        </Link>
      </div>
    );
  }

  const artistImage = getArtistImage(artist.id, artist.image);
  const bio = BIOS[artist.id] ?? { short: "Artist information coming soon.", long: "", hometown: "United Kingdom" };
  const artistEvents = mockEvents.filter((e) => e.artistId === id);
  const visibleEvents = showAllEvents ? artistEvents : artistEvents.slice(0, 4);
  const similarArtists = mockArtists
    .filter((a) => a.genre === artist.genre && a.id !== id)
    .slice(0, 4);

  return (
    <div className="relative space-y-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img src={geometricPattern} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 w-[700px] h-[700px] rounded-full bg-[#242221]" />
        <div className="absolute right-0 -bottom-40 w-[800px] h-[800px] rounded-full bg-[#242221]" />
      </div>

      {/* Back */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="relative z-10 text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E]"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Hero */}
      <Card className="relative z-10 overflow-hidden border-[#242221] bg-[#141111]/50">
        <div className="relative h-72 md:h-96">
          <img
            src={artistImage}
            alt={artist.name}
            className={`w-full h-full object-cover ${getArtistImagePosition(artist.id)}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141111] via-[#141111]/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#E5381E] text-white border-0">{artist.genre}</Badge>
              {artist.verified && (
                <Badge className="bg-blue-600/80 text-white border-0 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3">{artist.name}</h1>
            <div className="flex flex-wrap items-center gap-5 text-[#C7C1B6] text-sm">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {(artist.followers / 1000).toFixed(0)}K followers
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {artist.upcomingShows} upcoming show{artist.upcomingShows !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {bio.hometown}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="relative z-10 grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          {/* Bio */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]" />
              <h2 className="text-xl font-bold text-white">About {artist.name}</h2>
            </div>
            <p className="text-[#C7C1B6] leading-relaxed mb-3">{bio.short}</p>
            {bio.long && (
              <p className="text-[#C7C1B6]/80 text-sm leading-relaxed">{bio.long}</p>
            )}
            {bio.members && (
              <>
                <Separator className="bg-[#242221] my-4" />
                <p className="text-sm text-[#C7C1B6]">
                  <span className="text-white font-semibold">Line-up: </span>
                  {bio.members}
                </p>
              </>
            )}
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]" />
              <h2 className="text-xl font-bold text-white">Upcoming Shows</h2>
              <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0 ml-1">
                {artistEvents.length}
              </Badge>
            </div>
            {artistEvents.length > 0 ? (
              <>
                <div className="space-y-3">
                  {visibleEvents.map((event) => (
                    <Link key={event.id} to={`/event/${event.id}`}>
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-[#242221]/50 hover:bg-[#E5381E]/10 transition-all group cursor-pointer">
                        <img
                          src={artistImage}
                          alt={event.artistName}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">
                            {event.venue}, {event.city}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#C7C1B6] mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-white font-bold text-lg">${event.price}</p>
                          <p className="text-xs text-[#E5381E] group-hover:underline">
                            Tickets →
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {artistEvents.length > 4 && (
                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="mt-4 text-sm text-[#E5381E] hover:text-[#E5381E]/80 font-medium transition-colors"
                  >
                    {showAllEvents ? "Show less" : `Show all ${artistEvents.length} shows`}
                  </button>
                )}
              </>
            ) : (
              <p className="text-[#C7C1B6] text-sm">No upcoming shows scheduled.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* CTA card */}
          <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/30 p-5">
            <p className="text-[#C7C1B6] text-sm mb-1">Tickets from</p>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {artistEvents.length > 0
                ? `$${Math.min(...artistEvents.map((e) => e.price))}`
                : "—"}
            </p>
            {artistEvents.length > 0 && (
              <Link to={`/event/${artistEvents[0].id}`}>
                <Button className="w-full bg-[#E5381E] text-white hover:bg-[#991a0a]">
                  Get Tickets
                </Button>
              </Link>
            )}
          </Card>

          {/* Similar artists */}
          {similarArtists.length > 0 && (
            <Card className="bg-[#141111]/50 border-[#242221] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-[#E5381E] rounded-[10px]" />
                <h3 className="text-base font-bold text-white">Similar Artists</h3>
              </div>
              <div className="space-y-2">
                {similarArtists.map((a) => (
                  <Link key={a.id} to={`/artist/${a.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#E5381E]/10 transition-all group cursor-pointer">
                      <img
                        src={getArtistImage(a.id, a.image)}
                        alt={a.name}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate group-hover:text-[#E5381E] transition-colors">
                          {a.name}
                        </p>
                        <p className="text-[#C7C1B6] text-xs">{a.genre}</p>
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
