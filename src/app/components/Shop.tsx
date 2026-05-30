import { useState } from "react";
import { ShoppingCart, CheckCircle2, ShoppingBag, Package } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "../context/CartContext";
import geometricPattern from "../../imports/image-10.png";

// Posters
import posterFoals from "../../imports/poster-foals.jpg";
import posterPunctual from "../../imports/poster-punctual.jpg";
import posterBmth from "../../imports/poster-bmth.jpg";
import posterHunna from "../../imports/poster-hunna.jpg";
import posterReverb from "../../imports/poster-reverb.mocap.jpg";

// Merch
import merchHoodie from "../../imports/merch-hoodie.jpg";
import merchTshirt from "../../imports/merch-tshirt.jpg";
import merchTote from "../../imports/merch-tote.jpg";
import merchCase from "../../imports/merch-case.jpg";
import merchPins from "../../imports/merch-pins.jpg";
import merchWristband from "../../imports/merch-wristband.jpg";
import merchBadgeLight from "../../imports/merch-badge-light.jpg";
import merchBadgeDark from "../../imports/merch-badge-dark.jpg";
import merchTape from "../../imports/merch-tape.jpg";

type Category = "All" | "Posters" | "Clothing" | "Accessories";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<Category, "All">;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  objectPosition?: string;
}

const PRODUCTS: Product[] = [
  // — Posters —
  {
    id: "poster-foals",
    name: "Foals — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    category: "Posters",
    price: 25,
    image: posterFoals,
    badge: "Limited",
    badgeColor: "teal",
  },
  {
    id: "poster-punctual",
    name: "Punctual — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    category: "Posters",
    price: 25,
    image: posterPunctual,
    badge: "Limited",
    badgeColor: "teal",
  },
  {
    id: "poster-bmth",
    name: "Bring Me The Horizon",
    subtitle: "A3 Art Print · Limited Edition",
    category: "Posters",
    price: 25,
    image: posterBmth,
    badge: "Limited",
    badgeColor: "teal",
  },
  {
    id: "poster-hunna",
    name: "The Hunna — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    category: "Posters",
    price: 25,
    image: posterHunna,
    badge: "Limited",
    badgeColor: "teal",
  },
  {
    id: "poster-reverb",
    name: "Reverb Brand Poster",
    subtitle: "A2 Art Print · Official Reverb",
    category: "Posters",
    price: 20,
    image: posterReverb,
    objectPosition: "object-center",
  },
  // — Clothing —
  {
    id: "merch-hoodie",
    name: "Reverb Hoodie",
    subtitle: "Black & Red · Unisex",
    category: "Clothing",
    price: 65,
    image: merchHoodie,
    badge: "New",
    badgeColor: "red",
    objectPosition: "object-center",
  },
  {
    id: "merch-tshirt",
    name: "Reverb T-Shirt",
    subtitle: "Cream · Unisex",
    category: "Clothing",
    price: 35,
    image: merchTshirt,
    objectPosition: "object-center",
  },
  // — Accessories —
  {
    id: "merch-tote",
    name: "Reverb Tote Bag",
    subtitle: "Black Canvas · Concert Edition",
    category: "Accessories",
    price: 30,
    image: merchTote,
    objectPosition: "object-center",
  },
  {
    id: "merch-case",
    name: "Reverb iPhone Case",
    subtitle: "Beige · Logo Edition",
    category: "Accessories",
    price: 25,
    image: merchCase,
    objectPosition: "object-center",
  },
  {
    id: "merch-pins",
    name: "Reverb Pin Set",
    subtitle: "Set of 3 · Red, Cream & Black",
    category: "Accessories",
    price: 12,
    image: merchPins,
    objectPosition: "object-center",
  },
  {
    id: "merch-wristband",
    name: "VIP Wristband",
    subtitle: "Event Exclusive · Reverb",
    category: "Accessories",
    price: 8,
    image: merchWristband,
    objectPosition: "object-center",
  },
  {
    id: "merch-badge-light",
    name: "Reverb Badge — Light",
    subtitle: "Cream · Staff Edition",
    category: "Accessories",
    price: 10,
    image: merchBadgeLight,
    objectPosition: "object-center",
  },
  {
    id: "merch-badge-dark",
    name: "Reverb Badge — Dark",
    subtitle: "Black · Staff Edition",
    category: "Accessories",
    price: 10,
    image: merchBadgeDark,
    objectPosition: "object-center",
  },
  {
    id: "merch-tape",
    name: "Reverb Tape",
    subtitle: "Red · Logo Pattern",
    category: "Accessories",
    price: 6,
    image: merchTape,
    objectPosition: "object-center",
  },
];

