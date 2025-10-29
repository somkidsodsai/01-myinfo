import TechBackdrop from "@/components/TechBackdrop";

const GlobalTechBackground = () => {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      <TechBackdrop variant="hero" className="opacity-[0.96]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/65 via-background/35 to-background/75 backdrop-blur-[2px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(159,239,0,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.18),transparent_60%)]" />
    </div>
  );
};

export default GlobalTechBackground;
