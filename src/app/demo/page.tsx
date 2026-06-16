"use client";

import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function DemoOne() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 p-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">Liquid Glass Button</h1>
        <p className="text-sm text-muted-foreground">Premium SVG turbulence distortion filter interaction.</p>
      </div>
      <div className="relative h-[200px] w-[800px] max-w-full bg-muted/20 border border-border/40 rounded-2xl flex items-center justify-center"> 
        <LiquidButton className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          Liquid Glass
        </LiquidButton> 
      </div>
    </div>
  )
}
