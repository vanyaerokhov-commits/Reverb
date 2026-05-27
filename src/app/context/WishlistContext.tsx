import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WishlistItem {
  id: string;       // eventId
  artistId: string;
  artistName: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  genre: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => boolean;  // returns true if added, false if removed
  isWishlisted: (id: string) => boolean;
  removeItem: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "reverb_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = (id: string) => items.some((i) => i.id === id);

  const toggle = (item: WishlistItem): boolean => {
    const exists = isWishlisted(item.id);
    setItems((prev) =>
      exists ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    );
    return !exists;
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
