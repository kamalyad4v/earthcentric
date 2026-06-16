"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

export function DisplayCard({
  className,
  icon = <Sparkles className="h-4 w-4" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "",
  titleClassName = "",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 sm:h-40 w-[16rem] sm:w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-border/60 bg-card/85 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[14rem] sm:after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] after:pointer-events-none hover:border-accent/60 hover:bg-card hover:shadow-lg [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn("relative inline-flex rounded-lg bg-accent/10 border border-accent/20 p-2 text-primary", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-base font-bold text-primary", titleClassName)}>{title}</p>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed pr-4">{description}</p>
      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
        <span>{date}</span>
      </div>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-24 hover:z-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-12 translate-y-8 hover:-translate-y-16 hover:z-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-24 translate-y-16 hover:-translate-y-8 hover:z-30",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
