"use client";

import React, { useState, useEffect, startTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProducts, ProductItem, ProductFilter } from "@/actions/products";
import { useCart } from "@/context/CartContext";
import { Button, Card, Badge, Input } from "@/components/ui/shared";
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleHover } from "@/components/FramerComponents";
import {
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  ChevronDown,
  ShoppingBag,
  Leaf,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
} from "lucide-react";

const CATEGORIES_SLUGS = [
  { id: "all", name: "All Products" },
  { id: "organic-apparel", name: "Organic Apparel" },
  { id: "zero-waste-living", name: "Zero-Waste Living" },
  { id: "renewable-energy", name: "Renewable Energy" },
  { id: "eco-home-goods", name: "Eco Home Goods" },
];

const CAROUSEL_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&auto=format&fit=crop&q=80",
    title: "ECO HOME SHOPPING SPREE",
    tagline: "Starting from ₹99 | Extra up to ₹150 Cashback on verified sustainable brands",
    buttonText: "Shop Deals",
    category: "eco-home-goods"
  },
  {
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=80",
    title: "REVAMP YOUR WARDROBE",
    tagline: "Up to 30% Off GOTS-certified Organic Apparel & Hemp clothing",
    buttonText: "Explore Apparel",
    category: "organic-apparel"
  },
  {
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&auto=format&fit=crop&q=80",
    title: "DEALS ON HOME ESSENTIALS",
    tagline: "Zero-waste living made easy | Biodegradable Moso Bamboo starting at ₹49",
    buttonText: "Browse Zero-Waste",
    category: "zero-waste-living"
  }
];

