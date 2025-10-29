import { aboutTimeline } from "@/config/site";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export function ExperienceHighlights() {
  return (
    <section id="experience" className="relative py-20 md:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/70 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(159,239,0,0.14),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_90%,rgba(56,189,248,0.14),transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm">
            <Briefcase size={16} />
            Professional journey
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Experience shaping systems
          </h2>
          <p className="text-lg text-muted-foreground">
            Eight years of building knowledge-forward products with cross-functional teams across APAC.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border/70 sm:left-1/2 sm:-translate-x-1/2" />
          {aboutTimeline.map((item, index) => (
            <div
              key={item.title}
              className="relative pl-12 sm:pl-0 sm:pb-14 animate-fade-in"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="absolute left-5 top-5 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary shadow-glow sm:left-1/2 sm:-translate-x-1/2" />

              <div
                className={`sm:flex sm:justify-${index % 2 === 0 ? "end" : "start"} sm:gap-12`}
              >
                <div
                  className={`sm:w-1/2 ${index % 2 === 0 ? "sm:pl-12 sm:text-right" : "sm:pr-12"}`}
                >
                  <Card className="relative overflow-hidden border border-border/80 bg-card/80 p-6 backdrop-blur-lg shadow-lg transition-shadow hover:border-primary/60 hover:shadow-glow">
                    <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                      {item.year}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm font-semibold text-primary mt-1">{item.company}</p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExperienceHighlights;
