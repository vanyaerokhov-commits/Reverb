import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { MapPin, Plus, X, Navigation, Calendar, Clock, GripVertical } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { mockEvents } from "../data/mockData";

/** Deterministic distance between two event IDs — no flicker on re-render */
function getDistance(id1: string, id2: string): number {
  const hash = [...(id1 + id2)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (hash * 31) % 600 + 150;
}

/** City → [lat, lng] lookup */
const CITY_COORDS: Record<string, [number, number]> = {
  // UK
  London:         [51.5074,  -0.1278],
  Manchester:     [53.4808,  -2.2426],
  Birmingham:     [52.4862,  -1.8904],
  Glasgow:        [55.8642,  -4.2518],
  Brighton:       [50.8229,  -0.1363],
  Leeds:          [53.7965,  -1.5478],
  Liverpool:      [53.4084,  -2.9916],
  Bristol:        [51.4545,  -2.5879],
  Edinburgh:      [55.9533,  -3.1883],
  Sheffield:      [53.3811,  -1.4701],
  Nottingham:     [52.9548,  -1.1581],
  Cardiff:        [51.4816,  -3.1791],
  // USA
  "New York":     [40.7128,  -74.0060],
  Chicago:        [41.8781,  -87.6298],
  "Los Angeles":  [34.0522, -118.2437],
  Miami:          [25.7617,  -80.1918],
  // Europe
  Berlin:         [52.5200,   13.4050],
  Paris:          [48.8566,    2.3522],
  Amsterdam:      [52.3676,    4.9041],
  Barcelona:      [41.3851,    2.1734],
  Madrid:         [40.4168,   -3.7038],
};

/** Inline Leaflet map component */
function RouteMap({ events }: { events: typeof mockEvents }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Fix default marker icons broken by Vite bundling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const coords: [number, number][] = events
      .map((e) => CITY_COORDS[e.city])
      .filter(Boolean);

    if (coords.length === 0) return;

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

    // Custom orange marker icon
    const orangeIcon = L.divIcon({
      className: "",
      html: `<div style="width:28px;height:28px;background:#E5381E;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-weight:bold;color:#fff;font-size:12px"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const numberedIcon = (n: number) => L.divIcon({
      className: "",
      html: `<div style="width:28px;height:28px;background:#E5381E;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-weight:bold;color:#fff;font-size:12px">${n}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Draw route polyline
    if (coords.length > 1) {
      L.polyline(coords, { color: "#E5381E", weight: 3, opacity: 0.8, dashArray: "8 6" }).addTo(map);
    }

    // Add markers
    events.forEach((event, i) => {
      const coord = CITY_COORDS[event.city];
      if (!coord) return;
      L.marker(coord, { icon: numberedIcon(i + 1) })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;min-width:140px"><b style="color:#E5381E">${event.artistName}</b><br/><span style="color:#888;font-size:12px">${event.venue}<br/>${event.city}</span></div>`,
          { className: "leaflet-popup-dark" }
        );
    });

    // Fit bounds
    if (coords.length === 1) {
      map.setView(coords[0], 10);
    } else {
      map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
    }

    return () => {
      container.removeEventListener("mouseenter", enableScroll);
      container.removeEventListener("mouseleave", disableScroll);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [events]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "300px" }} />;
}
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";
import geometricPattern from "../../imports/image-10.png";

export function RoutePlanner() {
  const navigate = useNavigate();
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["e1", "e3"]);

  const selectedEventDetails = selectedEvents
    .map((id) => mockEvents.find((e) => e.id === id))
    .filter(Boolean) as typeof mockEvents;

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const removeEvent = (eventId: string) => {
    setSelectedEvents((prev) => prev.filter((id) => id !== eventId));
  };

  const totalDistance = selectedEventDetails.length > 1 ? "2,003 km" : "N/A";
  const estimatedCost = selectedEventDetails.reduce((sum, event) => sum + event.price, 0);

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
        <div className="absolute -left-56 top-1/3 w-[800px] h-[800px] rounded-full bg-[#242221]"></div>
        <div className="absolute right-1/3 -bottom-48 w-[900px] h-[900px] rounded-full bg-[#242221]"></div>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-1 h-12 bg-[#E5381E] rounded-[10px] mt-1"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Route Planner</h2>
          <p className="text-[#C7C1B6]">
            Plan your perfect music tour across multiple cities
          </p>
        </div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-3 gap-6">
        {/* Main Content - Route Map & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Placeholder */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6">
            <div className="aspect-video bg-[#242221] rounded-lg overflow-hidden mb-4">
              {selectedEventDetails.length > 0 ? (
                <RouteMap events={selectedEventDetails} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="w-16 h-16 text-[#C7C1B6] mx-auto mb-3" />
                    <p className="text-[#C7C1B6] text-lg mb-2">Select events to see your route</p>
                    <p className="text-sm text-[#C7C1B6]">Add events from the sidebar →</p>
                  </div>
                </div>
              )}
            </div>
            
            {selectedEventDetails.length > 1 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-white">{totalDistance}</p>
                  <p className="text-xs sm:text-sm text-[#C7C1B6]">Total Distance</p>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {selectedEventDetails.length}
                  </p>
                  <p className="text-xs sm:text-sm text-[#C7C1B6]">Events</p>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {Math.max(0, ...selectedEventDetails.map((e) =>
                      Math.ceil((new Date(e.date).getTime() - new Date(selectedEventDetails[0].date).getTime()) / (1000 * 60 * 60 * 24))
                    ))} days
                  </p>
                  <p className="text-xs sm:text-sm text-[#C7C1B6]">Duration</p>
                </div>
              </div>
            )}
          </Card>

          {/* Selected Events Timeline */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-[#E5381E] rounded-[10px]"></div>
                <h3 className="text-xl font-bold text-white">Your Route</h3>
              </div>
              {selectedEventDetails.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Export Route
                </Button>
              )}
            </div>

            {selectedEventDetails.length > 0 ? (
              <div className="space-y-4">
                {selectedEventDetails.map((event, index) => (
                  <div key={event.id}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#E5381E] to-[#E5381E]/80 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        {index < selectedEventDetails.length - 1 && (
                          <div className="w-0.5 h-full bg-[#E5381E]/30 my-2 flex-1"></div>
                        )}
                      </div>

                      <Card className="flex-1 bg-[#242221]/50 border-[#E5381E]/30 p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={event.artistId === "1" ? bmthImage : event.artistId === "7" ? architectsImage : event.artistId === "8" ? hunnaImage : event.artistId === "9" ? punctualImage : event.artistId === "10" ? foalsImage : event.image}
                            alt={event.artistName}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="text-white font-bold truncate">
                                  {event.artistName}
                                </h4>
                                <p className="text-sm text-[#C7C1B6] truncate">
                                  {event.venue}, {event.city}
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeEvent(event.id)}
                                className="text-[#C7C1B6] hover:text-red-400 -mr-2"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-[#C7C1B6]">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </div>
                              <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0 text-xs">
                                ${event.price}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {index < selectedEventDetails.length - 1 && (
                      <div className="ml-14 my-2 text-sm text-[#C7C1B6] flex items-center gap-2">
                        <Navigation className="w-3 h-3" />
                        <span>~{getDistance(selectedEventDetails[index].id, selectedEventDetails[index + 1].id)} km</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-[#C7C1B6] mx-auto mb-3" />
                <p className="text-[#C7C1B6]">
                  Add events from the list to start planning your route
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/50 p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
              <h3 className="text-lg font-bold text-white">Route Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Events</span>
                <span className="font-semibold text-white">
                  {selectedEventDetails.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Cities</span>
                <span className="font-semibold text-white">
                  {new Set(selectedEventDetails.map((e) => e.city)).size}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Total Distance</span>
                <span className="font-semibold text-white">{totalDistance}</span>
              </div>
              <Separator className="bg-[#242221]" />
              <div className="flex justify-between">
                <span className="text-slate-300">Estimated Cost</span>
                <span className="text-2xl font-bold text-white">
                  ${estimatedCost.toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-6 bg-[#E5381E] text-white hover:bg-[#991a0a]"
              disabled={selectedEventDetails.length === 0}
              onClick={() =>
                navigate(`/route-checkout?events=${selectedEvents.join(",")}`)
              }
            >
              Book All Tickets
            </Button>
          </Card>

          {/* Available Events */}
          <Card className="bg-[#141111]/50 border-[#242221] p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
              <h3 className="text-lg font-bold text-white">Available Events</h3>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {mockEvents.map((event) => {
                const isSelected = selectedEvents.includes(event.id);
                return (
                  <Card
                    key={event.id}
                    className={`p-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#E5381E]/20 border-[#E5381E]/50"
                        : "bg-[#242221]/50 border-[#E5381E]/30 hover:bg-[#242221]"
                    }`}
                    onClick={() => toggleEvent(event.id)}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={event.artistId === "1" ? bmthImage : event.artistId === "7" ? architectsImage : event.artistId === "8" ? hunnaImage : event.artistId === "9" ? punctualImage : event.artistId === "10" ? foalsImage : event.image}
                        alt={event.artistName}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {event.artistName}
                        </p>
                        <p className="text-xs text-[#C7C1B6] truncate">
                          {event.city}
                        </p>
                        <p className="text-xs text-[#C7C1B6]">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="w-6 h-6 bg-[#E5381E] rounded-full flex items-center justify-center flex-shrink-0">
                          <Plus className="w-4 h-4 text-white rotate-45" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-[#E5381E]/50 rounded-full flex items-center justify-center flex-shrink-0">
                          <Plus className="w-4 h-4 text-[#C7C1B6]" />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}