const CATEGORIES: Category[] = ["All", "Posters", "Clothing", "Accessories"];

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isPosters = product.category === "Posters";

  const handleAdd = () => {
    addItem({
      eventId: product.id,
      artistName: product.name,
      venue: product.category,
      city: "Official Merch",
      date: "",
      time: "",
      tier: "Standard",
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Card className="bg-[#141111]/50 border-[#242221] overflow-hidden group hover:border-[#E5381E]/40 transition-all duration-300">
      {/* Image */}
      <div className={`relative overflow-hidden ${isPosters ? "aspect-[2/3]" : "aspect-[4/3]"}`}>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover ${product.objectPosition ?? "object-top"} group-hover:scale-105 transition-transform duration-500`}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141111]/60 via-transparent to-transparent" />
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge
              className={
                product.badgeColor === "red"
                  ? "bg-[#E5381E] text-white border-0 text-xs"
                  : "bg-teal-500/80 text-white border-0 text-xs backdrop-blur-sm"
              }
            >
              {product.badge}
            </Badge>
          </div>
        )}
        {/* Price on image (poster style) */}
        {isPosters && (
          <div className="absolute bottom-3 right-3">
            <span className="text-white font-bold text-lg drop-shadow-lg">${product.price}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[#C7C1B6] text-xs">{product.subtitle}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          {!isPosters && (
            <span className="text-white font-bold text-xl">${product.price}</span>
          )}
          <Button
            onClick={handleAdd}
            size="sm"
            className={`transition-all ${isPosters ? "w-full" : "ml-auto"} ${
              justAdded
                ? "bg-green-600 hover:bg-green-600 text-white"
                : "bg-[#E5381E] hover:bg-[#991a0a] text-white"
            }`}
          >
            {justAdded ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function Shop() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const posters = PRODUCTS.filter((p) => p.category === "Posters");
  const clothing = PRODUCTS.filter((p) => p.category === "Clothing");
  const accessories = PRODUCTS.filter((p) => p.category === "Accessories");

  const showPosters = activeCategory === "All" || activeCategory === "Posters";
  const showClothing = activeCategory === "All" || activeCategory === "Clothing";
  const showAccessories = activeCategory === "All" || activeCategory === "Accessories";

  const counts: Record<Category, number> = {
    All: PRODUCTS.length,
    Posters: posters.length,
    Clothing: clothing.length,
    Accessories: accessories.length,
  };

  return (
    <div className="relative space-y-8">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img src={geometricPattern} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 w-[700px] h-[700px] rounded-full bg-[#242221]" />
        <div className="absolute right-0 -bottom-40 w-[800px] h-[800px] rounded-full bg-[#242221]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start gap-3">
        <div className="w-1 h-12 bg-[#E5381E] rounded-[10px] mt-1 flex-shrink-0" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Reverb Shop</h1>
          <p className="text-[#C7C1B6]">Official merch & limited edition event posters</p>
        </div>
      </div>

      {/* Featured banner */}
      <div className="relative z-10 overflow-hidden rounded-2xl">
        <div className="relative h-48 sm:h-64">
          <img
            src={merchHoodie}
            alt="Reverb Hoodie"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141111]/90 via-[#141111]/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
            <Badge className="bg-[#E5381E] text-white border-0 self-start mb-3">New Drop</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Reverb Hoodie</h2>
            <p className="text-[#C7C1B6] text-sm mb-4">Black & Red · Limited Stock</p>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-2xl">$65</span>
              <ShoppingBag className="w-5 h-5 text-[#E5381E]" />
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="relative z-10 flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === cat
                ? "bg-[#E5381E] text-white"
                : "bg-[#141111]/50 text-[#C7C1B6] border border-[#242221] hover:border-[#E5381E]/50 hover:text-white"
            }`}
          >
            {cat}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat ? "bg-white/20" : "bg-[#242221]"
              }`}
            >
              {counts[cat]}
            </span>
          </button>
        ))}
      </div>

      {/* Posters section */}
      {showPosters && (
        <div className="relative z-10 space-y-4">
          {activeCategory === "All" && (
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E5381E] rounded-[10px]" />
              <h2 className="text-lg font-bold text-white">Event Posters</h2>
              <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0">{posters.length}</Badge>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {posters.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Clothing section */}
      {showClothing && (
        <div className="relative z-10 space-y-4">
          {activeCategory === "All" && (
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E5381E] rounded-[10px]" />
              <h2 className="text-lg font-bold text-white">Clothing</h2>
              <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0">{clothing.length}</Badge>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clothing.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Accessories section */}
      {showAccessories && (
        <div className="relative z-10 space-y-4">
          {activeCategory === "All" && (
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#E5381E] rounded-[10px]" />
              <h2 className="text-lg font-bold text-white">Accessories</h2>
              <Badge className="bg-[#E5381E]/20 text-[#C7C1B6] border-0">{accessories.length}</Badge>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {accessories.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="relative z-10 flex items-start gap-2 text-xs text-[#C7C1B6] p-4 bg-[#141111]/30 rounded-xl border border-[#242221]/50">
        <Package className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#E5381E]" />
        <p>
          All orders are shipped within 3–5 business days. Posters are printed on 250gsm premium matte paper.
          Free shipping on orders over $50.
        </p>
      </div>
    </div>
  );
}
