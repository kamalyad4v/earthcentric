"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button, Card, Badge, Input, Textarea, LiquidButton, MetalButton } from "@/components/ui/shared";
import { FadeIn, ScaleHover } from "@/components/FramerComponents";
import { ProductItem, getProducts } from "@/actions/products";
import {
  Star,
  Leaf,
  CheckCircle2,
  Award,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ProductClientViewProps {
  product: ProductItem;
}

export default function ProductClientView({ product }: ProductClientViewProps) {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("sustainability");
  const [related, setRelated] = useState<ProductItem[]>([]);
  const [addedNotify, setAddedNotify] = useState(false);

  // Review Form state
  const [reviews, setReviews] = useState([
    {
      id: "r1",
      userName: "Siddharth K.",
      rating: 5,
      comment: "Absolutely top notch fabric. The hemp canvas is highly durable yet soft. The packaging was completely plastic-free and shipped inside a reusable bag.",
      date: "2026-05-12",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "r2",
      userName: "Maria D.",
      rating: 4,
      comment: "Excellent design philosophy. The sustainability details really show. Only docked one star because shipping took two days longer, but worth the carbon-neutral wait.",
      date: "2026-05-24",
    },
  ]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewImage, setNewReviewImage] = useState<string | null>(null);

  // Fetch related products
  useEffect(() => {
    const loadRelated = async () => {
      const all = await getProducts({ category: product.category });
      setRelated(all.filter((p) => p.id !== product.id).slice(0, 3));
    };
    loadRelated();
  }, [product.category, product.id]);

  const handleAddToCart = (directCheckout = false) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      sustainabilityScore: product.sustainabilityScore,
      sellerName: product.seller.companyName,
      sellerId: product.sellerId,
    }, quantity);

    if (directCheckout) return;

    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;

    const newRev = {
      id: `r-new-${Date.now()}`,
      userName: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split("T")[0],
      image: newReviewImage || undefined,
    };

    setReviews([newRev, ...reviews]);
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
    setNewReviewImage(null);
  };

  const triggerMockReviewImageUpload = () => {
    // Generate a mock attachment image
    setNewReviewImage("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Toast Notification */}
      {addedNotify && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-primary text-primary-foreground border border-primary/20 px-4 py-3 shadow-lg flex items-center space-x-2 animate-bounce">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-xs font-semibold">Added {quantity} item(s) to Cart!</span>
        </div>
      )}

      {/* Back Button */}
      <Link href="/marketplace" className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Marketplace Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: Gallery Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video sm:aspect-square overflow-hidden rounded-2xl border border-border/40 bg-muted">
            <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
            <div className="absolute top-4 left-4">
              <Badge variant="premium" className="bg-emerald-600 text-white border-none py-1 px-3 text-xs font-bold flex items-center space-x-1 shadow-md">
                <Leaf className="h-3.5 w-3.5 fill-white stroke-none" />
                <span>Eco Score: {product.sustainabilityScore}/100</span>
              </Badge>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                    activeImage === img ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Selection Specifications */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="primary" className="text-xs">
                {product.category}
              </Badge>
              {product.stock > 0 ? (
                <Badge variant="success" className="text-xs">
                  In Stock ({product.stock} items)
                </Badge>
              ) : (
                <Badge variant="danger" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-primary leading-tight">
              {product.name}
            </h1>

            {/* Seller profile reference */}
            <div className="flex items-center space-x-2 border-b border-border/30 pb-4">
              <span className="text-xs text-muted-foreground">Supplied by:</span>
              <span className="text-xs font-bold text-primary flex items-center space-x-1">
                <span>{product.seller.companyName}</span>
                {product.seller.badges.includes("Verified Business") && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600/10" />
                )}
              </span>
              <div className="flex space-x-1">
                {product.seller.badges.slice(0, 1).map((b, i) => (
                  <Badge key={i} variant="premium" className="text-[9px] py-0 px-1.5 border-premium/30 bg-premium/5">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Premium Circular Price</p>
            <div className="flex items-baseline flex-wrap gap-2">
              <span className="text-3xl font-extrabold text-foreground">₹{product.price}</span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                100% Carbon-Neutral Shipping included
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Checkout Controls */}
          {product.stock > 0 && (
            <div className="border-y border-border/40 py-6 space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-border/60 rounded-md bg-muted/20 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-muted rounded text-muted-foreground cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold min-w-[24px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button size="lg" variant="cool" className="w-full" onClick={() => handleAddToCart(false)}>
                  Add to Cart
                </Button>
                <Link href="/checkout" className="w-full">
                  <LiquidButton size="lg" className="w-full justify-center text-center" onClick={() => handleAddToCart(true)}>
                    Buy Now
                  </LiquidButton>
                </Link>
              </div>
            </div>
          )}

          {/* Apple/Patagonia reassurance pointers */}
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <span>Carbon neutral logistics</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Authenticity Audited</span>
            </div>
          </div>
        </div>
      </div>

      {/* MID PAGE TABS (APPLE/STRIPE ALIGNMENT) */}
      <section className="border-t border-border/40 pt-10">
        <div className="flex space-x-4 sm:space-x-8 border-b border-border/30 pb-3 overflow-x-auto">
          {[
            { id: "sustainability", label: "Sustainability & Specs" },
            { id: "seller", label: "Supplier Profile" },
            { id: "reviews", label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-semibold pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {/* TAB 1: SUSTAINABILITY & SPECS */}
          {activeTab === "sustainability" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-primary">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-lg">Environmental Impact Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.sustainabilityDetail || "This product meets high eco-friendly manufacturing criteria, minimizing global footprint by utilizing non-toxic, locally-sourced materials."}
                </p>

                {/* Score breakdown metrics list */}
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Raw Materials Sourcing</span>
                      <span className="text-emerald-600">92%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Manufacturing Carbon Footprint</span>
                      <span className="text-emerald-600">85%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Circular Design / Recyclability</span>
                      <span className="text-emerald-600">95%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-muted/15 border border-border/40 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Product Specifications</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-border/20 pb-2">
                    <span className="text-muted-foreground">Certified Sourcing</span>
                    <span className="font-semibold">{product.certifications.join(", ") || "GOTS Organic Cotton"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/20 pb-2">
                    <span className="text-muted-foreground">Origin</span>
                    <span className="font-semibold">Ethically spun in India</span>
                  </div>
                  <div className="flex justify-between border-b border-border/20 pb-2">
                    <span className="text-muted-foreground">Dyes Used</span>
                    <span className="font-semibold">100% natural, non-toxic plant pigments</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-muted-foreground">End of Life</span>
                    <span className="font-semibold text-emerald-600">100% Biodegradable & Compostable</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPPLIER PROFILE */}
          {activeTab === "seller" && (
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full border border-border bg-muted flex items-center justify-center text-primary text-xl font-bold">
                  {product.seller.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary flex items-center space-x-1.5">
                    <span>{product.seller.companyName}</span>
                    {product.seller.badges.includes("Verified Business") && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-600/5 shrink-0" />
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.seller.badges.map((badge, idx) => (
                      <Badge key={idx} variant="premium" className="text-[10px] px-2 py-0.5">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                EcoThreads Apparel is a pioneering manufacturer dedicated to raw fiber sourcing. Operating out of zero-waste textile mills, they guarantee ethical wages, environmental safety, and transparent supply lines.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
                <div className="border border-border/40 p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Seller Rating</span>
                  <span className="text-lg font-bold text-foreground">4.9 / 5.0</span>
                </div>
                <div className="border border-border/40 p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Audit Status</span>
                  <span className="text-lg font-bold text-emerald-600">PASSED</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Reviews List */}
              <div className="lg:col-span-7 space-y-6">
                <h4 className="font-bold text-base text-primary">Buyer Experiences</h4>
                <div className="space-y-6">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-border/20 pb-5 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold">{rev.userName}</p>
                          <div className="flex space-x-0.5 mt-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < rev.rating ? "fill-amber-500 stroke-none" : "text-muted/60"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{rev.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        {rev.comment}
                      </p>
                      {rev.image && (
                        <div className="mt-3">
                          <img
                            src={rev.image}
                            alt="review upload"
                            className="h-20 w-20 object-cover rounded-md border border-border"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Input Form */}
              <div className="lg:col-span-5 bg-muted/15 border border-border/40 rounded-2xl p-6 space-y-4 h-fit">
                <div className="flex items-center space-x-1.5 text-primary">
                  <Sparkles className="h-4.5 w-4.5" />
                  <h4 className="font-bold text-sm uppercase tracking-wider">Leave a Review</h4>
                </div>
                
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Your Name</span>
                    <Input
                      placeholder="e.g. Liam Smith"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      required
                      className="text-xs bg-background"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Rating</span>
                    <div className="flex space-x-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNewReviewRating(val)}
                          className="focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              val <= newReviewRating ? "fill-amber-500 stroke-none" : "text-muted"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Comment</span>
                    <Textarea
                      placeholder="Detail your experience with this sustainable product..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      required
                      className="text-xs bg-background min-h-[80px]"
                    />
                  </div>

                  {/* Attachment image simulation */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Attach Image</span>
                    {newReviewImage ? (
                      <div className="flex items-center space-x-2">
                        <img
                          src={newReviewImage}
                          alt="preview"
                          className="h-12 w-12 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => setNewReviewImage(null)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="cool"
                        size="sm"
                        onClick={triggerMockReviewImageUpload}
                        className="text-xs"
                      >
                        Simulate Image Attachment
                      </Button>
                    )}
                  </div>

                  <Button type="submit" variant="cool" className="w-full text-xs">
                    Submit Review
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section className="border-t border-border/40 pt-12 space-y-6">
          <h3 className="text-xl font-bold text-primary">Related Sustainable Goods</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link href={`/products/${item.id}`} key={item.id}>
                <ScaleHover>
                  <Card className="border-border/40 bg-card overflow-hidden">
                    <div className="h-40 bg-muted overflow-hidden relative">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                      <Badge variant="primary" className="absolute top-2.5 left-2.5 text-[9px] border-none bg-primary/95 text-white">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="font-bold text-xs truncate">{item.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold">₹{item.price}</span>
                        <div className="flex items-center space-x-0.5 text-[10px] text-amber-500 font-semibold">
                          <Star className="h-3 w-3 fill-amber-500 stroke-none" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScaleHover>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
