"use client";

import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/shared/link";
import { heroContent } from "@/config/site";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in-up">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full border border-primary/40 bg-primary/15 text-primary text-sm font-semibold shadow-sm backdrop-blur">
                {heroContent.badge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {heroContent.headline.split(heroContent.highlight)[0]}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {heroContent.highlight}
              </span>
              {heroContent.headline.split(heroContent.highlight)[1]}
            </h1>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground">
              {heroContent.subheadline}
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              {heroContent.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button asChild size="lg" className="px-8 text-base font-semibold shadow-glow transition-all hover:shadow-xl">
                <Link href={heroContent.primaryCta.href}>
                  {heroContent.primaryCta.label}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base font-semibold">
                <a href={heroContent.secondaryCta.href}>
                  <Download className="mr-2" size={20} />
                  {heroContent.secondaryCta.label}
                </a>
              </Button>
            </div>

            <div className="flex gap-4 justify-center lg:justify-start pt-6">
              {heroContent.socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border/80 bg-card/80 backdrop-blur flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/20 hover:text-primary-foreground shadow-md hover:shadow-glow"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex-shrink-0 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-primary rounded-full opacity-20 blur-2xl animate-float" />
              <Image
                src="/profile-avatar.png"
                alt="Somkid Sodsai portrait"
                width={384}
                height={384}
                priority
                className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover shadow-xl ring-4 ring-background"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-fade-in">
          {heroContent.stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-lg shadow-lg hover:border-primary/60 hover:shadow-glow transition-all duration-300 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
