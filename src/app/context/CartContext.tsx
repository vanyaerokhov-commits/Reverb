import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  eventId: string;
  artistName: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  tier: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.eventId === item.eventId && i.tier === item.tier
      );
      if (idx >= 0) {
        toast.success(`Added to cart`, {
          description: `${item.artistName} · ${item.tier}`,
          icon: "🎟",
        });
        return prev.map((i, j) =>
          j === idx ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      toast.success(`Added to cart`, {
        description: `${item.artistName} · ${item.tier}`,
        icon: "🎟",
      });
      return [...prev, { ...item, id: `${item.eventId}-${item.tier}-${Date.now()}` }];
    });
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) removeItem(id);
    else setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
