import { useState } from "react";
import { Link } from "react-router";
import {
  ShoppingCart,
  Trash2,
  ChevronLeft,
  MapPin,
  Calendar,
  Plus,
  Minus,
  CreditCard,
  CheckCircle,
  Ticket,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useCart } from "../context/CartContext";
import geometricPattern from "../../imports/image-10.png";

export function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedItems, setConfirmedItems] = useState<typeof items>([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  const handleCheckout = () => {
    setConfirmedItems([...items]);
    setConfirmedTotal(totalPrice * 1.1);
    setOrderNumber(`RVB-${Date.now().toString().slice(-6)}`);
    clearCart();
    setConfirmed(true);
  };

  return (
    <div className="relative space-y-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img src={geometricPattern} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute left-1/3 -top-48 w-[750px] h-[750px] rounded-full bg-[#242221]"></div>
        <div className="absolute -right-64 top-2/3 w-[950px] h-[950px] rounded-full bg-[#242221]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-1 h-12 bg-[#E5381E] rounded-[10px] mt-1 flex-shrink-0"></div>
        <div className="flex-1 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Your Cart</h2>
            <p className="text-[#C7C1B6]">
              {totalItems} {totalItems === 1 ? "ticket" : "tickets"} selected
            </p>
          </div>
          <Link to="/events">
            <Button
              variant="ghost"
              className="text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      {confirmed ? (
        /* ── Order Confirmation Screen ── */
        <Card className="relative z-10 bg-[#141111]/50 border-[#242221] p-5 sm:p-8 md:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
            <p className="text-[#C7C1B6] mb-1">Your tickets are secured and ready.</p>
            <p className="text-sm text-[#C7C1B6] mb-8">
              Order{" "}
              <span className="font-semibold text-white tracking-widest">
                {orderNumber}
              </span>
            </p>

            {/* Purchase summary */}
            <div className="text-left bg-[#242221]/60 rounded-xl p-4 mb-8 space-y-2">
              {confirmedItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[#C7C1B6] truncate mr-3">
                    {item.artistName} — {item.tier} × {item.quantity}
                  </span>
                  <span className="text-white flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator className="bg-[#242221] my-2" />
              <div className="flex justify-between font-bold text-sm">
                <span className="text-[#C7C1B6]">Total (incl. 10% fees)</span>
                <span className="text-white">${confirmedTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/tickets" className="flex-1">
                <Button className="w-full bg-[#E5381E] text-white hover:bg-[#991a0a]">
                  <Ticket className="w-4 h-4 mr-2" />
                  View My Tickets
                </Button>
              </Link>
              <Link to="/events" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full bg-[#C7C1B6] border-[#C7C1B6] text-[#E5381E] hover:bg-[#C7C1B6]/90 hover:border-[#C7C1B6]/90"
                >
                  Browse More
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : items.length === 0 ? (
        <Card className="relative z-10 bg-[#141111]/50 border-[#242221] p-16 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 bg-[#E5381E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-[#C7C1B6]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
            <p className="text-[#C7C1B6] mb-6">
              Browse events and add tickets to get started
            </p>
            <Link to="/events">
              <Button className="bg-[#E5381E] text-white hover:bg-[#991a0a]">
                Browse Events
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="relative z-10 grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="bg-[#141111]/50 border-[#242221] overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-44 h-36 md:h-auto relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.artistName}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#141111] to-transparent" />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {item.artistName}
                        </h3>
                        <div className="flex items-center gap-1 text-[#C7C1B6] text-sm mb-1">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.venue}, {item.city}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#C7C1B6] text-sm mb-3">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            {new Date(item.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            · {item.time}
                          </span>
                        </div>
                        <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-[#E5381E]/30">
                          {item.tier}
                        </Badge>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#C7C1B6] hover:text-red-400 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#242221] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-white font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-white font-bold text-xl">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-[#C7C1B6] hover:text-red-400 transition-colors flex items-center gap-1.5 ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all items
            </button>
          </div>

          {/* Order summary */}
          <div>
            <Card className="bg-gradient-to-br from-[#141111]/50 to-[#242221]/50 border-[#E5381E]/30 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#E5381E] rounded-[10px]"></div>
                <h3 className="text-lg font-bold text-white">Order Summary</h3>
              </div>

              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#C7C1B6] truncate mr-2">
                      {item.artistName} — {item.tier} × {item.quantity}
                    </span>
                    <span className="text-white flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-[#242221] mb-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#C7C1B6]">Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#C7C1B6]">Booking fee (10%)</span>
                  <span className="text-white">${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <Separator className="bg-[#242221] mb-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-white font-bold text-2xl">
                  ${(totalPrice * 1.1).toFixed(2)}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-[#E5381E] text-white hover:bg-[#991a0a] text-base font-semibold"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Checkout
              </Button>
              <p className="text-center text-xs text-[#C7C1B6] mt-3">
                Secure checkout · Protected by SSL
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
