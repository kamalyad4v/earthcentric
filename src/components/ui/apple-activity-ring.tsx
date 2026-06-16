"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/shared";

interface ActivityData {
  label: string;
  value: number;
  color: string;
  size: number;
  current: number;
  target: number;
  unit: string;
}

interface CircleProgressProps {
  data: ActivityData;
  index: number;
}

interface AppleActivityCardProps {
  revenue: number;
  ordersCount: number;
  productsCount: number;
  revenueTarget?: number;
  ordersTarget?: number;
  productsTarget?: number;
  title?: string;
  mode?: "seller" | "admin";
  className?: string;
}

const CircleProgress = ({ data, index }: CircleProgressProps) => {
  const strokeWidth = 16;
  const radius = (data.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Clamp progress percentage between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, data.value));
  const strokeDashoffset = ((100 - clampedValue) / 100) * circumference;

  const gradientId = `gradient-${data.label.toLowerCase().replace(/\s+/g, "-")}`;
  const gradientUrl = `url(#${gradientId})`;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
    >
      <div className="relative">
        <svg
          width={data.size}
          height={data.size}
          viewBox={`0 0 ${data.size} ${data.size}`}
          className="transform -rotate-90"
          aria-label={`${data.label} Activity Progress - ${data.value}%`}
        >
          <title>{`${data.label} Activity Progress - ${data.value}%`}</title>

          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: data.color,
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor:
                    data.color === "#FF2D55"
                      ? "#FF6B8B"
                      : data.color === "#A3F900"
                      ? "#C5FF4D"
                      : "#4DDFED",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>
          </defs>

          <circle
            cx={data.size / 2}
            cy={data.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-200/40 dark:text-zinc-800/40"
          />

          <motion.circle
            cx={data.size / 2}
            cy={data.size / 2}
            r={radius}
            fill="none"
            stroke={gradientUrl}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{
              duration: 1.8,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 6px rgba(0,0,0,0.15))",
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

export function AppleActivityCard({
  revenue,
  ordersCount,
  productsCount,
  revenueTarget,
  ordersTarget,
  productsTarget,
  title,
  mode = "seller",
  className,
}: AppleActivityCardProps) {
  
  // Set default targets depending on the mode
  const defaultRevTarget = revenueTarget !== undefined ? revenueTarget : (mode === "admin" ? 500000 : 250000);
  const defaultOrdersTarget = ordersTarget !== undefined ? ordersTarget : (mode === "admin" ? 10 : 50); // represents Brands count in admin mode
  const defaultProductsTarget = productsTarget !== undefined ? productsTarget : (mode === "admin" ? 50 : 10); // represents items count in admin mode

  const actualTitle = title || (mode === "admin" ? "Platform Activity Rings" : "Performance Activity Rings");

  const activities: ActivityData[] = [
    {
      label: mode === "admin" ? "PLATFORM GMV" : "REVENUE TARGET",
      value: defaultRevTarget > 0 ? Math.round((revenue / defaultRevTarget) * 100) : 0,
      color: "#FF2D55",
      size: 200,
      current: revenue,
      target: defaultRevTarget,
      unit: "INR",
    },
    {
      label: mode === "admin" ? "ACTIVE PARTNERS" : "TOTAL SALES GOAL",
      value: defaultOrdersTarget > 0 ? Math.round((ordersCount / defaultOrdersTarget) * 100) : 0,
      color: "#A3F900",
      size: 160,
      current: ordersCount,
      target: defaultOrdersTarget,
      unit: mode === "admin" ? "Brands" : "Orders",
    },
    {
      label: mode === "admin" ? "PLATFORM CATALOG" : "CATALOG DEPLOYMENT",
      value: defaultProductsTarget > 0 ? Math.round((productsCount / defaultProductsTarget) * 100) : 0,
      color: "#04C7DD",
      size: 120,
      current: productsCount,
      target: defaultProductsTarget,
      unit: mode === "admin" ? "Items" : "Listings",
    },
  ];

  return (
    <div
      className={cn(
        "relative w-full border border-border/40 bg-card rounded-2xl p-6",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row items-center justify-around gap-6">
        <div className="flex flex-col gap-1.5 text-center lg:text-left select-none">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
            {mode === "admin" ? "Platform Metrics Monitor" : "Storefront Metrics Overview"}
          </span>
          <h2 className="text-xl font-bold text-primary dark:text-foreground">
            {actualTitle}
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs mt-1 leading-relaxed">
            {mode === "admin" 
              ? "Concentric activity rings visualize real-time progress toward platform-wide goals." 
              : "Concentric activity rings visualize real-time progress toward your monthly storefront goals."
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-12 w-full lg:w-auto justify-center">
          {/* Rings Container */}
          <div className="relative w-[210px] h-[210px] flex items-center justify-center shrink-0">
            {activities.map((activity, index) => (
              <CircleProgress
                key={activity.label}
                data={activity}
                index={index}
              />
            ))}
          </div>

          {/* Legend / Detailed breakdown */}
          <motion.div
            className="flex flex-col gap-5 select-none text-left"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {activities.map((activity) => (
              <div key={activity.label} className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {activity.label}
                </span>
                <span
                  className="text-lg font-black mt-0.5 flex items-baseline gap-1"
                  style={{ color: activity.color }}
                >
                  {activity.unit === "INR" ? "₹" : ""}{activity.current.toLocaleString()}
                  <span className="text-xs text-muted-foreground font-semibold">
                    / {activity.unit === "INR" ? "₹" : ""}{activity.target.toLocaleString()}{" "}
                    {activity.unit === "INR" ? "" : activity.unit}
                  </span>
                  <Badge variant="outline" className="ml-2 font-mono text-[9px] px-1 py-0 border-none bg-muted/40 text-muted-foreground">
                    {activity.value}%
                  </Badge>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
