
"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Badge, LiquidButton, MetalButton } from "@/components/ui/shared";
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleHover } from "@/components/FramerComponents";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ShieldCheck, Award, Leaf, ArrowRight, ArrowUpRight, Zap, RefreshCw, Heart } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";
import ScrollGlobe from "@/components/ui/scroll-globe";

const CATEGORIES = [
  {
    id: "organic-apparel",
    name: "Organic Apparel",
    description: "GOTS-certified garments made from natural flax, hemp, and pesticide-free cotton.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    badge: "Circular Design",
  },
  {
    id: "zero-waste-living",
    name: "Zero-Waste Living",
    description: "Daily lifestyle essentials designed to eliminate single-use plastics completely.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    badge: "Biodegradable",
  },
  {
    id: "renewable-energy",
    name: "Renewable Energy",
    description: "High-efficiency solar devices, power banks, and grid-independent outdoor accessories.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    badge: "Net Zero",
  },
  {
    id: "eco-home-goods",
    name: "Eco Home Goods",
    description: "Furniture and tableware repurposed from architectural waste and reclaimed timber.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
    badge: "Upcycled",
  },
];

const highlightsCards = [
  {
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
    title: "Rigorous 5-Step Verification",
    description: "Every supplier submits official PAN, GST, and third-party sustainability audits before catalog access.",
    date: "Verified Supplier Profile",
    className:
      "[grid-area:stack] hover:-translate-y-24 hover:z-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Leaf className="h-5 w-5 text-primary" />,
    title: "Carbon-Neutral Delivery",
    description: "We compute shipment carbon footprint and offset 100% of emissions through certified forestry initiatives.",
    date: "100% Carbon Offset",
    className:
      "[grid-area:stack] translate-x-12 translate-y-8 hover:-translate-y-16 hover:z-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <RefreshCw className="h-5 w-5 text-primary" />,
    title: "Circular Sourcing",
    description: "All products contain clear material transparency indexes promoting end-of-life upcyclability.",
    date: "High Upcyclability Index",
    className:
      "[grid-area:stack] translate-x-24 translate-y-16 hover:-translate-y-8 hover:z-30",
  },
];

