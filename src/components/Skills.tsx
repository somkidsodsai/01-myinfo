import { Sparkles } from "lucide-react";
import { skillGroups, learningFocus } from "@/config/site";

const groupDefinitions = [
  { key: "technical", title: "Engineering toolkit" },
  { key: "design", title: "Design craft" },
  { key: "tools", title: "Operations & tooling" },
];

const SkillsShowcase = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Skills & <span className="bg-gradient-primary bg-clip-text text-transparent">Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A systems-led practice that blends strategy, code, facilitation, and storytelling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {groupDefinitions.map((group, index) => {
            const skills = skillGroups[group.key as keyof typeof skillGroups];
            const maybeIcon = (skills[0] as { icon?: typeof Sparkles } | undefined)?.icon;
            const Icon = maybeIcon ?? Sparkles;

            return (
              <div
                key={group.key}
                className="group p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/50 shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                    <Icon className="text-white" size={24} />
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                      {group.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill.name}
                          className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center animate-fade-in">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Currently exploring{" "}
            {learningFocus.map((topic, index) => (
              <span key={topic} className="text-primary font-semibold">
                {topic}
                {index < learningFocus.length - 1 ? ", " : ""}
              </span>
            ))}.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SkillsShowcase;



