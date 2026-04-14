"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Variant = "fade-up" | "fade-in" | "fade-left" | "fade-right";

type Props = {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  /** Viewport amount visible before triggering (0-1) */
  threshold?: number;
};

const VARIANTS: Record<Variant, { hidden: Record<string, number>; visible: Record<string, number> }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
};

export default function AnimateOnScroll({
  children,
  variant = "fade-up",
  delay = 0,
  className,
  threshold = 0.15,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const v = VARIANTS[variant];
  const mobileDistance = 16;
  const hidden = isMobile
    ? {
        ...v.hidden,
        ...(v.hidden.y !== undefined ? { y: v.hidden.y > 0 ? mobileDistance : -mobileDistance } : {}),
        ...(v.hidden.x !== undefined ? { x: v.hidden.x > 0 ? mobileDistance : -mobileDistance } : {}),
      }
    : v.hidden;

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      whileInView={v.visible}
      viewport={{ once: true, amount: threshold }}
      transition={{
        duration: isMobile ? 0.4 : 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
