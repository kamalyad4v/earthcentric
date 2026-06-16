"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button, Badge, LiquidButton, MetalButton } from "@/components/ui/shared";
import { ScaleHover, AnimatePresence } from "@/components/FramerComponents";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Sliders,
  ShieldCheck,
  Building,
  Menu,
  X,
  Trash2,
  Settings,
  Leaf,
  Plus,
  Minus,
  Search,
} from "lucide-react";

interface NavbarSearchProps {
  onSearchComplete?: () => void;
}

function NavbarSearch({ onSearchComplete }: NavbarSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [navSearch, setNavSearch] = useState("");

  useEffect(() => {
    setNavSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      router.push("/marketplace");
    }
    if (onSearchComplete) {
      onSearchComplete();
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
      <input
        type="text"
        placeholder="Search products..."
        value={navSearch}
        onChange={(e) => setNavSearch(e.target.value)}
        className="w-full bg-muted/40 hover:bg-muted/65 focus:bg-card border border-border/40 rounded-full pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
      />
    </form>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Keyboard shortcut Ctrl/Cmd+K or / to open Spotlight Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      if (e.key === "/") {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setIsSpotlightOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSpotlightOpen(false);
    }
  };

  const handleSuggestionClick = (val: string) => {
    setSearchTerm(val);
    router.push(`/marketplace?search=${encodeURIComponent(val)}`);
    setIsSpotlightOpen(false);
  };

  if (pathname?.startsWith("/seller/dashboard") || pathname?.startsWith("/admin/dashboard")) return null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-lg select-none">
            <Leaf className="h-5 w-5 fill-accent stroke-primary" />
            <span className="font-semibold tracking-tight text-primary dark:text-foreground">EARTHCENTRIC</span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link
              href="/marketplace"
              className={
                pathname === "/marketplace"
                  ? "text-primary dark:text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Marketplace
            </Link>
            <Link
              href="/#categories"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/#impact-tracker"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Impact Tracker
            </Link>
            <Link
              href="/#verified-sellers"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Verified Sellers
            </Link>
            <Link
              href="/#sustainability-mission"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop Search Bar Trigger */}
          <div className="hidden md:flex items-center flex-1 w-full max-w-[180px] lg:max-w-[260px] mx-4 lg:mx-8">
            <div 
              onClick={() => setIsSpotlightOpen(true)}
              className="w-full relative cursor-pointer group"
            >
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
              <div className="w-full bg-muted/40 hover:bg-muted/60 border border-border/40 rounded-full pl-9 pr-4 py-1.5 text-xs text-muted-foreground/50 select-none transition-all flex items-center justify-between">
                <span>Search products...</span>
                <span className="text-[9px] bg-muted/70 px-1.5 py-0.5 rounded border border-border/20 text-muted-foreground/70 font-semibold tracking-widest">⌘K</span>
              </div>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart Trigger */}
            <ScaleHover>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </ScaleHover>

            {/* User Account Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1.5 focus:outline-none cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium hover:text-primary dark:hover:text-foreground max-w-[120px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-card p-1.5 shadow-lg z-50">
                    <div className="px-3 py-2 border-b border-border/30 mb-1">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {user.role === "BUYER" && (
                      <>
                        <Link
                          href="/marketplace"
                          className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-sm hover:bg-muted/50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Go to Shop</span>
                        </Link>
                        <Link
                          href="/seller/verification"
                          className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-sm hover:bg-muted/50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Building className="h-4 w-4" />
                          <span>Become a Seller</span>
                        </Link>
                      </>
                    )}

                    {user.role === "SELLER" && (
                      <Link
                        href={user.sellerStatus === "APPROVED" ? "/seller/dashboard" : "/seller/verification"}
                        className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-sm hover:bg-muted/50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Building className="h-4 w-4" />
                        <span>{user.sellerStatus === "APPROVED" ? "Go to Dashboard" : "Seller Area"}</span>
                      </Link>
                    )}

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/dashboard"
                        className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-sm hover:bg-muted/50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-500/5"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="cool" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground md:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background px-4 py-4 space-y-3 z-30">
            {/* Mobile Search Bar Trigger */}
            <div 
              onClick={() => { setIsSpotlightOpen(true); setIsMobileMenuOpen(false); }}
              className="relative pb-2 cursor-pointer"
            >
              <div className="w-full relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <div className="w-full bg-muted/40 border border-border/40 rounded-full pl-9 pr-4 py-2 text-xs text-muted-foreground/50 select-none">
                  Search sustainable products...
                </div>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="block text-base font-medium py-2 border-b border-border/20 text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/#categories"
              className="block text-base font-medium py-2 border-b border-border/20 text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/#impact-tracker"
              className="block text-base font-medium py-2 border-b border-border/20 text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact Tracker
            </Link>
            <Link
              href="/#verified-sellers"
              className="block text-base font-medium py-2 border-b border-border/20 text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Verified Sellers
            </Link>
            <Link
              href="/#sustainability-mission"
              className="block text-base font-medium py-2 border-b border-border/20 text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </header>

      {/* Spotlight Search Overlay Modal */}
      {isSpotlightOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={() => setIsSpotlightOpen(false)} />
          
          {/* Spotlight Card */}
          <div className="relative w-full max-w-xl glass-panel rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[60vh] border border-[#d0c6b8]/50 dark:border-[#243b2e]/50">
            {/* Input field */}
            <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-[#d0c6b8]/20 dark:border-[#243b2e]/20 px-4 py-4">
              <Search className="h-5 w-5 text-primary mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Search sustainable products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50 font-medium"
              />
              <button 
                type="button" 
                onClick={() => setIsSpotlightOpen(false)}
                className="text-[9px] bg-muted/40 hover:bg-muted text-muted-foreground font-bold px-2 py-1 rounded border border-border/30 cursor-pointer"
              >
                ESC
              </button>
            </form>
            
            {/* Recommendations / History */}
            <div className="overflow-y-auto p-4 space-y-5 text-xs text-left">
              {/* Recent Searches */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-[#6a7b6e] uppercase tracking-wider">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {["Bamboo Toothbrush", "Organic Cotton Shirt", "Solar Power Bank", "Recycled Paper Notebook"].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSuggestionClick(item)}
                      className="px-3 py-1.5 bg-muted/30 hover:bg-muted/70 text-foreground rounded-full border border-border/30 transition-all text-[11px] font-medium cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Popular Categories */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-[#6a7b6e] uppercase tracking-wider">Popular Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Zero-Waste Living", slug: "zero-waste-living" },
                    { name: "Organic Apparel", slug: "organic-apparel" },
                    { name: "Eco Home Goods", slug: "eco-home-goods" },
                    { name: "Renewable Energy", slug: "renewable-energy" }
                  ].map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        router.push(`/marketplace?category=${cat.slug}`);
                        setIsSpotlightOpen(false);
                      }}
                      className="flex items-center space-x-2 p-2 hover:bg-muted/40 rounded-xl transition-all border border-transparent hover:border-border/20 text-[11px] font-medium text-foreground text-left cursor-pointer"
                    >
                      <span className="text-emerald-500">🌱</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* AI Search Suggestions */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-[#6a7b6e] uppercase tracking-wider">AI Search Suggestions</h4>
                <div className="space-y-1">
                  {[
                    "Carbon Neutral Biodegradable packaging",
                    "GOTS organic cotton supplier India",
                    "Upcycled reclaimed wood dining tables",
                    "Plastic-free ocean compostable replacements"
                  ].map((sug) => (
                    <button
                      key={sug}
                      onClick={() => handleSuggestionClick(sug)}
                      className="w-full flex items-center justify-between p-2 hover:bg-muted/30 rounded-xl transition-all text-[11px] text-muted-foreground hover:text-foreground text-left font-medium cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-500 font-bold">✨</span>
                        <span>{sug}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground/60 italic">AI Sug</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Slide-over */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            {/* Content panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl border-l border-border/60"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
                <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <span>Shopping Cart</span>
                  {cartCount > 0 && <span className="text-xs font-medium text-muted-foreground">({cartCount} items)</span>}
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart items list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Your cart is empty</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                        Add certified sustainable products to start supporting ethical brands.
                      </p>
                    </div>
                    <Link href="/marketplace" onClick={() => setIsCartOpen(false)}>
                      <LiquidButton variant="default" size="lg">Shop Sustainable Goods</LiquidButton>
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b border-border/30 pb-4 last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-md object-cover border border-border/40"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                          <span className="text-sm font-bold ml-2">₹{item.price * item.quantity}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">by {item.sellerName}</p>
                        
                        <div className="flex items-center justify-between mt-2.5">
                          {/* Quantity selector */}
                          <div className="flex items-center space-x-1.5 border border-border/60 rounded px-1 py-0.5 bg-muted/20">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-muted rounded text-muted-foreground cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-semibold px-1 min-w-[16px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-muted rounded text-muted-foreground cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Badge variant="primary" className="text-[10px] px-1.5 py-0">
                              🌱 Score: {item.sustainabilityScore}
                            </Badge>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-500/5 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout details footer */}
              {cart.length > 0 && (
                <div className="border-t border-border/60 bg-muted/10 px-6 py-6 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Eco-Shipping (Carbon Neutral)</span>
                      <span className="text-emerald-600 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-border/30 pt-2 text-foreground">
                      <span>Grand Total</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link href="/cart" className="w-full" onClick={() => setIsCartOpen(false)}>
                      <Button variant="cool" className="w-full">
                        View Cart
                      </Button>
                    </Link>
                    <Link href="/checkout" className="w-full" onClick={() => setIsCartOpen(false)}>
                      <LiquidButton variant="default" size="lg" className="w-full text-center flex justify-center">
                        Checkout
                      </LiquidButton>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
