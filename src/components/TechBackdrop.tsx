import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type TechBackdropVariant = "hero" | "section" | "alt" | "timeline" | "grid";

interface OrbConfig {
  style: CSSProperties;
  animation?: string;
  color?: string;
  opacity?: number;
  delay?: string;
}

interface BeamConfig {
  style: CSSProperties;
  animation?: string;
  color?: string;
}

interface FragmentConfig {
  style: CSSProperties;
  animation?: string;
}

interface VariantConfig {
  baseGradient: (color: string) => string;
  gridColor: string;
  orbs: OrbConfig[];
  beams?: BeamConfig[];
  fragments?: FragmentConfig[];
  overlayOpacity?: number;
}

const defaultColor = "rgba(159, 239, 0, 1)";

const variantConfigs: Record<TechBackdropVariant, VariantConfig> = {
  hero: {
    baseGradient: (color) =>
      `radial-gradient(circle at 18% -10%, ${color} 0%, rgba(2, 8, 23, 0) 52%),
       radial-gradient(circle at 85% 5%, rgba(72, 241, 255, 0.55) 0%, rgba(2, 8, 23, 0) 60%),
       radial-gradient(circle at 50% 100%, rgba(15, 118, 110, 0.35) 0%, rgba(2, 6, 23, 0.05) 55%, transparent 75%),
       linear-gradient(120deg, rgba(2, 6, 23, 0.92) 0%, rgba(3, 10, 25, 0.88) 45%, rgba(2, 6, 23, 0.93) 100%)`,
    gridColor: "rgba(159, 239, 0, 0.18)",
    orbs: [
      {
        style: { top: "-18%", left: "-10%", width: "30rem", height: "30rem" },
        animation: "animate-tech-orb-slow",
        opacity: 0.55,
      },
      {
        style: { top: "25%", left: "58%", width: "24rem", height: "24rem" },
        animation: "animate-tech-orb",
        opacity: 0.55,
      },
      {
        style: { bottom: "-20%", right: "-12%", width: "34rem", height: "34rem" },
        animation: "animate-tech-orb-slow",
        opacity: 0.5,
        delay: "1.5s",
      },
      {
        style: { top: "12%", right: "6%", width: "18rem", height: "18rem" },
        animation: "animate-tech-orb-fast",
        color: "rgba(56, 189, 248, 0.65)",
        opacity: 0.6,
        delay: "0.8s",
      },
    ],
    beams: [
      {
        style: {
          top: "18%",
          left: "-15%",
          width: "70%",
          height: "2px",
          transform: "rotate(8deg)",
        },
        animation: "animate-tech-glow",
      },
      {
        style: {
          bottom: "12%",
          right: "-10%",
          width: "60%",
          height: "1px",
          transform: "rotate(-6deg)",
        },
        animation: "animate-tech-glow",
        color: "rgba(59, 130, 246, 0.6)",
      },
    ],
    fragments: [
      {
        style: {
          top: "28%",
          left: "22%",
          width: "3.5rem",
          height: "3.5rem",
        },
        animation: "animate-tech-fragment",
      },
      {
        style: {
          top: "58%",
          left: "12%",
          width: "2.5rem",
          height: "2.5rem",
        },
        animation: "animate-tech-fragment",
      },
      {
        style: {
          top: "48%",
          right: "18%",
          width: "2.75rem",
          height: "2.75rem",
        },
        animation: "animate-tech-fragment",
      },
    ],
  },
  section: {
    baseGradient: (color) =>
      `radial-gradient(circle at 8% 0%, ${color} 0%, rgba(2, 8, 23, 0.05) 50%, transparent 70%),
       radial-gradient(circle at 92% 8%, rgba(72, 241, 255, 0.28) 0%, rgba(2, 8, 23, 0.02) 60%, transparent 75%),
       linear-gradient(140deg, rgba(3, 10, 25, 0.92) 0%, rgba(8, 18, 40, 0.86) 100%)`,
    gridColor: "rgba(159, 239, 0, 0.12)",
    orbs: [
      {
        style: { top: "-12%", left: "-10%", width: "22rem", height: "22rem" },
        animation: "animate-tech-orb",
        opacity: 0.5,
      },
      {
        style: { bottom: "-18%", right: "-8%", width: "26rem", height: "26rem" },
        animation: "animate-tech-orb-slow",
        opacity: 0.45,
      },
      {
        style: { top: "45%", left: "60%", width: "18rem", height: "18rem" },
        animation: "animate-tech-orb-fast",
        opacity: 0.4,
        delay: "0.6s",
        color: "rgba(56, 189, 248, 0.35)",
      },
    ],
    beams: [
      {
        style: {
          top: "20%",
          left: "10%",
          width: "40%",
          height: "1px",
          transform: "rotate(6deg)",
        },
      },
      {
        style: {
          bottom: "22%",
          left: "25%",
          width: "30%",
          height: "1px",
          transform: "rotate(-8deg)",
        },
      },
    ],
    fragments: [
      {
        style: {
          top: "35%",
          left: "18%",
          width: "2.25rem",
          height: "2.25rem",
        },
      },
      {
        style: {
          bottom: "30%",
          right: "20%",
          width: "2.5rem",
          height: "2.5rem",
        },
        animation: "animate-tech-fragment",
      },
    ],
  },
  alt: {
    baseGradient: (color) =>
      `radial-gradient(circle at 5% 30%, ${color} 0%, rgba(2, 8, 23, 0.08) 40%, transparent 70%),
       radial-gradient(circle at 90% 70%, rgba(99, 102, 241, 0.28) 0%, rgba(2, 8, 23, 0.05) 55%, transparent 75%),
       linear-gradient(180deg, rgba(2, 6, 23, 0.92) 0%, rgba(3, 12, 28, 0.88) 100%)`,
    gridColor: "rgba(159, 239, 0, 0.1)",
    orbs: [
      {
        style: { top: "-16%", right: "-8%", width: "26rem", height: "26rem" },
        animation: "animate-tech-orb",
        opacity: 0.48,
      },
      {
        style: { bottom: "-20%", left: "-10%", width: "28rem", height: "28rem" },
        animation: "animate-tech-orb-slow",
        opacity: 0.42,
      },
      {
        style: { top: "38%", left: "50%", width: "16rem", height: "16rem" },
        animation: "animate-tech-orb-fast",
        opacity: 0.5,
        color: "rgba(56, 189, 248, 0.4)",
      },
    ],
    beams: [
      {
        style: {
          top: "30%",
          right: "12%",
          width: "32%",
          height: "1px",
          transform: "rotate(9deg)",
        },
      },
    ],
  },
  timeline: {
    baseGradient: (color) =>
      `radial-gradient(circle at 50% 0%, ${color} 0%, rgba(2, 8, 23, 0.05) 45%, transparent 70%),
       radial-gradient(circle at 50% 100%, rgba(56, 189, 248, 0.32) 0%, rgba(2, 8, 23, 0.05) 55%, transparent 80%),
       linear-gradient(160deg, rgba(2, 6, 23, 0.92) 0%, rgba(3, 12, 32, 0.9) 100%)`,
    gridColor: "rgba(159, 239, 0, 0.12)",
    orbs: [
      {
        style: { top: "-10%", left: "20%", width: "20rem", height: "20rem" },
        animation: "animate-tech-orb",
        opacity: 0.48,
      },
      {
        style: { bottom: "-18%", right: "18%", width: "22rem", height: "22rem" },
        animation: "animate-tech-orb-slow",
        opacity: 0.45,
      },
      {
        style: { top: "35%", left: "60%", width: "14rem", height: "14rem" },
        animation: "animate-tech-orb-fast",
        opacity: 0.4,
      },
    ],
    beams: [
      {
        style: {
          top: "50%",
          left: "5%",
          width: "30%",
          height: "2px",
          transform: "rotate(90deg)",
        },
        animation: "animate-tech-glow",
      },
    ],
  },
  grid: {
    baseGradient: (color) =>
      `radial-gradient(circle at 12% 20%, ${color} 0%, rgba(2, 8, 23, 0.05) 45%, transparent 70%),
       radial-gradient(circle at 88% 80%, rgba(56, 189, 248, 0.28) 0%, rgba(2, 8, 23, 0.05) 55%, transparent 75%),
       linear-gradient(180deg, rgba(2, 6, 23, 0.9) 0%, rgba(3, 12, 32, 0.88) 100%)`,
    gridColor: "rgba(159, 239, 0, 0.14)",
    orbs: [
      {
        style: { top: "-12%", left: "-8%", width: "20rem", height: "20rem" },
        animation: "animate-tech-orb",
        opacity: 0.45,
      },
      {
        style: { bottom: "-18%", right: "-10%", width: "24rem", height: "24rem" },
        animation: "animate-tech-orb-slow",
        opacity: 0.45,
      },
    ],
    beams: [
      {
        style: {
          top: "18%",
          right: "18%",
          width: "28%",
          height: "1px",
          transform: "rotate(12deg)",
        },
      },
      {
        style: {
          bottom: "24%",
          left: "22%",
          width: "34%",
          height: "1px",
          transform: "rotate(-12deg)",
        },
      },
    ],
    fragments: [
      {
        style: {
          top: "38%",
          right: "24%",
          width: "2.5rem",
          height: "2.5rem",
        },
      },
      {
        style: {
          bottom: "32%",
          left: "26%",
          width: "2rem",
          height: "2rem",
        },
      },
    ],
  },
};

