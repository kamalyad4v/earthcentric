"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FadeIn = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInStagger = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-40px" }}
    variants={{
      hidden: {},
      show: {
        transition: {
          staggerChildren: 0.08,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInStaggerItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 12 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleHover = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export { AnimatePresence };
