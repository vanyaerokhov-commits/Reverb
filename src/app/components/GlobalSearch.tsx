import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Search, X, Music2, Calendar, MapPin } from "lucide-react";
import { mockEvents, mockArtists } from "../data/mockData";
import bmthImage from "../../imports/image-3.png";
import architectsImage from "../../imports/image-14.png";
import hunnaImage from "../../imports/image-15.png";
import punctualImage from "../../imports/image-18.png";
import foalsImage from "../../imports/image-20.png";

function getArtistImage(artistId: string, fallback: string) {
  if (artistId === "1") return bmthImage;
  if (artistId === "7") return architectsImage;
  if (artistId === "8") return hunnaImage;
  if (artistId === "9") return punctualImage;
  if (artistId === "10") return foalsImage;
  return fallback;
}

type SearchResult =
  | { kind: "event"; id: string; title: string; subtitle: string; image: string; artistId: string; href: string }
  | { kind: "artist"; id: string; title: string; subtitle: string; image: string; artistId: string; href: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIdx(0);
    }
  }, [isOpen]);

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) return; // parent toggles open
      }
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const results: SearchResult[] = [];

  if (query.trim().length >= 1) {
    const q = query.toLowerCase();

    // Artists
    mockArtists
      .filter((a) => a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((a) =>
        results.push({
          kind: "artist",
          id: a.id,
          title: a.name,
          subtitle: a.genre,
          image: getArtistImage(a.id, a.image),
          artistId: a.id,
          href: `/artist/${a.id}`,
        })
      );

    // Events
    mockEvents
      .filter(
        (e) =>
          e.artistName.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.genre.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .forEach((e) =>
        results.push({
          kind: "event",
          id: e.id,
          title: e.artistName,
          subtitle: `${e.venue}, ${e.city} · ${new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          image: getArtistImage(e.artistId, e.image),
          artistId: e.artistId,
          href: `/event/${e.id}`,
        })
      );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      navigate(results[activeIdx].href);
      onClose();
    }
  };

  const handleResultClick = (href: string) => {
    navigate(href);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Search panel */}
      <div className="fixed top-[73px] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[70] px-4">
        <div className="bg-[#1a1817] border border-[#242221] rounded-2xl shadow-2xl overflow-hidden">
          {/* Input row */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#242221]">
            <Search className="w-5 h-5 text-[#C7C1B6] flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search artists, events, cities…"
              className="flex-1 bg-transparent text-white placeholder:text-[#C7C1B6]/60 text-base outline-none"
            />
            <button onClick={onClose} className="text-[#C7C1B6] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          {query.trim().length >= 1 && (
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-5 py-8 text-center text-[#C7C1B6] text-sm">
                  No results for <span className="text-white">"{query}"</span>
                </div>
              ) : (
                <div className="py-2">
                  {results.map((result, idx) => (
                    <button
                      key={`${result.kind}-${result.id}`}
                      onClick={() => handleResultClick(result.href)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
                        idx === activeIdx
                          ? "bg-[#E5381E]/15"
                          : "hover:bg-[#242221]"
                      }`}
                    >
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">
                          {result.title}
                        </p>
                        <p className="text-[#C7C1B6] text-xs truncate flex items-center gap-1 mt-0.5">
                          {result.kind === "artist" ? (
                            <Music2 className="w-3 h-3 flex-shrink-0" />
                          ) : (
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                          )}
                          {result.subtitle}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          result.kind === "artist"
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-[#E5381E]/20 text-[#E5381E]"
                        }`}
                      >
                        {result.kind === "artist" ? "Artist" : "Event"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
