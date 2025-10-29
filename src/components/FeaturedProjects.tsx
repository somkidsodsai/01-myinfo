"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "@/components/shared/link";
import type { ProjectRecord } from "@/services/projects";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load projects");
        const data = (await res.json()) as ProjectRecord[];
        if (isMounted) {
          setProjects(data.slice(0, 3));
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Unable to load featured projects.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const sectionBackdrop = (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/25 to-background/70 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_-8%,rgba(159,239,0,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_110%,rgba(56,189,248,0.12),transparent_60%)]" />
    </div>
  );

  if (isLoading) {
    return (
      <section className="relative py-20 md:py-32 overflow-hidden">
        {sectionBackdrop}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          Loading featured work.
        </div>
      </section>
    );
  }

  if (error || projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="relative py-20 md:py-32 overflow-hidden">
      {sectionBackdrop}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore some of my recent work showcasing diverse skills in design and development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className="group overflow-hidden border border-border/80 bg-card/80 backdrop-blur-lg shadow-lg transition-all duration-300 hover:border-primary/60 hover:shadow-glow animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden aspect-video">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {project.link && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full border border-border/80 bg-card/80 backdrop-blur flex items-center justify-center shadow-lg">
                      <ExternalLink size={18} className="text-primary" />
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                {project.category && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-primary-foreground border border-primary/40 bg-primary/15 px-3 py-1 rounded-full backdrop-blur">
                      {project.category}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded-md border border-border/55 bg-muted/40 text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group px-8 font-semibold hover:bg-primary/20 hover:text-primary-foreground"
          >
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
