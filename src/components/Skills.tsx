import { Code2, Layers, Sparkles, Users } from "lucide-react";
import { learningFocus } from "@/config/site";

const skillBuckets = [
  {
    title: "Product Strategy & UX",
    description:
      "Lead discovery, co-create rituals, and turn research into multilingual journeys stakeholders rally behind.",
    icon: Sparkles,
    highlights: [
      "Insight synthesis & storytelling",
      "Content-first interaction design",
      "End-to-end journey mapping",
      "Rapid testing with hybrid teams",
    ],
  },
  {
    title: "Design Systems & Ops",
    description:
      "Ship scalable component libraries, tokens, and governance models that keep design and engineering in sync.",
    icon: Layers,
    highlights: [
      "Multi-brand design tokens",
      "Accessibility playbooks",
      "Pattern documentation",
      "Design ops rituals",
    ],
  },
  {
    title: "Creative Engineering",
    description:
      "Prototype with modern stacks so teams can feel new flows early—bridging product, engineering, and data.",
    icon: Code2,
    highlights: ["React & Next.js systems", "Data visualization", "API-first collaboration", "Experimentation ops"],
  },
  {
    title: "Team Coaching & Facilitation",
    description:
      "Enable PMs, designers, and researchers to own the playbook through clinics, rituals, and shared language.",
    icon: Users,
    highlights: ["Workshop facilitation", "Mentoring & coaching", "Cross-cultural collaboration", "Change leadership"],
  },
];

const SkillsShowcase = () => {
  return (
    <section id="skills" className="relative py-20 md:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/28 to-background/70 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_-6%,rgba(159,239,0,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_104%,rgba(56,189,248,0.12),transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            A systems-led practice that stays hands-on
          </h2>
          <p className="text-lg text-muted-foreground">
            My sweet spot is connecting research, design systems, and delivery so complex ideas feel intuitive—across
            product, platform, and ops work.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {skillBuckets.map((bucket, index) => {
            const Icon = bucket.icon;
            return (
              <div
                key={bucket.title}
                className="group h-full rounded-3xl border border-border/80 bg-card/80 p-7 backdrop-blur-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/50 bg-primary/20 shadow-glow group-hover:scale-105 transition-transform">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">{bucket.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{bucket.description}</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {bucket.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary"
                        >
                          <span className="block h-2 w-2 rounded-full bg-primary/70" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2rem] text-muted-foreground">Currently exploring</p>
          <div className="flex flex-wrap justify-center gap-3">
            {learningFocus.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary shadow-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsShowcase;
