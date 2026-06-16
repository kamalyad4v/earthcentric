"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  reviewText: string;
  productBought: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Aarav Sharma",
    role: "Zero-Waste Enthusiast",
    city: "New Delhi",
    rating: 5.0,
    reviewText: "The quality of the Bamboo Cutlery Set is incredible. Durable, smooth, and easily washable. Knowing it was sourced from pesticide-free FSC certified wood makes the purchase feel even more rewarding. Highly recommend!",
    productBought: "Zero-Waste Bamboo Cutlery Set",
  },
  {
    id: "t2",
    name: "Priyanka Patel",
    role: "Eco-Conscious Buyer",
    city: "Mumbai",
    rating: 4.9,
    reviewText: "Ordered three GOTS organic cotton shirts. They are super soft, breathe wonderfully, and survived multiple machine washes with zero shrinkage. Zero greenwashing here—actual certifications are fully visible.",
    productBought: "Organic Raw Cotton Shirt",
  },
  {
    id: "t3",
    name: "Karthik Srinivasan",
    role: "Sustainability Auditor",
    city: "Chennai",
    rating: 4.8,
    reviewText: "I audited the solar lantern specs, and they conform strictly to RoHS standards with premium lithium iron phosphate batteries. The platform's verification dashboard works perfectly, saving me time on compliance.",
    productBought: "Solar Powered Utility Lamp",
  },
  {
    id: "t4",
    name: "Neha Deshmukh",
    role: "Green Lifestyle Blogger",
    city: "Pune",
    rating: 5.0,
    reviewText: "EarthCentric makes circular shopping incredibly simple. The ocean plastic sunglasses are lightweight, stylish, and have a unique serial number tracking the cleaning project. A masterclass in marketplace transparency.",
    productBought: "Recycled Ocean Plastic Sunglasses",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-16 md:py-24 border-t border-border/40 bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F6E56] bg-[#0F6E56]/10 px-3 py-1 rounded-full">
            Buyer Voices
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
            Verified Customer Reviews
          </h2>
          <p className="text-sm text-muted-foreground">
            Real feedback from verified buyers validating our ethical sourcing and product quality parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {TESTIMONIALS.map((t) => {
            const initials = t.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={t.id}
                className="bg-card border border-border/40 border-l-4 border-l-[#0F6E56] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all duration-300 text-left"
              >
                <div className="space-y-4">
                  {/* Rating + Purchase Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => {
                        const starVal = i + 1;
                        const fillClass = starVal <= Math.ceil(t.rating) ? "fill-amber-400 stroke-amber-400" : "stroke-muted-foreground/30";
                        return (
                          <Star key={i} className={`h-4 w-4 ${fillClass}`} />
                        );
                      })}
                      <span className="text-xs font-bold text-foreground ml-1">{t.rating.toFixed(1)}</span>
                    </div>
                    <span className="inline-flex items-center space-x-1 bg-emerald-600/10 text-emerald-700 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                      <CheckCircle className="h-2.5 w-2.5" />
                      <span>Verified Purchase</span>
                    </span>
                  </div>

                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    "{t.reviewText}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#d0c6b8]/20">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-600/20 shrink-0">
                      {initials}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-primary leading-tight">{t.name}</h4>
                      <p className="text-[9px] text-muted-foreground">{t.role} ({t.city})</p>
                    </div>
                  </div>
                  <div className="text-right max-w-[160px] sm:max-w-none">
                    <span className="text-[8px] font-bold text-accent uppercase tracking-wider block">Purchased:</span>
                    <span className="text-[10px] font-bold text-primary truncate block max-w-[150px] sm:max-w-none">{t.productBought}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
