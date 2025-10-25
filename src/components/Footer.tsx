import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "@/components/shared/link";
import { navigationLinks, personalInfo } from "@/config/site";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Navigation: navigationLinks,
    Resources: navigationLinks.filter((link) =>
      ["/blog", "/skills", "/certifications"].includes(link.path),
    ),
  };

  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="font-bold text-xl">{personalInfo.name}</span>
            </div>
            <p className="text-sm text-background/70">
              Product design lead in Bangkok. I help teams craft clarity-first design systems, knowledge platforms, and rituals that scale.
            </p>
            <div className="flex gap-3">
              <a
                href={personalInfo.socialProfiles.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-primary transition-all flex items-center justify-center group"
                aria-label="GitHub"
              >
                <Github size={18} className="group-hover:text-white" />
              </a>
              <a
                href={personalInfo.socialProfiles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-primary transition-all flex items-center justify-center group"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="group-hover:text-white" />
              </a>
              <a
                href="https://x.com/batcatdesign"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-primary transition-all flex items-center justify-center group"
                aria-label="X (Twitter)"
              >
                <Twitter size={18} className="group-hover:text-white" />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-primary transition-all flex items-center justify-center group"
                aria-label="Email"
              >
                <Mail size={18} className="group-hover:text-white" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.path} className="text-sm text-background/70 hover:text-background transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href={`mailto:${personalInfo.email}`} className="hover:text-background transition-colors">
                  {personalInfo.email}
                </a>
              </li>
              <li>
                <a href="tel:+66612345678" className="hover:text-background transition-colors">
                  {personalInfo.phone}
                </a>
              </li>
              <li className="pt-2">
                {personalInfo.availability}
                <br />
                9:00 AM - 6:00 PM (GMT+7)
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
            <p>(c) {currentYear} Batcat. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-background transition-colors">
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
