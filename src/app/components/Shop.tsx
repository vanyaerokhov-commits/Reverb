import { useState, useEffect } from "react";
import { ShoppingCart, CheckCircle2, ShoppingBag, Package, X, Plus, Minus, Truck, RotateCcw } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useCart } from "../context/CartContext";
import geometricPattern from "../../imports/image-10.png";

// Posters
import posterFoals from "../../imports/poster-foals.jpg";
import posterPunctual from "../../imports/poster-punctual.jpg";
import posterBmth from "../../imports/poster-bmth.jpg";
import posterHunna from "../../imports/poster-hunna.jpg";
import posterReverb from "../../imports/poster-reverb.mocap.jpg";
import posterReverbDesign from "../../imports/poster-reverb.jpg";

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
  description: string;
  category: Exclude<Category, "All">;
  price: number;
  image: string;
  images?: string[];          // extra images shown in drawer
  badge?: string;
  badgeColor?: string;
  objectPosition?: string;
  sizes?: string[];           // only for clothing
  details: string[];
}

const PRODUCTS: Product[] = [
  // — Posters —
  {
    id: "poster-foals",
    name: "Foals — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    description:
      "Official limited edition concert poster for Foals at Akvárium Klub, Budapest. Designed exclusively by the Reverb creative team. Each poster ships rolled in a protective tube.",
    category: "Posters",
    price: 25,
    image: posterFoals,
    badge: "Limited",
    badgeColor: "teal",
    details: ["A3 format (297 × 420mm)", "250gsm premium matte paper", "Digital offset print", "Ships rolled in protective tube", "Signed edition available"],
  },
  {
    id: "poster-punctual",
    name: "Punctual — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    description:
      "Official limited edition concert poster for Punctual at A38, Budapest. Bold typographic design with an industrial aesthetic, printed on heavyweight matte stock.",
    category: "Posters",
    price: 25,
    image: posterPunctual,
    badge: "Limited",
    badgeColor: "teal",
    details: ["A3 format (297 × 420mm)", "250gsm premium matte paper", "Digital offset print", "Ships rolled in protective tube"],
  },
  {
    id: "poster-bmth",
    name: "Bring Me The Horizon",
    subtitle: "A3 Art Print · Limited Edition",
    description:
      "Official limited edition concert poster for Bring Me The Horizon at Barba Negra, Budapest. Dark industrial design with the band's signature aesthetic.",
    category: "Posters",
    price: 25,
    image: posterBmth,
    badge: "Limited",
    badgeColor: "teal",
    details: ["A3 format (297 × 420mm)", "250gsm premium matte paper", "Digital offset print", "Ships rolled in protective tube"],
  },
  {
    id: "poster-hunna",
    name: "The Hunna — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    description:
      "Official limited edition concert poster for The Hunna at Barba Negra, Budapest. Atmospheric purple-hued design, part of the Reverb European Tour series.",
    category: "Posters",
    price: 25,
    image: posterHunna,
    badge: "Limited",
    badgeColor: "teal",
    details: ["A3 format (297 × 420mm)", "250gsm premium matte paper", "Digital offset print", "Ships rolled in protective tube"],
  },
  {
    id: "poster-reverb",
    name: "Reverb Brand Poster",
    subtitle: "A2 Art Print · Official Reverb",
    description:
      "The official Reverb brand poster — a collector's piece featuring the Reverb identity in an abstract geometric composition. Larger A2 format for a bold statement on any wall.",
    category: "Posters",
    price: 20,
    image: posterReverb,
    images: [posterReverbDesign],
    objectPosition: "object-center",
    details: ["A2 format (420 × 594mm)", "300gsm premium matte paper", "Digital offset print", "Ships rolled in protective tube"],
  },
  // — Clothing —
  {
    id: "merch-hoodie",
    name: "Reverb Hoodie",
    subtitle: "Black & Red · Unisex",
    description:
      "The Reverb signature hoodie. Black body with bold red sleeves and hood, featuring original Reverb artwork across the back. Heavyweight 400gsm fleece — built to last season after season.",
    category: "Clothing",
    price: 65,
    image: merchHoodie,
    badge: "New",
    badgeColor: "red",
    objectPosition: "object-center",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    details: ["400gsm heavyweight fleece", "80% cotton / 20% polyester", "Unisex oversized fit", "Machine wash 30°C", "Embroidered Reverb logo on chest"],
  },
  {
    id: "merch-tshirt",
    name: "Reverb T-Shirt",
    subtitle: "Cream · Unisex",
    description:
      "A clean everyday tee in warm cream with a subtle embroidered Reverb logo on the chest. Relaxed fit, premium organic cotton — understated and iconic.",
    category: "Clothing",
    price: 35,
    image: merchTshirt,
    objectPosition: "object-center",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    details: ["220gsm organic cotton", "100% GOTS certified cotton", "Unisex relaxed fit", "Machine wash 30°C", "Embroidered Reverb logo on chest"],
  },
  // — Accessories —
  {
    id: "merch-tote",
    name: "Reverb Tote Bag",
    subtitle: "Black Canvas · Concert Edition",
    description:
      "Heavy-duty black canvas tote bag printed with original Reverb concert collage artwork. Large enough for vinyl, merch and everything else you pick up at a show.",
    category: "Accessories",
    price: 30,
    image: merchTote,
    objectPosition: "object-center",
    details: ["380gsm natural canvas", "42 × 38cm · 10L capacity", "Reinforced handles", "Water-resistant lining", "Screen-printed artwork"],
  },
  {
    id: "merch-case",
    name: "Reverb iPhone Case",
    subtitle: "Beige · Logo Edition",
    description:
      "Minimalist beige iPhone case with the Reverb icon and signature geometric line pattern. Protective dual-layer construction with MagSafe compatibility.",
    category: "Accessories",
    price: 25,
    image: merchCase,
    objectPosition: "object-center",
    details: ["Compatible: iPhone 14 / 15 / 15 Pro", "Dual-layer TPU + polycarbonate", "MagSafe compatible", "Raised lip camera protection", "Matte finish"],
  },
  {
    id: "merch-pins",
    name: "Reverb Pin Set",
    subtitle: "Set of 3 · Red, Cream & Black",
    description:
      "A set of three enamel pin badges — one in each Reverb colourway: red, cream, and black. 38mm diameter, standard butterfly clasp. Perfect for jackets, bags and lanyards.",
    category: "Accessories",
    price: 12,
    image: merchPins,
    objectPosition: "object-center",
    details: ["38mm diameter each", "Hard enamel finish", "Standard butterfly clasp", "Set of 3 (red, cream, black)", "Branded backing card"],
  },
  {
    id: "merch-wristband",
    name: "VIP Wristband",
    subtitle: "Event Exclusive · Reverb",
    description:
      "The Reverb VIP event wristband — a collector's keepsake from the Budapest concert series. Tyvek material with full-colour print, identical to those used at the shows.",
    category: "Accessories",
    price: 8,
    image: merchWristband,
    objectPosition: "object-center",
    details: ["Tyvek material", "Full-colour digital print", "Tamper-evident adhesive", "One size fits all", "Identical to event issue"],
  },
  {
    id: "merch-badge-light",
    name: "Reverb Badge — Light",
    subtitle: "Cream · Staff Edition",
    description:
      "The Reverb staff credential badge in cream colourway. Comes with a lanyard clip and clear protective sleeve. A premium collectible from the Reverb event series.",
    category: "Accessories",
    price: 10,
    image: merchBadgeLight,
    objectPosition: "object-center",
    details: ["85 × 54mm (credit card size)", "300gsm laminated card", "Lanyard hole + metal clip", "Reverb-branded lanyard included", "Collector's edition"],
  },
  {
    id: "merch-badge-dark",
    name: "Reverb Badge — Dark",
    subtitle: "Black · Staff Edition",
    description:
      "The Reverb staff credential badge in black colourway. A striking, dark-edition collectible with the signature red Reverb branding. Lanyard included.",
    category: "Accessories",
    price: 10,
    image: merchBadgeDark,
    objectPosition: "object-center",
    details: ["85 × 54mm (credit card size)", "300gsm laminated card", "Lanyard hole + metal clip", "Reverb-branded lanyard included", "Collector's edition"],
  },
  {
    id: "merch-tape",
    name: "Reverb Tape",
    subtitle: "Red · Logo Pattern",
    description:
      "Reverb-branded washi/packing tape in signature red, printed with a repeating Reverb logo pattern. Great for packaging, decoration and expressing your Reverb love.",
    category: "Accessories",
    price: 6,
    image: merchTape,
    objectPosition: "object-center",
    details: ["25mm wide × 10m roll", "Water-activated adhesive", "Recyclable paper backing", "Full-colour logo repeat print"],
  },
];

