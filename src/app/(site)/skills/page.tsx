import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { learningFocus, skillGroups, technologyLogos } from "@/config/site";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Skills - Batcat",
  description:
    "Skill map for Batcat across engineering, design craft, operations, and facilitation-plus the tools and technologies in daily use.",
};

const groupConfig = [
  { key: "technical" as const, title: "Technical Skills" },
  { key: "design" as const, title: "Design Skills" },
  { key: "tools" as const, title: "Tools & Workflow" },
  { key: "soft" as const, title: "Leadership & Collaboration" },
];

export default function SkillsPage() {
  return (
    <div className="bg-background">
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Skills & <span className="bg-gradient-primary bg-clip-text text-transparent">Expertise</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              A hybrid practice across research, systems design, engineering, and facilitation. Everything here comes from shipping knowledge-forward products with multi-disciplinary teams.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16">
            {groupConfig.map((group, groupIndex) => (
              <div key={group.key}>
                <h2 className="text-3xl font-bold mb-8">
                  {group.title.split(" ")[0]}{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    {group.title.split(" ").slice(1).join(" ")}
                  </span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {skillGroups[group.key].map((skill, index) => {
                    const Icon = "icon" in skill && skill.icon ? skill.icon : Sparkles;
                    return (
                      <Card
                        key={skill.name}
                        className="p-6 hover:shadow-lg transition-shadow animate-fade-in"
                        style={{ animationDelay: `${(groupIndex * 8 + index) * 40}ms` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                              <Icon className="text-white" size={20} />
                            </div>
                            <span className="font-semibold">{skill.name}</span>
                          </div>
                          {"level" in skill && (
                            <span className="text-sm font-bold text-primary">
                              {skill.level}%
                            </span>
                          )}
                        </div>
                        {"level" in skill && <Progress value={skill.level} className="h-2" />}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Technologies I <span className="bg-gradient-primary bg-clip-text text-transparent">Work With</span>
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {technologyLogos.map((tech, index) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-background hover:shadow-lg transition-all group animate-fade-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Image src={tech.logo} alt={tech.name} width={80} height={80} className="h-full w-full object-contain" />
                  </div>
                  <span className="text-sm font-medium text-center">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-primary text-white text-center space-y-6">
              <h2 className="text-3xl font-bold">Currently Learning</h2>
              <p className="text-lg opacity-90">
                Staying curious keeps the work honest. Here&apos;s what I&apos;m experimenting with right now:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {learningFocus.map((topic) => (
                  <span key={topic} className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm font-medium">
                    {topic}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}



