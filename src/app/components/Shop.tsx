import { useState } from "react";
import { Link } from "react-router";
import { ShoppingBag, Package } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { SHOP_PRODUCTS } from "./ShopProduct";
import geometricPattern from "../../imports/image-10.png";
import merchHoodie from "../../imports/merch-hoodie.jpg";

type Category = "All" | "Posters" | "Clothing" | "Accessories";
const CATEGORIES: Category[] = ["All", "Posters", "Clothing", "Accessories"];

function ProductCard({ product }: { product: (typeof SHOP_PRODUCTS)[0] }) {
  const isPosters = product.category === "Posters";

  return (
    <Link to={`/shop/${product.id}`}>
      <Card className="bg-[#141111]/50 border-[#242221] overflow-hidden group hover:border-[#E5381E]/40 transition-colors cursor-pointer h-full">
        {/* Image */}
        <div className={`relative overflow-hidden ${isPosters ? "aspect-[2/3]" : "aspect-[4/3]"}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover object-center transform-gpu group-hover:scale-[1.04] transition-transform duration-300 ease-out`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141111]/70 via-transparent to-transparent" />

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

          {/* Hover hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <span className="bg-[#141111]/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              View product →
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
          <h3 className="text-white font-bold text-sm leading-tight mb-0.5 line-clamp-2 group-hover:text-[#E5381E] transition-colors duration-150">
            {product.name}
          </h3>
          <p className="text-[#C7C1B6] text-xs mb-2">{product.subtitle}</p>
          {!isPosters && (
            <span className="text-white font-bold text-lg">${product.price}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function Shop() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const posters = SHOP_PRODUCTS.filter((p) => p.category === "Posters");
  const clothing = SHOP_PRODUCTS.filter((p) => p.category === "Clothing");
  const accessories = SHOP_PRODUCTS.filter((p) => p.category === "Accessories");

  const showPosters = activeCategory === "All" || activeCategory === "Posters";
  const showClothing = activeCategory === "All" || activeCategory === "Clothing";
  const showAccessories = activeCategory === "All" || activeCategory === "Accessories";

  const counts: Record<Category, number> = {
    All: SHOP_PRODUCTS.length,
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
      <Link to="/shop/merch-hoodie" className="relative z-10 block overflow-hidden rounded-2xl group">
        <div className="relative h-48 sm:h-64">
          <img
            src={merchHoodie}
            alt="Reverb Hoodie"
            className="w-full h-full object-cover object-center transform-gpu group-hover:scale-[1.03] transition-transform duration-300 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141111]/90 via-[#141111]/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
            <Badge className="bg-[#E5381E] text-white border-0 self-start mb-3">New Drop</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Reverb Hoodie</h2>
            <p className="text-[#C7C1B6] text-sm mb-4">Black & Red · Limited Stock</p>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-2xl">$65</span>
              <span className="text-[#C7C1B6] text-sm group-hover:text-[#E5381E] transition-colors">
                Shop now →
              </span>
              <ShoppingBag className="w-5 h-5 text-[#E5381E]" />
            </div>
          </div>
        </div>
      </Link>

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
            {posters.map((p) => <ProductCard key={p.id} product={p} />)}
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
            {clothing.map((p) => <ProductCard key={p.id} product={p} />)}
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
            {accessories.map((p) => <ProductCard key={p.id} product={p} />)}
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
