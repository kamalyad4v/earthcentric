"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye, Star, Leaf, ShieldCheck } from "lucide-react";
import { Badge, Button } from "@/components/ui/shared";
import { ProductItem } from "@/actions/products";

interface ProductCardProps {
  product: ProductItem;
  onAddToCart: (e: React.MouseEvent, p: ProductItem) => void;
  onQuickView: (p: ProductItem) => void;
}

export default function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check wishlist state on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.includes(product.id));
  }, [product.id]);

  // Toggle wishlist state
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let updatedWishlist = [];
    
    if (isWishlisted) {
      updatedWishlist = wishlist.filter((id: string) => id !== product.id);
      setIsWishlisted(false);
    } else {
      updatedWishlist = [...wishlist, product.id];
      setIsWishlisted(true);
    }
    
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Compute pricing details
  const originalPrice = product.price > 500 ? Math.round(product.price * 1.25) : undefined;
  const discountPercent = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : undefined;

  // Determine color for Eco Score Badge
  const ecoScore = product.sustainabilityScore;
  let scoreBadgeColorClass = "bg-gray-500 text-white";
  if (ecoScore >= 90) {
    scoreBadgeColorClass = "bg-emerald-600 text-white";
  } else if (ecoScore >= 75) {
    scoreBadgeColorClass = "bg-amber-500 text-white";
  }

  return (
    <div className="group relative bg-card border border-border/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(23,53,40,0.1),0_0_15px_rgba(34,197,94,0.08)] flex flex-col justify-between h-full cursor-pointer">
      <div>
        {/* Image Container with overlays */}
        <div className="aspect-square relative overflow-hidden bg-muted/20">
          <Image 
            src={product.images[0] || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400"} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            priority={false}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Eco Score Overlay (Top-Left) */}
          <span className={`absolute top-2 left-2 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider flex items-center gap-0.5 shadow-md z-10 ${scoreBadgeColorClass}`}>
            <Leaf className="h-2 w-2 fill-white stroke-none" />
            <span>Eco: {ecoScore}</span>
          </span>

          {/* Wishlist Heart Overlay (Top-Right) */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm border border-border/10 flex items-center justify-center text-[#173528] hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer z-10"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Discount Tag (Top-Right adjacent to Wishlist) */}
          {discountPercent && (
            <span className="absolute top-2 right-10 bg-red-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm z-10">
              {discountPercent}% OFF
            </span>
          )}

          {/* Hover Slide-up Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <Button
              onClick={(e) => onAddToCart(e, product)}
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold py-1.5 flex items-center justify-center space-x-1 border-none shadow-sm rounded-lg"
            >
              <ShoppingBag className="h-3 w-3" />
              <span>Add to Cart</span>
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 bg-white/95 text-primary border-none hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center shadow-sm"
              title="Quick View"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-2 text-left">
          {/* Seller / Trust Micro-Badge */}
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-accent uppercase tracking-wider flex items-center truncate">
              <span className="truncate mr-1">{product.seller.companyName}</span>
              {product.seller.badges?.includes("Verified Business") && (
                <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
              )}
            </p>
            <div className="flex items-center text-[7px] font-extrabold text-emerald-700 uppercase tracking-widest leading-none">
              <span>Verified Sustainable</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h4 className="text-xs font-bold text-primary line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {product.name}
            </h4>
          </Link>

          {/* Stars & Reviews */}
          <div className="flex items-center space-x-0.5 text-[10px] text-amber-500 font-semibold leading-none">
            <Star className="h-3 w-3 fill-amber-500 stroke-none" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground text-[8px] font-medium ml-0.5">({product.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Footer / Pricing details */}
      <div className="p-4 pt-0 text-left flex items-baseline space-x-2 border-t border-border/10 mt-1">
        <span className="text-sm font-black text-primary">₹{product.price.toLocaleString()}</span>
        {originalPrice && (
          <span className="text-[10px] font-semibold text-muted-foreground line-through">
            ₹{originalPrice.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
