import ScrollReveal from "@/components/ScrollReveal";
import { Card } from "@/components/ui/card";
import { aboutTimeline } from "@/config/site";
import { Briefcase } from "lucide-react";

export function ExperienceHighlights() {
  return (
    <section id="experience" className="relative py-20 md:py-28 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center space-y-4" variant="fade">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm">
            <Briefcase size={16} />
            Professional journey
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Experience shaping systems</h2>
          <p className="text-lg text-muted-foreground">
            Eight years of building knowledge-forward products with cross-functional teams across APAC.
          </p>
        </ScrollReveal>

        <div className="relative mt-16">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border/70 sm:left-1/2 sm:-translate-x-1/2" />
          {aboutTimeline.map((item, index) => {
            return (
              <ScrollReveal
                key={item.title}
                className="relative pl-12 sm:pl-0 sm:pb-14"
                delay={index * 160}
              >
                <div className="absolute left-5 top-5 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary shadow-glow sm:left-1/2 sm:-translate-x-1/2" />

                <div
                  className={`sm:flex sm:gap-12 ${
                    index % 2 === 0 ? "sm:justify-end" : "sm:justify-start"
                  }`}
                >
                  <div
                    className={`sm:w-1/2 ${
                      index % 2 === 0 ? "sm:pl-12 sm:text-right" : "sm:pr-12"
                    }`}
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
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExperienceHighlights;
