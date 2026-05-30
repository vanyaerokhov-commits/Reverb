import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { Music, Ticket, Calendar, User, Route, ChevronLeft, ChevronRight, ShoppingCart, Tag, Search, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import reverbLogo from "../../imports/лого цвет 2 .png";
import { useCart } from "../context/CartContext";
import { GlobalSearch } from "./GlobalSearch";

export function Root() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  // Ctrl/Cmd+K to open global search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  
  const navItems = [
    { path: "/", icon: Music, label: "Discover" },
    { path: "/tickets", icon: Ticket, label: "Tickets" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/resale", icon: Tag, label: "Resale" },
    { path: "/shop", icon: ShoppingBag, label: "Shop" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-[#242221]">
      <ScrollToTop />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#141111] bg-[#242221]/95 backdrop-blur-xl">
        <div className="w-full px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={reverbLogo} alt="Reverb" className="h-7 sm:h-10 object-contain" />
          </Link>

          <div className="flex items-center gap-3">
            {/* Global search */}
            <Button
              variant="ghost"
              onClick={() => setSearchOpen(true)}
              className="text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-[#E5381E] px-3 py-2 rounded-lg h-auto hidden sm:flex items-center gap-2"
              title="Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
              <span className="text-sm hidden md:inline text-[#C7C1B6]/60">Search…</span>
            </Button>

            <Link to="/cart">
              <Button
                variant="ghost"
                className="text-[#C7C1B6] hover:bg-[#E5381E]/20 hover:text-[#E5381E] relative px-4 py-2 rounded-lg h-auto"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E5381E] text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Link
              to="/route-planner"
              className="flex items-center gap-2 px-4 py-2 bg-[#E5381E] text-white rounded-lg hover:bg-[#991a0a] transition-all"
            >
              <Route className="w-4 h-4" />
              <span className="hidden sm:inline">Plan Route</span>
            </Link>
          </div>

          <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 py-6 pb-24 transition-all duration-300 ${
        isSidebarOpen ? "lg:pl-72" : "lg:pl-24"
      }`}>
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#242221]/95 backdrop-blur-xl border-t border-[#141111] lg:hidden z-50">
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = path === "/" ? location.pathname === "/" : location.pathname === path || location.pathname.startsWith(path + "/");
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "text-[#E5381E] bg-[#141111]/50"
                    : "text-[#C7C1B6] hover:text-[#E5381E]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-tight">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Side Navigation - Desktop */}
      <nav className={`hidden lg:block fixed left-0 top-[73px] bottom-0 border-r border-[#141111] bg-[#141111]/50 backdrop-blur-xl transition-all duration-300 z-40 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}>
        <div className="p-6 space-y-2">
          {/* Toggle Button */}
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="ghost"
            size="icon"
            className={`text-[#C7C1B6] hover:text-white hover:bg-[#E5381E]/20 mb-4 ${
              isSidebarOpen ? "ml-auto" : "mx-auto"
            }`}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>

          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = path === "/" ? location.pathname === "/" : location.pathname === path || location.pathname.startsWith(path + "/");
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "text-white bg-[#E5381E]"
                    : "text-[#C7C1B6] hover:text-white hover:bg-[#E5381E]/20"
                } ${!isSidebarOpen ? "justify-center" : ""}`}
                title={!isSidebarOpen ? label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}