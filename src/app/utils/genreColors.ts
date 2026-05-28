/**
 * Genre colour tokens — derived from the official Reverb brand posters.
 *
 * accent  – primary badge / highlight colour
 * bg      – subtle card tint (low-opacity version of accent)
 * hover   – hover overlay colour
 * gradient – bottom-of-card gradient stop
 */

export interface GenreColors {
  accent: string;
  bg: string;
  hover: string;
  gradient: string;
  text: string;
}

const GENRE_COLORS: Record<string, GenreColors> = {
  // Heavy / Rock — main brand palette
  Rock: {
    accent: "#E5381E",
    bg: "rgba(229,56,30,0.15)",
    hover: "rgba(229,56,30,0.25)",
    gradient: "#E5381E",
    text: "#fff",
  },
  // Electronic — pink/indigo poster (Punctual)
  Electronic: {
    accent: "#F063A4",
    bg: "rgba(240,99,164,0.15)",
    hover: "rgba(240,99,164,0.25)",
    gradient: "#F063A4",
    text: "#fff",
  },
  // Indie — purple poster (The Hunna)
  Indie: {
    accent: "#A05CB8",
    bg: "rgba(160,92,184,0.15)",
    hover: "rgba(160,92,184,0.25)",
    gradient: "#A05CB8",
    text: "#fff",
  },
  // Pop — coral/teal poster (Foals)
  Pop: {
    accent: "#4A8F9E",
    bg: "rgba(74,143,158,0.15)",
    hover: "rgba(74,143,158,0.25)",
    gradient: "#4A8F9E",
    text: "#fff",
  },
  // Alternative — warm coral close to brand but distinct
  Alternative: {
    accent: "#F4634A",
    bg: "rgba(244,99,74,0.15)",
    hover: "rgba(244,99,74,0.25)",
    gradient: "#F4634A",
    text: "#fff",
  },
  // Hip Hop — gold/amber
  "Hip Hop": {
    accent: "#D4A017",
    bg: "rgba(212,160,23,0.15)",
    hover: "rgba(212,160,23,0.25)",
    gradient: "#D4A017",
    text: "#fff",
  },
  // Jazz — warm teal/brown
  Jazz: {
    accent: "#7A9E7E",
    bg: "rgba(122,158,126,0.15)",
    hover: "rgba(122,158,126,0.25)",
    gradient: "#7A9E7E",
    text: "#fff",
  },
};

const DEFAULT_COLORS: GenreColors = {
  accent: "#E5381E",
  bg: "rgba(229,56,30,0.15)",
  hover: "rgba(229,56,30,0.25)",
  gradient: "#E5381E",
  text: "#fff",
};

export function getGenreColors(genre: string): GenreColors {
  return GENRE_COLORS[genre] ?? DEFAULT_COLORS;
}
