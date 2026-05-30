import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ChevronLeft,
  ShoppingCart,
  CheckCircle2,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
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

interface ProductData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  badge?: string;
  badgeColor?: string;
  sizes?: string[];
  details: string[];
  care?: string[];
}

export const SHOP_PRODUCTS: ProductData[] = [
  {
    id: "poster-foals",
    name: "Foals — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    description:
      "Official limited edition concert poster for Foals at Akvárium Klub, Budapest — 18 October 2026. Designed exclusively by the Reverb creative team as part of the European Tour series. Each poster is individually numbered and ships rolled in a protective tube.",
    category: "Posters",
    price: 25,
    images: [posterFoals],
    badge: "Limited",
    badgeColor: "teal",
    details: [
      "A3 format (297 × 420 mm)",
      "250gsm premium matte paper",
      "Digital offset print",
      "Individually numbered",
      "Ships rolled in a protective tube",
      "Unframed",
    ],
  },
  {
    id: "poster-punctual",
    name: "Punctual — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    description:
      "Official limited edition concert poster for Punctual at A38, Budapest — 23 November 2026. Bold typographic design with an industrial aesthetic, part of the Reverb European Tour series. Printed on heavyweight matte stock.",
    category: "Posters",
    price: 25,
    images: [posterPunctual],
    badge: "Limited",
    badgeColor: "teal",
    details: [
      "A3 format (297 × 420 mm)",
      "250gsm premium matte paper",
      "Digital offset print",
      "Individually numbered",
      "Ships rolled in a protective tube",
      "Unframed",
    ],
  },
  {
    id: "poster-bmth",
    name: "Bring Me The Horizon",
    subtitle: "A3 Art Print · Limited Edition",
    description:
      "Official limited edition concert poster for Bring Me The Horizon at Barba Negra, Budapest — 18 October 2026. Dark industrial design with the band's signature aesthetic, created exclusively for the Reverb series.",
    category: "Posters",
    price: 25,
    images: [posterBmth],
    badge: "Limited",
    badgeColor: "teal",
    details: [
      "A3 format (297 × 420 mm)",
      "250gsm premium matte paper",
      "Digital offset print",
      "Individually numbered",
      "Ships rolled in a protective tube",
      "Unframed",
    ],
  },
  {
    id: "poster-hunna",
    name: "The Hunna — Live in Budapest",
    subtitle: "A3 Art Print · Limited Edition",
    description:
      "Official limited edition concert poster for The Hunna at Barba Negra, Budapest — 21 June 2026. Atmospheric purple-hued design, part of the Reverb European Tour series. A collector's piece for any fan.",
    category: "Posters",
    price: 25,
    images: [posterHunna],
    badge: "Limited",
    badgeColor: "teal",
    details: [
      "A3 format (297 × 420 mm)",
      "250gsm premium matte paper",
      "Digital offset print",
      "Individually numbered",
      "Ships rolled in a protective tube",
      "Unframed",
    ],
  },
  {
    id: "poster-reverb",
    name: "Reverb Brand Poster",
    subtitle: "A2 Art Print · Official Reverb",
    description:
      "The official Reverb brand poster — a collector's piece featuring the Reverb identity in an abstract geometric composition. Larger A2 format for a bold statement on any wall. Printed on 300gsm heavyweight matte stock.",
    category: "Posters",
    price: 20,
    images: [posterReverbDesign, posterReverb],
    details: [
      "A2 format (420 × 594 mm)",
      "300gsm premium matte paper",
      "Digital offset print",
      "Ships rolled in a protective tube",
      "Unframed",
    ],
  },
  {
    id: "merch-hoodie",
    name: "Reverb Hoodie",
    subtitle: "Black & Red · Unisex",
    description:
      "The Reverb signature hoodie. Black body with bold red sleeves and hood, featuring original Reverb artwork across the back — a graphic collage that captures the energy of live music. Heavyweight 400gsm fleece, built to last season after season.",
    category: "Clothing",
    price: 65,
    images: [merchHoodie],
    badge: "New",
    badgeColor: "red",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    details: [
      "400gsm heavyweight fleece",
      "80% cotton / 20% polyester",
      "Unisex oversized fit",
      "Embroidered Reverb logo on chest",
      "Original screen-print artwork on back",
      "Ribbed cuffs and hem",
    ],
    care: [
      "Machine wash 30°C inside out",
      "Do not tumble dry",
      "Do not iron on print",
      "Do not bleach",
    ],
  },
  {
    id: "merch-tshirt",
    name: "Reverb T-Shirt",
    subtitle: "Cream · Unisex",
    description:
      "A clean everyday tee in warm cream with a subtle embroidered Reverb logo on the chest. Relaxed fit in premium organic cotton — understated and iconic. The kind of tee you reach for every time.",
    category: "Clothing",
    price: 35,
    images: [merchTshirt],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    details: [
      "220gsm organic cotton",
      "100% GOTS certified cotton",
      "Unisex relaxed fit",
      "Embroidered Reverb logo on chest",
      "Pre-shrunk",
    ],
    care: [
      "Machine wash 30°C inside out",
      "Tumble dry low",
      "Warm iron if needed",
      "Do not bleach",
    ],
  },
  {
    id: "merch-tote",
    name: "Reverb Tote Bag",
    subtitle: "Black Canvas · Concert Edition",
    description:
      "Heavy-duty black canvas tote bag printed with original Reverb concert collage artwork. Large enough for vinyl, merch and everything else you pick up at a show. Reinforced handles and water-resistant lining.",
    category: "Accessories",
    price: 30,
    images: [merchTote],
    details: [
      "380gsm natural canvas",
      "42 × 38 cm · 10L capacity",
      "Reinforced stitched handles",
      "Water-resistant inner lining",
      "Screen-printed artwork",
    ],
    care: ["Hand wash cold", "Do not machine wash", "Air dry flat", "Do not iron on print"],
  },
  {
    id: "merch-case",
    name: "Reverb iPhone Case",
    subtitle: "Beige · Logo Edition",
    description:
      "Minimalist beige iPhone case with the large Reverb icon and signature geometric line pattern. Protective dual-layer construction — slim enough to slip into a pocket, tough enough for everyday use. MagSafe compatible.",
    category: "Accessories",
    price: 25,
    images: [merchCase],
    details: [
      "Compatible: iPhone 14 / 15 / 15 Pro",
      "Dual-layer TPU + polycarbonate",
      "MagSafe compatible",
      "Raised lip camera protection",
      "Matte finish",
      "1.5m drop tested",
    ],
  },
  {
    id: "merch-pins",
    name: "Reverb Pin Set",
    subtitle: "Set of 3 · Red, Cream & Black",
    description:
      "A set of three hard enamel pin badges — one in each Reverb colourway: red, cream, and black. 38mm diameter, standard butterfly clasp back. Perfect for jackets, bags, lanyards and anywhere else you want to show the Reverb logo.",
    category: "Accessories",
    price: 12,
    images: [merchPins],
    details: [
      "38mm diameter each",
      "Hard enamel finish",
      "Standard butterfly clasp",
      "Set of 3 (red, cream, black)",
      "Branded backing card",
    ],
  },
  {
    id: "merch-wristband",
    name: "VIP Wristband",
    subtitle: "Event Exclusive · Reverb",
    description:
      "The Reverb VIP event wristband — a collector's keepsake from the Budapest concert series. Tyvek material with full-colour print, identical to those used at the shows. A small piece of the night you can keep forever.",
    category: "Accessories",
    price: 8,
    images: [merchWristband],
    details: [
      "Tyvek material",
      "Full-colour digital print",
      "Tamper-evident adhesive",
      "One size fits all",
      "Identical to event issue",
    ],
  },
  {
    id: "merch-badge-light",
    name: "Reverb Badge — Light",
    subtitle: "Cream · Staff Edition",
    description:
      "The Reverb staff credential badge in cream colourway. Comes with a lanyard clip and branded clear protective sleeve. A premium collectible from the Reverb event series — the same badge worn by the team at every show.",
    category: "Accessories",
    price: 10,
    images: [merchBadgeLight],
    details: [
      "85 × 54 mm (credit card size)",
      "300gsm laminated card",
      "Lanyard hole + metal clip",
      "Reverb-branded lanyard included",
      "Collector's edition",
    ],
  },
  {
    id: "merch-badge-dark",
    name: "Reverb Badge — Dark",
    subtitle: "Black · Staff Edition",
    description:
      "The Reverb staff credential badge in black colourway. A striking dark-edition collectible with the signature red Reverb branding. The same badge worn by the team at every Reverb event. Branded lanyard included.",
    category: "Accessories",
    price: 10,
    images: [merchBadgeDark],
    details: [
      "85 × 54 mm (credit card size)",
      "300gsm laminated card",
      "Lanyard hole + metal clip",
      "Reverb-branded lanyard included",
      "Collector's edition",
    ],
  },
  {
    id: "merch-tape",
    name: "Reverb Tape",
    subtitle: "Red · Logo Pattern",
    description:
      "Reverb-branded washi/packing tape in signature red, printed with a repeating Reverb logo pattern. Great for packaging, decoration and expressing your Reverb identity — one roll at a time.",
    category: "Accessories",
    price: 6,
    images: [merchTape],
    details: [
      "25mm wide × 10m roll",
      "Water-activated adhesive",
      "Recyclable paper backing",
      "Full-colour logo repeat print",
    ],
  },
];

