import { useState } from "react";
import { Calendar as CalendarIcon, MapPin, DollarSign, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockEvents } from "../data/mockData";
import { useWishlist } from "../context/WishlistContext";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";
import geometricPattern from "../../imports/image-10.png";

export function Events() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // April 2026
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const { toggle, isWishlisted } = useWishlist();

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

  const getEventImage = (event: typeof mockEvents[0]) =>
    event.artistId === "1" ? bmthImage
    : event.artistId === "7" ? architectsImage
    : event.artistId === "8" ? hunnaImage
    : event.artistId === "9" ? punctualImage
    : event.artistId === "10" ? foalsImage
    : event.image;

  const monthEvents = mockEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === currentMonth.getMonth() &&
      eventDate.getFullYear() === currentMonth.getFullYear()
    );
  });

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day: number) => {
    return mockEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const days = getDaysInMonth();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="relative space-y-6">
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img src={geometricPattern} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Circular Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute -left-48 top-1/4 w-[650px] h-[650px] rounded-full bg-[#242221]"></div>
        <div className="absolute right-1/4 -bottom-40 w-[850px] h-[850px] rounded-full bg-[#242221]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-start gap-3">
          <div className="w-1 h-12 bg-[#E5381E] rounded-[10px] mt-1"></div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Events Calendar</h2>
            <p className="text-[#C7C1B6]">Plan your music journey</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("list")}
            className={`${
              viewMode === "list"
                ? "bg-[#E5381E] text-white border-[#E5381E]"
                : "bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E]"
            }`}
          >
            List
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("calendar")}
            className={`${
              viewMode === "calendar"
                ? "bg-[#E5381E] text-white border-[#E5381E]"
                : "bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E]"
            }`}
          >
            Calendar
          </Button>
        </div>
      </div>

      {/* Month Navigation */}
      <Card className="relative z-10 bg-[#141111]/50 border-[#242221] p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="text-[#C7C1B6] hover:bg-[#C7C1B6]/20 hover:text-[#E5381E]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="text-xl font-bold text-white">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="text-[#C7C1B6] hover:bg-[#C7C1B6]/20 hover:text-[#E5381E]"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Card className="relative z-10 bg-[#141111]/50 border-[#242221] p-4 md:p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-[#C7C1B6] py-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    hasEvents
                      ? "border-[#E5381E]/50 bg-[#E5381E]/20 hover:bg-[#E5381E]/30"
                      : "border-[#242221]/20 hover:bg-[#E5381E]/10"
                  } transition-colors cursor-pointer`}
                >
                  <div className="text-sm text-white font-semibold mb-1">{day}</div>
                  {hasEvents && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs text-[#C7C1B6] truncate bg-[#E5381E]/30 px-1 rounded"
                        >
                          {event.artistName}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-[#C7C1B6]">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="relative z-10 space-y-6">
          {monthEvents.length > 0 ? (
            monthEvents.map((event) => (
              <Card
                key={event.id}
                className="bg-[#141111]/50 border-[#242221] hover:bg-[#E5381E]/10 transition-all overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Event Image */}
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={getEventImage(event)}
                      alt={event.artistName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#141111] to-transparent"></div>
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

                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#E5381E] transition-colors">
                          {event.artistName}
                        </h3>
                        <div className="flex items-center gap-2 text-[#C7C1B6]">
                          <MapPin className="w-4 h-4 text-[#C7C1B6]" />
                          <span>
                            {event.venue}, {event.city}, {event.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E5381E]/20 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-[#C7C1B6]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#C7C1B6]">Date & Time</p>
                          <p className="font-semibold text-white">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            • {event.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-[#C7C1B6]">Starting From</p>
                          <p className="font-semibold text-white text-lg">${event.price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/event/${event.id}/tickets`} className="flex-1">
                        <Button className="w-full bg-[#E5381E] text-white hover:bg-[#991a0a]">
                          Get Tickets
                        </Button>
                      </Link>
                      <Link to={`/event/${event.id}`}>
                        <Button
                          variant="outline"
                          className="bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90"
                        >
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-[#141111]/50 border-[#242221] p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-[#C7C1B6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Events This Month</h3>
                <p className="text-[#C7C1B6]">
                  Check out other months or browse all upcoming events in the Discover tab.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
