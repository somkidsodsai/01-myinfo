import { Card, CardContent } from "@/components/ui/card";
import {
  aboutEducation,
  aboutTimeline,
  aboutValues,
  personalInfo,
} from "@/config/site";
import { GraduationCap } from "lucide-react";

export const metadata = {
  title: "About Batcat - Product Design Lead",
  description:
    "Journey, values, and background of Batcat - a product design lead and creative coder crafting knowledge-first experiences from Bangkok.",
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up space-y-6">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {personalInfo.primaryTitle}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              About <span className="bg-gradient-primary bg-clip-text text-transparent">Batcat</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Product design lead, creative coder, and workshop facilitator based in Bangkok.
              I help teams craft clarity-first knowledge platforms, design systems, and rituals
              that unlock confident product decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core <span className="bg-gradient-primary bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-muted-foreground">
              Principles I bring into every collaboration and experiment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="text-center hover:shadow-lg transition-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CardContent className="pt-6 pb-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto shadow-glow">
                      <Icon className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg font-bold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Professional <span className="bg-gradient-primary bg-clip-text text-transparent">Journey</span>
              </h2>
              <p className="text-muted-foreground">
                Eight years of building knowledge-forward products with multi-disciplinary teams.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2" />
              {aboutTimeline.map((item, index) => (
                <div
                  key={item.title}
                  className={`relative mb-10 md:mb-14 animate-fade-in ${
                    index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
                  }`}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className={`md:w-1/2 ${index % 2 === 0 ? "md:ml-auto" : ""}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full transform md:-translate-x-1/2 -translate-y-1" />
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-primary font-semibold mb-2">{item.company}</p>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-primary bg-clip-text text-transparent">Education</span>
              </h2>
              <p className="text-muted-foreground">
                Service design, communication design, and continuous learning.
              </p>
            </div>

            <div className="space-y-6">
              {aboutEducation.map((edu, index) => (
                <Card
                  key={edu.degree}
                  className="p-6 hover:shadow-lg transition-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                      <GraduationCap className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                      <p className="text-primary font-semibold mb-1">{edu.school}</p>
                      <p className="text-sm text-muted-foreground mb-2">{edu.year}</p>
                      <p className="text-muted-foreground text-sm">{edu.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
