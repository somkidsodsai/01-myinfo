"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-up" | "fade" | "scale" | "fade-right";

const variantStyles: Record<RevealVariant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-10",
    visible: "opacity-100 translate-y-0",
  },
  fade: {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  scale: {
    hidden: "opacity-0 scale-[0.96]",
    visible: "opacity-100 scale-100",
  },
  "fade-right": {
    hidden: "opacity-0 -translate-x-10",
    visible: "opacity-100 translate-x-0",
  },
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  threshold?: number;
  once?: boolean;
  style?: CSSProperties;
}

export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  threshold = 0.25,
  once = true,
  style,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once, isVisible]);

  const variantClass = variantStyles[variant] ?? variantStyles["fade-up"];

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform will-change-opacity",
        variantClass.hidden,
        isVisible && variantClass.visible,
        className,
      )}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
