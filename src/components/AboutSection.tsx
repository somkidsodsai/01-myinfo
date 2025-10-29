import { aboutValues, heroContent, personalInfo } from "@/config/site";

const quickFacts = [
  { label: "Role", value: personalInfo.primaryTitle },
  { label: "Location", value: personalInfo.location },
  { label: "Availability", value: personalInfo.availability },
];

export function AboutSection() {
  const focusValueCards = aboutValues.slice(0, 3);
  const headlineStat = heroContent.stats[0];

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/25 to-background/70 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(159,239,0,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(56,189,248,0.15),transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] items-start">
          <div className="space-y-8">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                Meet Batcat
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Clarity-first product design lead for knowledge-heavy teams
              </h2>
              <p className="text-lg text-muted-foreground">
                I help product squads translate complex knowledge flows into interfaces that feel effortless.
                From research synthesis to design ops, I guide teams toward shareable systems that launch with confidence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-border/70 bg-card/80 px-5 py-4 backdrop-blur shadow-sm"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{fact.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{fact.value}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-primary/50 bg-primary/10 px-5 py-4 backdrop-blur shadow-glow">
                <p className="text-xs uppercase tracking-wide text-primary">Shipped</p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {headlineStat.value} {headlineStat.label}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-foreground mb-3">How I partner</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I design alongside engineers, researchers, and product leads—connecting insights to shipping rituals.
                Expect working sessions, transparent documentation, and prototypes that evolve with your team.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {focusValueCards.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group rounded-3xl border border-border/80 bg-card/85 p-6 backdrop-blur-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/50 bg-primary/15 shadow-glow">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