const GRID_CARDS = [
  {
    title: "Organic Apparel & Linen | Up to 30% off",
    category: "organic-apparel",
    items: [
      { name: "Organic Hemp Tee", slug: "organic-hemp-tee", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80", price: "₹1,899" },
      { name: "Linen Lounge Pants", slug: "linen-lounge-pants", image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=400&q=80", price: "₹2,499" },
      { name: "Organic Cotton Tee", slug: "organic-cotton-classic-tee", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80", price: "₹1,899" },
      { name: "Minimalist Backpack", slug: "minimalist-hemp-backpack", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", price: "₹4,999" }
    ],
    linkText: "Shop Organic Apparel"
  },
  {
    title: "Zero-Waste Living | Deals from ₹49",
    category: "zero-waste-living",
    items: [
      { name: "Bamboo Cutlery", slug: "zero-waste-bamboo-cutlery", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80", price: "₹699" },
      { name: "Upcycled Tote", slug: "zero-waste-cotton-tote", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80", price: "₹499" },
      { name: "Glass Water Bottle", slug: "upcycled-glass-bottle", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80", price: "₹1,299" },
      { name: "Eco Straws & Kits", slug: "zero-waste-bamboo-cutlery", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80", price: "₹699" }
    ],
    linkText: "Browse Zero-Waste Shop"
  },
  {
    title: "Renewable Energy | Solar Chargers",
    category: "renewable-energy",
    items: [
      { name: "Solar Chargers", slug: "solar-portable-charger", image: "/images/solar-chargers.png", price: "₹3,499" },
      { name: "Solar Power Bank", slug: "solar-portable-charger", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80", price: "₹3,499" },
      { name: "Solar Lanterns", slug: "solar-portable-charger", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80", price: "Starting ₹99" },
      { name: "Outdoor Solar Gear", slug: "solar-portable-charger", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80", price: "Up to 20% off" }
    ],
    linkText: "Explore Renewable Energy"
  },
  {
    title: "Eco Home Goods | Upcycled Wood",
    category: "eco-home-goods",
    items: [
      { name: "Cooling Sheets", slug: "bamboo-cooling-sheets", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80", price: "₹3,499" },
      { name: "Duvet Cover", slug: "tencel-duvet-cover", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80", price: "₹4,999" },
      { name: "Hemp Bath Towels", slug: "hemp-bath-towels", image: "/images/hemp-bath-towels.png", price: "₹1,299" },
      { name: "Wood Board", slug: "solid-oak-cutting-board", image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&q=80", price: "₹2,799" }
    ],
    linkText: "Shop Eco Home Goods"
  }
];

function MarketplaceCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  // Filter States
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [minScore, setMinScore] = useState(50);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(6000);
  const [sortBy, setSortBy] = useState<ProductFilter["sortBy"]>("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Custom Storefront state
  const [showCatalogExplicitly, setShowCatalogExplicitly] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Cart Actions
  const { addToCart } = useCart();
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  // Sync category and search states with search query URL params on load/change
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategory(cat);
      setShowCatalogExplicitly(true);
    }
    const q = searchParams.get("search");
    if (q !== null) {
      setSearch(q);
      setShowCatalogExplicitly(true);
    }
  }, [searchParams]);

  // Load products based on filters
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const filters: ProductFilter = {
        search: search || undefined,
        category: category !== "all" ? category : undefined,
        minSustainabilityScore: minScore,
        verifiedOnly: verifiedOnly,
        priceRange: [0, priceMax],
        sortBy: sortBy,
      };

      try {
        const result = await getProducts(filters);
        // Using startTransition to avoid locking up inputs during rendering
        startTransition(() => {
          setProducts(result);
          setLoading(false);
        });
      } catch (e) {
        console.error("Failed to load products", e);
        setLoading(false);
      }
    };

    const timer = setTimeout(loadProducts, 300); // Debouncing queries
    return () => clearTimeout(timer);
  }, [search, category, minScore, verifiedOnly, priceMax, sortBy]);

  // Carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const handleAddToCart = (e: React.MouseEvent, p: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.images[0] || "",
      sustainabilityScore: p.sustainabilityScore,
      sellerName: p.seller.companyName,
      sellerId: p.sellerId,
    }, 1);

    setAddedItemName(p.name);
    setTimeout(() => setAddedItemName(null), 2000);
  };

  const showStorefront = !showCatalogExplicitly && category === "all" && search === "";

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Toast Notification for Cart */}
      {addedItemName && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-primary text-primary-foreground border border-primary/20 px-4 py-3 shadow-lg flex items-center space-x-2 animate-bounce">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-xs font-semibold">Added "{addedItemName}" to Cart!</span>
        </div>
      )}

      {/* Sub-Navbar (Amazon style category bar) */}
      <div className="w-full bg-slate-900 text-slate-200 border-t border-slate-800 text-xs px-4 md:px-8 py-2.5 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none shadow-md">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => {
              setCategory("all");
              setSearch("");
              setShowCatalogExplicitly(true);
            }}
            className="hover:text-emerald-400 font-medium transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>All Products</span>
          </button>
          <button 
            onClick={() => {
              setCategory("all");
              setSearch("");
              setShowCatalogExplicitly(false);
            }}
            className="hover:text-emerald-400 font-medium transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>Storefront Home</span>
          </button>
          <button 
            onClick={() => {
              setCategory("all");
              setSortBy("popular");
              setShowCatalogExplicitly(true);
            }}
            className="hover:text-emerald-400 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Star className="h-3 w-3 fill-amber-500 stroke-none" />
            <span>Best Sellers</span>
          </button>
          <button 
            onClick={() => {
              setCategory("organic-apparel");
              setSearch("");
              setShowCatalogExplicitly(true);
            }}
            className={`hover:text-emerald-400 transition-colors cursor-pointer ${category === "organic-apparel" ? "text-emerald-400 font-semibold" : ""}`}
          >
            Organic Apparel
          </button>
          <button 
            onClick={() => {
              setCategory("zero-waste-living");
              setSearch("");
              setShowCatalogExplicitly(true);
            }}
            className={`hover:text-emerald-400 transition-colors cursor-pointer ${category === "zero-waste-living" ? "text-emerald-400 font-semibold" : ""}`}
          >
            Zero-Waste Living
          </button>
          <button 
            onClick={() => {
              setCategory("renewable-energy");
              setSearch("");
              setShowCatalogExplicitly(true);
            }}
            className={`hover:text-emerald-400 transition-colors cursor-pointer ${category === "renewable-energy" ? "text-emerald-400 font-semibold" : ""}`}
          >
            Renewable Energy
          </button>
          <button 
            onClick={() => {
              setCategory("eco-home-goods");
              setSearch("");
              setShowCatalogExplicitly(true);
            }}
            className={`hover:text-emerald-400 transition-colors cursor-pointer ${category === "eco-home-goods" ? "text-emerald-400 font-semibold" : ""}`}
          >
            Eco Home Goods
          </button>
          <button 
            onClick={() => {
              setVerifiedOnly(prev => !prev);
              setShowCatalogExplicitly(true);
            }}
            className={`hover:text-emerald-400 transition-colors flex items-center space-x-1 cursor-pointer ${verifiedOnly ? "text-emerald-400 font-semibold" : ""}`}
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>Verified Brands</span>
          </button>
        </div>
        <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400">
          <Leaf className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
          <span>100% Carbon-Neutral Shipments</span>
        </div>
      </div>

      {showStorefront ? (
        <div className="space-y-10 pb-16">
          {/* Hero Carousel */}
          <div className="relative h-[280px] sm:h-[360px] md:h-[440px] w-full overflow-hidden bg-slate-950">
            {/* Slide Container */}
            <div className="relative h-full w-full">
              {CAROUSEL_SLIDES.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  {/* Slide Image */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover opacity-60"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-black/45" />
                  
                  {/* Banner Text Content */}
                  <div className="absolute bottom-28 sm:bottom-32 md:bottom-40 left-4 md:left-12 max-w-xl text-white space-y-2 md:space-y-3">
                    <span className="inline-block bg-emerald-600 text-[10px] md:text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                      Verified Sustainable
                    </span>
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md leading-tight text-white">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 drop-shadow-sm font-medium">
                      {slide.tagline}
                    </p>
                    <div className="pt-1">
                      <Button
                        variant="cool"
                        size="sm"
                        onClick={() => {
                          setCategory(slide.category);
                          setShowCatalogExplicitly(true);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-1.5 px-3.5 shadow-sm"
                      >
                        {slide.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Navigation Controls */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Slide Index Indicators */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    idx === currentSlide ? "bg-emerald-500 w-3" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Layered Category Cards Grid */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 md:-mt-32 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {GRID_CARDS.map((card, cardIdx) => (
                <Card 
                  key={cardIdx} 
                  className="bg-card border border-border/40 p-5 rounded-2xl shadow-lg flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow duration-300"
                >
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-primary tracking-tight leading-tight line-clamp-2">
                      {card.title}
                    </h3>
                    
                    {/* 2x2 Sub-items grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {card.items.map((item, itemIdx) => (
                        <Link 
                          key={itemIdx}
                          href={`/products/${item.slug}`}
                          className="flex flex-col space-y-1 group cursor-pointer"
                        >
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-emerald-600 font-semibold">
                            {item.price}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCategory(card.category);
                      setShowCatalogExplicitly(true);
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline pt-2 border-t border-border/10 text-left w-fit cursor-pointer"
                  >
                    {card.linkText}
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Horizontally Scrolling Product Shelf & Call To Actions */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Trending shelf */}
            {products.length > 0 && (
              <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/20 pb-3">
                  <h3 className="text-lg font-bold text-primary flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                    <span>Trending Sustainable Essentials</span>
                  </h3>
                  <button
                    onClick={() => {
                      setCategory("all");
                      setShowCatalogExplicitly(true);
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>See all deals</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-secondary scroll-smooth">
                  {products.map((p) => (
                    <div 
                      key={p.id} 
                      className="min-w-[200px] sm:min-w-[240px] border border-border/40 hover:border-accent/40 rounded-xl overflow-hidden bg-background/20 flex flex-col justify-between group transition-all duration-300 hover:shadow-md"
                    >
                      <Link href={`/products/${p.id}`} className="block">
                        <div className="relative h-32 bg-muted overflow-hidden">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            <span className="bg-primary/95 text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded">
                              {p.category}
                            </span>
                            <span className="bg-emerald-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                              <Leaf className="h-2 w-2 fill-white stroke-none" />
                              <span>Score: {p.sustainabilityScore}</span>
                            </span>
                          </div>
                        </div>
                        <div className="p-3.5 space-y-1">
                          <p className="text-[9px] text-muted-foreground truncate">{p.seller.companyName}</p>
                          <h4 className="font-bold text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {p.name}
                          </h4>
                          <div className="flex items-center space-x-1 text-[10px] text-amber-500">
                            <Star className="h-3 w-3 fill-amber-500 stroke-none" />
                            <span className="font-semibold">{p.rating}</span>
                            <span className="text-muted-foreground text-[8px]">({p.reviewsCount})</span>
                          </div>
                        </div>
                      </Link>
                      <div className="p-3.5 pt-0 flex items-center justify-between border-t border-border/10 mt-1">
                        <span className="font-extrabold text-sm text-foreground">₹{p.price}</span>
                        <button
                          onClick={(e) => handleAddToCart(e, p)}
                          className="h-7 px-2.5 rounded-full bg-primary text-primary-foreground hover:bg-emerald-700 text-[9px] font-bold transition-all flex items-center space-x-1 shadow-sm cursor-pointer animate-none"
                        >
                          <ShoppingBag className="h-2.5 w-2.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border/40 bg-gradient-to-r from-emerald-950 to-primary p-6 md:p-8 text-white flex flex-col justify-between min-h-[160px]">
                <div className="space-y-2 max-w-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Carbon offset pledge</span>
                  <h4 className="text-lg md:text-xl font-bold">Shop Green, Breathe Green</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We compute and offset 100% of the greenhouse gases generated by shipping. Rest assured, your purchase is completely neutral.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setCategory("all");
                    setShowCatalogExplicitly(true);
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-350 flex items-center space-x-1 mt-4 w-fit cursor-pointer"
                >
                  <span>Explore Catalog products</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="rounded-2xl border border-border/40 bg-gradient-to-r from-amber-950 to-secondary p-6 md:p-8 text-white flex flex-col justify-between min-h-[160px]">
                <div className="space-y-2 max-w-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Verified seller audit</span>
                  <h4 className="text-lg md:text-xl font-bold">Only Certified Makers</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We vet every vendor before letting them sell. Legal identity, business registrations, and sustainable materials audits are strictly mandatory.
                  </p>
                </div>
                <Link href="/seller/verification" className="text-xs font-bold text-amber-400 hover:text-amber-350 flex items-center space-x-1 mt-4 w-fit">
                  <span>Get verified as a supplier</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-2 border-b border-border/40 pb-6">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <button onClick={() => setShowCatalogExplicitly(false)} className="hover:underline hover:text-primary">Marketplace</button>
              <span>&gt;</span>
              <span className="font-semibold text-foreground">Catalog</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">Ethical Catalog</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Browse carbon-offset products supplied directly by verified sustainable creators.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center space-x-2 border-border/60"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{showMobileFilters ? 'Hide Filters' : 'Show Filters'}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* FILTER SIDEBAR (STRIPE STYLE) */}
            <div className={`lg:col-span-1 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="rounded-xl border border-border/60 bg-card p-5 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/20 pb-3">
                  <h3 className="font-bold text-sm text-primary flex items-center space-x-1.5">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                  </h3>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setMinScore(50);
                      setVerifiedOnly(false);
                      setPriceMax(6000);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                </div>

                {/* Search Input */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Search</span>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="Hemp, wood, solar..."
                      className="pl-9 text-xs"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</span>
                  <div className="space-y-1">
                    {CATEGORIES_SLUGS.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted/50 cursor-pointer ${
                          category === cat.id ? "bg-accent/15 font-semibold text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sustainability score threshold */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1">
                      <Leaf className="h-3 w-3 text-emerald-600" />
                      <span>Min Sustainability Score</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-600">{minScore}+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex items-center space-x-1.5 text-[10px] text-muted-foreground bg-muted/20 rounded p-2">
                    <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Our score measures manufacturing carbon footprint, circular materials, and fair-wage audits.</span>
                  </div>
                </div>

                {/* Verified Seller Toggle */}
                <div className="flex items-center justify-between border-t border-border/20 pt-4">
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Verified Brands Only
                    </span>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Only show products with active verification status.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                {/* Price Max slider */}
                <div className="space-y-2 border-t border-border/20 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Max Price</span>
                    <span className="text-xs font-bold">₹{priceMax}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="10000"
                    step="100"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* PRODUCT CATALOG GRID */}
            <div className="lg:col-span-3 space-y-6">
              {/* Sorting / Meta Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/15 border border-border/40 rounded-xl px-5 py-3">
                <span className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{products.length}</span> verified products
                </span>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-muted-foreground text-xs">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e: any) => setSortBy(e.target.value)}
                      className="bg-card border border-border/60 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-xs font-medium cursor-pointer"
                    >
                      <option value="newest">Newest Additions</option>
                      <option value="popular">Review Count</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Catalog grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <Card key={index} className="h-[360px] animate-pulse border border-border/40">
                      <div className="bg-muted h-48 w-full" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/60 rounded-2xl bg-card space-y-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">No sustainable products found</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[280px] leading-relaxed">
                      Try clearing some filters, widening the price range, or searching for other eco-friendly products.
                    </p>
                  </div>
                  <Button
                    variant="cool"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setMinScore(0);
                      setPriceMax(10000);
                      setVerifiedOnly(false);
                    }}
                  >
                    Reset Filter Settings
                  </Button>
                </div>
              ) : (
                <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <FadeInStaggerItem key={p.id}>
                      <Link href={`/products/${p.id}`}>
                        <ScaleHover className="h-full">
                          <Card className="h-full border border-border/40 hover:border-accent/40 bg-card overflow-hidden flex flex-col group">
                            {/* Image Panel */}
                            <div className="relative h-48 bg-muted overflow-hidden">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                              />
                              <div className="absolute top-3 left-3 flex flex-col space-y-1.5 items-start">
                                <Badge variant="primary" className="bg-primary/90 text-primary-foreground border-none text-[10px]">
                                  {p.category}
                                </Badge>
                                <Badge variant="premium" className="bg-emerald-600 text-white border-none py-0.5 px-2 text-[9px] font-bold flex items-center space-x-0.5">
                                  <Leaf className="h-2.5 w-2.5 fill-white stroke-none" />
                                  <span>Eco-Score: {p.sustainabilityScore}</span>
                                </Badge>
                              </div>
                            </div>

                            {/* Text info panel */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                              <div className="space-y-1.5">
                                {/* Seller Header */}
                                <div className="flex items-center space-x-1 text-[11px] text-muted-foreground">
                                  <span className="truncate">{p.seller.companyName}</span>
                                  {p.seller.badges.includes("Verified Business") && (
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                  )}
                                </div>
                                
                                <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                  {p.name}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                  {p.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-border/20">
                                <span className="font-extrabold text-base text-foreground">₹{p.price}</span>
                                
                                <div className="flex items-center space-x-2">
                                  {/* Rating indicator */}
                                  <div className="flex items-center space-x-0.5 text-xs text-amber-500 font-semibold pr-2 border-r border-border/40">
                                    <Star className="h-3.5 w-3.5 fill-amber-500 stroke-none" />
                                    <span>{p.rating}</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => handleAddToCart(e, p)}
                                    className="h-8 w-8 p-0 rounded-full bg-muted/20 hover:bg-primary hover:text-primary-foreground border-none shrink-0"
                                  >
                                    <ShoppingBag className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </ScaleHover>
                      </Link>
                    </FadeInStaggerItem>
                  ))}
                </FadeInStagger>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Marketplace() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl py-32 text-center text-xs text-muted-foreground animate-pulse">Loading Marketplace...</div>}>
      <MarketplaceCatalog />
    </Suspense>
  );
}
