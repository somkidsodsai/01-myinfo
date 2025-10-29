import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "@/components/shared/link";
import { navigationLinks, personalInfo } from "@/config/site";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const phoneHref = personalInfo.phone.replace(/\s+/g, "");

  const footerLinks = {
    Navigation: navigationLinks,
    Resources: [
      { name: "Project", path: "/portfolio" },
      { name: "Blog", path: "/blog" },
      { name: "Certifications", path: "/certifications" },
    ],
  };

  return (
    <footer className="relative overflow-hidden border-t border-border/60 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(180deg, var(--surface-overlay-strong) 0%, var(--surface-overlay-soft) 60%, var(--surface-overlay-faint) 100%)",
          }}
        />
        <div
          className="absolute -top-24 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full blur-3xl opacity-35"
          style={{
            background: "radial-gradient(circle at center, hsl(var(--primary) / 0.3) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(159, 239, 0, 0.09) 25%, rgba(159, 239, 0, 0.09) 26%, transparent 27%), linear-gradient(90deg, transparent 24%, rgba(159, 239, 0, 0.09) 25%, rgba(159, 239, 0, 0.09) 26%, transparent 27%)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-foreground">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-xl">
                  {personalInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-bold text-xl">{personalInfo.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              System administrator focused on keeping infrastructure dependable and continually learning across the IT landscape.
            </p>
            <div className="flex gap-3">
              <a
                href={personalInfo.socialProfiles.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border/80 bg-card/80 backdrop-blur flex items-center justify-center text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/20 hover:text-primary-foreground shadow-sm"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={personalInfo.socialProfiles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border/80 bg-card/80 backdrop-blur flex items-center justify-center text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/20 hover:text-primary-foreground shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border/80 bg-card/80 backdrop-blur flex items-center justify-center text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/20 hover:text-primary-foreground shadow-sm"
                aria-label="X (Twitter)"
              >
                <Twitter size={18} />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="w-10 h-10 rounded-full border border-border/80 bg-card/80 backdrop-blur flex items-center justify-center text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/20 hover:text-primary-foreground shadow-sm"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4 text-foreground">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${personalInfo.email}`} className="transition-colors hover:text-primary">
                  {personalInfo.email}
                </a>
              </li>
              <li>
                <a href={`tel:${phoneHref}`} className="transition-colors hover:text-primary">
                  {personalInfo.phone}
                </a>
              </li>
              <li className="pt-2 leading-relaxed">
                {personalInfo.availability}
                <br />
                9:00 AM - 6:00 PM (GMT+7)
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>(c) {currentYear} Somkid Sodsai. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="transition-colors hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