export default function Homepage() {
  const sections = [
    {
      id: "hero",
      badge: "Home",
      content: (
        <section className="relative overflow-hidden bg-gradient-to-b from-accent/10 to-transparent py-12 md:py-20">
          <ContainerScroll
            titleComponent={
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-1.5 rounded-full bg-accent/20 border border-accent/30 px-3 py-1 text-xs font-semibold text-primary">
                  <Award className="h-3.5 w-3.5" />
                  <span>The Premier Ethical Marketplace</span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight sm:text-6xl text-primary leading-tight">
                  Sustainable Products. <br />
                  <span className="text-secondary">Verified Suppliers.</span> Trusted Marketplace.
                </h1>

                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  EarthCentric connects conscious buyers with verified sustainable businesses, manufacturers, and carbon-neutral suppliers.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/marketplace">
                    <LiquidButton size="lg" className="w-full sm:w-auto flex items-center space-x-2">
                      <span>Explore Marketplace</span>
                      <ArrowRight className="h-4 w-4" />
                    </LiquidButton>
                  </Link>
                  <Link href="/seller/verification">
                    <Button size="lg" variant="cool" className="w-full sm:w-auto">
                      Become a Seller
                    </Button>
                  </Link>
                </div>
              </div>
            }
          >
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1400&auto=format&fit=crop&q=80"
              alt="EarthCentric Marketplace Preview"
              className="mx-auto rounded-2xl object-cover h-full w-full object-center"
              draggable={false}
            />
          </ContainerScroll>
        </section>
      )
    },
    {
      id: "credentials",
      badge: "Credentials",
      content: (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-36">
          <FadeInStagger className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeInStaggerItem>
              <div className="flex flex-col justify-center space-y-6 max-w-xl">
                <div className="inline-flex items-center space-x-1.5 rounded-full bg-accent/20 border border-accent/30 px-3 py-1 text-xs font-semibold text-primary w-fit">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Our Credentials</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl leading-tight">
                  Uncompromising Trust &amp; Sourcing Standards
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We believe greenwashing hurts our planet. EarthCentric enforces strict verification, computes shipment carbon footprint offsets, and audits material life cycles so you can trade with absolute peace of mind.
                </p>
                <div className="pt-2">
                  <Link href="/seller/verification">
                    <Button variant="cool" className="flex items-center space-x-2">
                      <span>Read Verification Guidelines</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInStaggerItem>

            <FadeInStaggerItem className="flex justify-center lg:justify-end pr-0 lg:pr-24">
              <div className="relative flex items-center justify-center min-h-[250px] md:min-h-[400px] w-full max-w-[20rem] sm:max-w-[28rem] mx-auto pt-6 pb-20 md:py-0">
                <DisplayCards cards={highlightsCards} />
              </div>
            </FadeInStaggerItem>
          </FadeInStagger>
        </section>
      )
    },
    {
      id: "categories",
      badge: "Categories",
      content: (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-36 space-y-8 md:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="primary">Curated Catalogs</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Shop by Sustainable Focus
              </h2>
            </div>
            <Link href="/marketplace" className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1">
              <span>View all products</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <FadeInStaggerItem key={cat.id}>
                <ScaleHover className="h-full">
                  <Card className="group relative h-64 sm:h-96 overflow-hidden rounded-2xl border-none">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 space-y-2 sm:space-y-3 text-white">
                      <div>
                        <Badge variant="premium" className="bg-premium text-white border-none py-0.5 px-2 text-[10px]">
                          {cat.badge}
                        </Badge>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold">{cat.name}</h3>
                      <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                        {cat.description}
                      </p>
                      <div className="pt-2">
                        <Link href={`/marketplace?category=${cat.id}`}>
                          <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-gray-100 flex items-center space-x-1.5 border-none">
                            <span>Browse Products</span>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </ScaleHover>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </section>
      )
    },
    {
      id: "verification",
      badge: "Verification",
      content: (
        <section id="how-it-works" className="w-full bg-primary py-16 md:py-24 text-white rounded-2xl md:rounded-3xl mx-auto max-w-7xl overflow-hidden px-5 sm:px-6 lg:px-12 my-8 md:my-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent/20 text-accent border-accent/20">The Trust Standard</Badge>
              <h2 className="text-2xl font-extrabold sm:text-5xl tracking-tight leading-tight">
                We vet, so you can buy with confidence.
              </h2>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                We believe greenwashing hurts our planet. That's why EarthCentric enforces an audit system on every seller profile. No brand is allowed on the catalog without submitting legal identification, GST records, and verified environmental credentials.
              </p>
              <div className="flex flex-col space-y-4 pt-2">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">1</div>
                  <span className="font-semibold text-sm">Business Identity & GST Registration Vetted</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">2</div>
                  <span className="font-semibold text-sm">Material & Sourcing Sustainability Audits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">3</div>
                  <span className="font-semibold text-sm">Dynamic Sustainability Scoring Assignment (1-100)</span>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/seller/verification">
                  <MetalButton variant="gold" className="w-full sm:w-auto">
                    Get Your Brand Verified
                  </MetalButton>
                </Link>
              </div>
            </div>

            <div className="relative h-56 sm:h-80 lg:h-full min-h-[200px] sm:min-h-[350px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80"
                alt="Nature Sustainability Gardening"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/20" />
            </div>
          </div>
        </section>
      )
    },
    {
      id: "vision-cta",
      badge: "Vision",
      content: (
        <div className="space-y-20 md:space-y-36 py-16 md:py-24">
          <section id="sustainability-mission" className="mx-auto max-w-4xl px-4 text-center space-y-6 py-8">
            <Badge variant="primary" className="text-xs">Our Pledge</Badge>
            <p className="text-xl sm:text-2xl md:text-3xl font-serif text-primary italic leading-relaxed">
              "We do not inherit the Earth from our ancestors; we borrow it from our children. EarthCentric exists to build a commerce architecture that restores balance, offering premium goods made by ethical hands."
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm font-semibold text-secondary">
              <Leaf className="h-4 w-4" />
              <span>Carbon-Neutral Operations Since Day One</span>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 bg-gradient-to-r from-accent/15 via-transparent to-accent/5 p-6 sm:p-8 md:p-16 flex flex-col items-center text-center space-y-4 sm:space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Ready to change the way you source?
              </h2>
              <p className="text-muted-foreground max-w-lg leading-relaxed text-sm sm:text-base">
                Join thousands of conscious consumers and verified suppliers shifting to carbon-neutral purchasing today.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link href="/marketplace">
                  <LiquidButton size="lg" className="w-full sm:w-auto">
                    Explore Marketplace
                  </LiquidButton>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="cool" className="w-full sm:w-auto">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </Card>
          </section>
        </div>
      )
    }
  ];

  return (
    <ScrollGlobe sections={sections} />
  );
}
