"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Search } from "lucide-react";
import { Link } from "@/components/shared/link";
import type { ProjectRecord } from "@/services/projects";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = (await res.json()) as ProjectRecord[];
        if (isMounted) {
          setProjects(data);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Unable to load projects right now. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(projects.map((project) => project.category).filter((category): category is string => Boolean(category)))
    );
    return ["All", ...values];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
      const search = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !search ||
        project.title.toLowerCase().includes(search) ||
        (project.description ?? "").toLowerCase().includes(search) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Case Studies & <span className="bg-gradient-primary bg-clip-text text-transparent">Experiments</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Product stories that blend systems thinking, research, and creative coding—built with cross-functional teams across Asia-Pacific.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search projects by name, problem, or stack..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "bg-muted text-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading projects…</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No projects match that filter yet—try a different keyword or category.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative overflow-hidden aspect-video">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {project.link && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <ExternalLink size={18} className="text-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {project.category && (
                        <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                      )}
                      {project.year && <span>{project.year}</span>}
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <div className="pt-2">
                        <Button asChild variant="ghost" className="group/cta gap-2 px-0">
                          <Link href={project.link} target="_blank" rel="noopener noreferrer">
                            View snapshot
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}




