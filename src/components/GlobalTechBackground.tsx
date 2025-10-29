import TechBackdrop from "@/components/TechBackdrop";

const GlobalTechBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-background">
      <div className="absolute inset-0">
        <TechBackdrop variant="hero" className="opacity-[0.85]" />
      </div>
      <div className="absolute inset-0 mix-blend-screen opacity-60">
        <TechBackdrop variant="grid" className="opacity-[0.35]" />
      </div>
      <div className="absolute inset-0 mix-blend-screen opacity-55">
        <TechBackdrop variant="alt" className="opacity-[0.3]" />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(159,239,0,0.4),transparent_52%),radial-gradient(circle_at_78%_16%,rgba(56,189,248,0.38),transparent_58%),radial-gradient(circle_at_50%_120%,rgba(94,234,212,0.3),transparent_62%)]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-background/12 to-background/28 backdrop-blur-[0.5px]" />
    </div>
  );
};

export default GlobalTechBackground;
