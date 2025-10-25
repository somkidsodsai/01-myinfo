"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, CheckCircle2, ExternalLink } from "lucide-react";
import type { CertificationRecord } from "@/services/certifications";
import { certificationGroupLabels } from "@/config/site";

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<CertificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    let isMounted = true;

    const loadCertifications = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/certifications", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch certifications");
        }
        const data = (await res.json()) as CertificationRecord[];
        if (isMounted) {
          setCertifications(data);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Unable to load certifications right now. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCertifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        certifications
          .map((cert) => cert.category)
          .filter((category): category is string => Boolean(category))
      )
    );
    return ["All", ...values];
  }, [certifications]);

  const groupedCertifications = useMemo(() => {
    const base =
      selectedCategory === "All"
        ? certifications
        : certifications.filter((cert) => cert.category === selectedCategory);

    const groups = base.reduce((acc, cert) => {
      const key = cert.group ?? "other";
      if (!acc[key]) {
        acc[key] = [] as CertificationRecord[];
      }
      acc[key].push(cert);
      return acc;
    }, {} as Record<string, CertificationRecord[]>);

    return Object.entries(groups)
      .map(([groupId, items]) => ({
        id: groupId,
        label: certificationGroupLabels[groupId] ?? "Other",
        items,
      }))
      .filter((group) => group.items.length > 0);
  }, [certifications, selectedCategory]);

  return (
    <>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary shadow-glow mb-4">
              <Award className="text-white" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Certifications &{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Credentials</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Evidence of continuous learning across design operations, system strategy, accessibility, and storytelling.
            </p>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading certifications…</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
            </div>
          ) : groupedCertifications.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No certifications found.</p>
            </div>
          ) : (
            groupedCertifications.map((group) => (
              <div key={group.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{group.label}</h2>
                  <span className="text-sm text-muted-foreground">
                    {group.items.length} item{group.items.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.items.map((cert, index) => (
                    <Card
                      key={cert.id}
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="relative overflow-hidden aspect-[4/3]">
                        {cert.image ? (
                          <Image
                            src={cert.image}
                            alt={cert.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 360px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                            No image
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 size={14} />
                            {cert.status ?? "Active"}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        {cert.category && (
                          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {cert.category}
                          </span>
                        )}

                        <div>
                          <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                            {cert.name}
                          </h3>
                          {cert.organization && (
                            <p className="text-sm font-semibold text-muted-foreground">{cert.organization}</p>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-start gap-2">
                            <Calendar size={16} className="mt-0.5 flex-shrink-0" />
                            <div>
                              <div>Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "—"}</div>
                              {cert.expiryDate && <div>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</div>}
                            </div>
                          </div>
                          {cert.credentialId && (
                            <div className="flex items-center gap-2">
                              <Award size={16} className="flex-shrink-0" />
                              <span className="text-xs font-mono">{cert.credentialId}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {cert.verificationUrl && (
                            <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                              <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={16} />
                                Verify
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}





