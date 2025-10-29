import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { contactCards, contactSocials, personalInfo } from "@/config/site";

const ContactCTA = () => {
  return (
    <section id="contact" className="relative py-20 md:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/72 via-background/28 to-background/72 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_-6%,rgba(159,239,0,0.13),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_106%,rgba(56,189,248,0.13),transparent_60%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
          <div className="space-y-8">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                Let&apos;s collaborate
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Ready to turn ambiguity into shared product rituals
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you&apos;re launching a knowledge hub, scaling design ops, or aligning stakeholders around a new
                insight engine, I jump in as a hands-on partner—blending research, systems, and storytelling.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur shadow-sm">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Best for</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Product teams tackling complex knowledge journeys
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur shadow-sm">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Response time</p>
                <p className="mt-1 text-sm font-semibold text-foreground">Within one business day (GMT+7)</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="px-8 font-semibold shadow-glow hover:shadow-xl transition-all">
                <a href={`mailto:${personalInfo.email}`}>
                  Email Batcat <Mail className="ml-2" size={20} />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold hover:bg-primary/15">
                <a href="/portfolio">
                  Review case studies <ArrowRight className="ml-2" size={20} />
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card/80 p-8 backdrop-blur-lg shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-6">Direct channels</h3>
              <div className="space-y-4">
                {contactCards.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.title} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 shadow-glow">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{info.title}</p>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{info.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card/80 p-6 backdrop-blur-lg shadow-lg">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Find me elsewhere
              </h3>
              <div className="flex gap-3">
                {contactSocials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-card/80 text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/20 hover:text-primary-foreground shadow-sm"
                      aria-label={social.label}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
