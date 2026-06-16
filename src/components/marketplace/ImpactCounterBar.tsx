"use client";

import React, { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  isDecimal?: boolean;
  suffix?: string;
  prefix?: string;
}

function CountUp({ value, isDecimal = false, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = progress * value;
      
      setCount(isDecimal ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isDecimal, hasStarted]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}
      {isDecimal ? count.toFixed(1) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ImpactCounterBar() {
  return (
    <div className="w-full bg-[#0F6E56] text-white py-4 px-4 shadow-inner border-y border-[#0c5845]/30">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="space-y-0.5">
          <span className="text-xl md:text-2xl block">🌳</span>
          <div className="text-lg sm:text-xl md:text-2xl font-black">
            <CountUp value={12400} suffix="+" />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">Trees Saved</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-xl md:text-2xl block">♻️</span>
          <div className="text-lg sm:text-xl md:text-2xl font-black">
            <CountUp value={38.2} isDecimal suffix=" Tons" />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">Carbon Offset</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-xl md:text-2xl block">💧</span>
          <div className="text-lg sm:text-xl md:text-2xl font-black">
            <CountUp value={1.4} isDecimal suffix="M Liters" />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">Water Conserved</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-xl md:text-2xl block">🏢</span>
          <div className="text-lg sm:text-xl md:text-2xl font-black">
            <CountUp value={282} suffix="+" />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">Verified Sellers</p>
        </div>
      </div>
    </div>
  );
}