// ─── Accordion item ───────────────────────────────────────────────
function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#242221]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left text-white font-semibold text-sm hover:text-[#E5381E] transition-colors"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-[#C7C1B6] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function ShopProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const product = SHOP_PRODUCTS.find((p) => p.id === productId);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes ? product.sizes[2] : ""
  );
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-[#C7C1B6] text-lg mb-4">Product not found</p>
        <Button onClick={() => navigate("/shop")} className="bg-[#E5381E] text-white hover:bg-[#991a0a]">
          Back to Shop
        </Button>
      </div>
    );
  }

  const isPosters = product.category === "Posters";

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
      image: product.images[0],
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <div className="relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img src={geometricPattern} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Back */}
      <Button
        variant="ghost"
        onClick={() => navigate("/shop")}
        className="relative z-10 text-[#C7C1B6] hover:bg-[#C7C1B6] hover:text-[#E5381E] mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Shop
      </Button>

      {/* Main grid */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-8 xl:gap-16 items-start">
        {/* ── LEFT: Image gallery ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div
            className={`relative overflow-hidden rounded-2xl bg-[#0d0b0b] ${
              isPosters ? "aspect-[2/3]" : "aspect-square"
            }`}
          >
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className={`w-full h-full transition-opacity duration-300 ${
                isPosters ? "object-contain" : "object-cover object-center"
              }`}
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

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative overflow-hidden rounded-xl flex-shrink-0 w-20 h-20 border-2 transition-all ${
                    activeImage === i
                      ? "border-[#E5381E]"
                      : "border-[#242221] hover:border-[#C7C1B6]/50"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Product info (sticky on desktop) ── */}
        <div className="lg:sticky lg:top-28 space-y-6">
          {/* Category breadcrumb */}
          <p className="text-[#C7C1B6] text-xs uppercase tracking-widest font-medium">
            Reverb Shop / {product.category}
          </p>

          {/* Name + price */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-[#C7C1B6] text-sm mb-4">{product.subtitle}</p>
            <p className="text-4xl font-bold text-white">${product.price}</p>
          </div>

          {/* Size selector */}
          {product.sizes && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-semibold">
                  Size —{" "}
                  <span className="text-[#E5381E]">{selectedSize}</span>
                </p>
                <button className="text-xs text-[#C7C1B6] underline hover:text-white transition-colors">
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[52px] h-11 px-3 rounded-xl text-sm font-semibold transition-all ${
                      selectedSize === size
                        ? "bg-[#E5381E] text-white border-2 border-[#E5381E]"
                        : "bg-transparent text-[#C7C1B6] border-2 border-[#242221] hover:border-[#C7C1B6] hover:text-white"
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
            <div className="flex items-center border-2 border-[#242221] rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-white font-bold text-lg">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="w-11 h-11 flex items-center justify-center text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[#C7C1B6] text-sm">
              Total:{" "}
              <span className="text-white font-bold text-lg">
                ${(product.price * qty).toFixed(2)}
              </span>
            </span>
          </div>

          {/* Add to cart */}
          <Button
            onClick={handleAdd}
            className={`w-full h-14 text-base font-bold rounded-xl transition-all ${
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
                Add to Cart — ${(product.price * qty).toFixed(2)}
              </>
            )}
          </Button>

          {/* Delivery badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-[#141111]/50 border border-[#242221] rounded-xl">
              <Truck className="w-4 h-4 text-[#E5381E] flex-shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold">Free shipping</p>
                <p className="text-[#C7C1B6] text-xs">Orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-[#141111]/50 border border-[#242221] rounded-xl">
              <RotateCcw className="w-4 h-4 text-[#E5381E] flex-shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold">Easy returns</p>
                <p className="text-[#C7C1B6] text-xs">30-day policy</p>
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-[#242221]">
            <AccordionItem title="Description" defaultOpen>
              <p className="text-[#C7C1B6] text-sm leading-relaxed">
                {product.description}
              </p>
            </AccordionItem>

            <AccordionItem title="Product Details">
              <ul className="space-y-2">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#C7C1B6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5381E] flex-shrink-0 mt-1.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </AccordionItem>

            {product.care && (
              <AccordionItem title="Care Instructions">
                <ul className="space-y-2">
                  {product.care.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#C7C1B6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5381E] flex-shrink-0 mt-1.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            )}

            <AccordionItem title="Delivery & Returns">
              <div className="space-y-3 text-sm text-[#C7C1B6]">
                <p>
                  <span className="text-white font-semibold">Standard delivery</span> — 3–5 business days · $4.99
                </p>
                <p>
                  <span className="text-white font-semibold">Express delivery</span> — 1–2 business days · $9.99
                </p>
                <p>
                  <span className="text-white font-semibold">Free shipping</span> — on all orders over $50
                </p>
                <p className="pt-1 border-t border-[#242221]">
                  Returns accepted within 30 days of delivery. Items must be unused and in original packaging.
                  Posters must be returned rolled in their original tube.
                </p>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
}
