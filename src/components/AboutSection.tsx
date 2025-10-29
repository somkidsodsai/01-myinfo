import ScrollReveal from "@/components/ScrollReveal";
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
    <section id="about" className="relative py-20 md:py-28 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] items-start">
          <div className="space-y-8">
            <ScrollReveal className="space-y-4 max-w-2xl" variant="fade">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                Meet Somkid
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Infrastructure you can depend on, day or night
              </h2>
              <p className="text-lg text-muted-foreground">
                I keep networks stable, automate repeatable work, and coordinate with every team touching production.
                From patching and backups to on-call playbooks, I make sure operations stay predictable while everyone
                understands what changed and why.
              </p>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickFacts.map((fact, index) => (
                <ScrollReveal key={fact.label} delay={index * 80}>
                  <div className="rounded-2xl border border-border/70 bg-card/80 px-5 py-4 backdrop-blur shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{fact.label}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{fact.value}</p>
                  </div>
                </ScrollReveal>
              ))}
              <ScrollReveal delay={quickFacts.length * 80}>
                <div className="rounded-2xl border border-primary/50 bg-primary/10 px-5 py-4 backdrop-blur shadow-glow">
                  <p className="text-xs uppercase tracking-wide text-primary">Shipped</p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {headlineStat.value} {headlineStat.label}
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur" delay={220}>
              <h3 className="text-lg font-semibold text-foreground mb-3">How I partner</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I work alongside developers, security, and support teams to plan change windows, automate verifications,
                and communicate incidents clearly. Expect detailed runbooks, post-change reviews, and documentation that
                keeps everyone in sync.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid gap-4">
            {focusValueCards.map((value, index) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={value.title} delay={index * 140}>
                  <div className="group rounded-3xl border border-border/80 bg-card/85 p-6 backdrop-blur-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow">
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
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