const CATEGORIES: Category[] = ["All", "Posters", "Clothing", "Accessories"];

// ─── Product Drawer ───────────────────────────────────────────────
function ProductDrawer({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes ? product.sizes[2] : ""   // default M
  );
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image);

  const allImages = [product.image, ...(product.images ?? [])];

  // Lock body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAdd = () => {
    addItem({
      eventId: product.id,
      artistName: product.name,
      venue: product.category,
      city: "Official Merch",
      date: "",
      time: "",
      tier: selectedSize || "Standard",
      price: product.price,
      quantity: qty,
      image: product.image,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const isPosters = product.category === "Posters";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-[#141111] border-l border-[#242221] z-[61] flex flex-col overflow-hidden shadow-2xl">
        {/* Close button */}
        <div className="flex items-center justify-between p-5 border-b border-[#242221] flex-shrink-0">
          <span className="text-[#C7C1B6] text-sm font-medium">{product.category}</span>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main image */}
          <div
            className={`relative overflow-hidden bg-[#0d0b0b] ${
              isPosters ? "aspect-[2/3] max-h-[60vh]" : "aspect-[4/3]"
            }`}
          >
            <img
              src={activeImage}
              alt={product.name}
              className={`w-full h-full ${isPosters ? "object-contain" : "object-cover"} ${product.objectPosition ?? "object-top"}`}
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge
                  className={
                    product.badgeColor === "red"
                      ? "bg-[#E5381E] text-white border-0"
                      : "bg-teal-500/80 text-white border-0 backdrop-blur-sm"
                  }
                >
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail strip (if multiple images) */}
          {allImages.length > 1 && (
            <div className="flex gap-2 px-5 pt-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? "border-[#E5381E]" : "border-[#242221] hover:border-[#C7C1B6]/40"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="p-5 space-y-5">
            {/* Name + price */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white leading-tight mb-1">
                  {product.name}
                </h2>
                <p className="text-[#C7C1B6] text-sm">{product.subtitle}</p>
              </div>
              <span className="text-3xl font-bold text-white flex-shrink-0">
                ${product.price}
              </span>
            </div>

            {/* Description */}
            <p className="text-[#C7C1B6] text-sm leading-relaxed">{product.description}</p>

            <Separator className="bg-[#242221]" />

            {/* Size selector (clothing only) */}
            {product.sizes && (
              <div>
                <p className="text-white text-sm font-semibold mb-3">
                  Size — <span className="text-[#E5381E]">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 rounded-lg text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? "bg-[#E5381E] text-white"
                          : "bg-[#242221] text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white border border-[#242221]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-white text-sm font-semibold">Quantity</p>
              <div className="flex items-center border border-[#242221] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-white font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[#C7C1B6] text-sm ml-auto">
                Total: <span className="text-white font-bold">${(product.price * qty).toFixed(2)}</span>
              </span>
            </div>

            {/* Add to cart */}
            <Button
              onClick={handleAdd}
              className={`w-full h-12 text-base font-semibold transition-all ${
                justAdded
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "bg-[#E5381E] hover:bg-[#991a0a] text-white"
              }`}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>

            <Separator className="bg-[#242221]" />

            {/* Product details */}
            <div>
              <p className="text-white text-sm font-semibold mb-3">Product Details</p>
              <ul className="space-y-2">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#C7C1B6]">
                    <span className="w-1 h-1 rounded-full bg-[#E5381E] flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping info */}
            <div className="grid grid-cols-2 gap-3 pb-4">
              <div className="flex items-start gap-2 p-3 bg-[#242221]/50 rounded-xl">
                <Truck className="w-4 h-4 text-[#E5381E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-xs font-semibold">Shipping</p>
                  <p className="text-[#C7C1B6] text-xs">3–5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-[#242221]/50 rounded-xl">
                <RotateCcw className="w-4 h-4 text-[#E5381E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-xs font-semibold">Returns</p>
                  <p className="text-[#C7C1B6] text-xs">30-day easy returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────────────
function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (p: Product) => void;
}) {
  const isPosters = product.category === "Posters";

  return (
    <Card
      onClick={() => onOpen(product)}
      className="bg-[#141111]/50 border-[#242221] overflow-hidden group hover:border-[#E5381E]/40 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isPosters ? "aspect-[2/3]" : "aspect-[4/3]"}`}>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover ${product.objectPosition ?? "object-top"} group-hover:scale-105 transition-transform duration-500`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141111]/70 via-transparent to-transparent" />

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

        {/* Hover overlay hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-[#141111]/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
            View product
          </span>
        </div>

        {isPosters && (
          <div className="absolute bottom-3 right-3">
            <span className="text-white font-bold text-lg drop-shadow-lg">${product.price}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-white font-bold text-sm leading-tight mb-0.5 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[#C7C1B6] text-xs mb-3">{product.subtitle}</p>
        {!isPosters && (
          <span className="text-white font-bold text-lg">${product.price}</span>
        )}
      </div>
    </Card>
  );
}

// ─── Main Shop page ───────────────────────────────────────────────
export function Shop() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);

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
      <div
        className="relative z-10 overflow-hidden rounded-2xl cursor-pointer group"
        onClick={() => setDrawerProduct(PRODUCTS.find((p) => p.id === "merch-hoodie")!)}
      >
        <div className="relative h-48 sm:h-64">
          <img
            src={merchHoodie}
            alt="Reverb Hoodie"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141111]/90 via-[#141111]/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
            <Badge className="bg-[#E5381E] text-white border-0 self-start mb-3">New Drop</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Reverb Hoodie</h2>
            <p className="text-[#C7C1B6] text-sm mb-4">Black & Red · Limited Stock</p>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-2xl">$65</span>
              <span className="text-[#C7C1B6] text-sm group-hover:text-[#E5381E] transition-colors">
                View product →
              </span>
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
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat ? "bg-white/20" : "bg-[#242221]"}`}>
              {counts[cat]}
            </span>
          </button>
        ))}
      </div>

      {/* Posters */}
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
            {posters.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setDrawerProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Clothing */}
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
            {clothing.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setDrawerProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Accessories */}
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
            {accessories.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setDrawerProduct} />
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

      {/* Product drawer */}
      {drawerProduct && (
        <ProductDrawer product={drawerProduct} onClose={() => setDrawerProduct(null)} />
      )}
    </div>
  );
}