export interface TechBackdropProps {
  className?: string;
  variant?: TechBackdropVariant;
  color?: string;
  hideGrid?: boolean;
}

export function TechBackdrop({
  className,
  variant = "section",
  color = defaultColor,
  hideGrid = false,
}: TechBackdropProps) {
  const config = variantConfigs[variant] ?? variantConfigs.section;
  const gridColor = config.gridColor ?? "rgba(159, 239, 0, 0.1)";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: config.baseGradient(color) }}
      />

      {!hideGrid && (
        <div
          className="absolute -inset-[180%] opacity-[0.22] animate-tech-grid"
          style={{
            backgroundImage: `linear-gradient(90deg, ${gridColor} 1px, transparent 1px), linear-gradient(180deg, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: "140px 140px, 140px 140px",
          }}
        />
      )}

      {config.beams?.map((beam, index) => (
        <div
          key={`beam-${index}`}
          className={cn(
            "absolute rounded-full bg-gradient-to-r from-transparent via-[rgba(159,239,0,0.45)] to-transparent blur-sm",
            beam.animation ?? "animate-tech-glow",
          )}
          style={{
            ...beam.style,
            backgroundImage: undefined,
            background:
              beam.color ??
              "linear-gradient(90deg, rgba(159,239,0,0), rgba(159,239,0,0.55), rgba(56,189,248,0))",
          }}
        />
      ))}

      {config.orbs.map((orb, index) => (
        <div
          key={`orb-${index}`}
          className={cn(
            "absolute rounded-full mix-blend-screen",
            orb.animation ?? "animate-tech-orb",
          )}
          style={{
            ...orb.style,
            background: `radial-gradient(circle at 35% 35%, ${orb.color ?? color} 0%, rgba(12, 20, 38, 0) 65%)`,
            opacity: orb.opacity ?? 0.6,
            animationDelay: orb.delay,
          }}
        />
      ))}

      {config.fragments?.map((fragment, index) => (
        <div
          key={`fragment-${index}`}
          className={cn(
            "absolute rounded-lg border border-primary/40 bg-primary/10 backdrop-blur-sm",
            fragment.animation ?? "animate-tech-fragment",
          )}
          style={{
            ...fragment.style,
            boxShadow: "0 0 18px rgba(159, 239, 0, 0.35)",
          }}
        />
      ))}

      <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.35)_0,rgba(255,255,255,0.35)_1px,transparent_1px,transparent_4px)] animate-tech-scan" />
    </div>
  );
}

export default TechBackdrop;
