"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { navigationLinks, personalInfo } from "@/config/site";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateActiveHash = () => {
      if (typeof window === "undefined") return;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
      const scrollPosition = window.scrollY + 160;

      let currentHash = "";
      for (const section of sections) {
        const offsetTop = section.offsetTop;
        const offsetHeight = section.offsetHeight;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          currentHash = `#${section.id}`;
          break;
        }
      }

      if (!currentHash) {
        currentHash = window.location.hash || "";
      }

      setActiveHash(currentHash);
    };

    updateActiveHash();
    window.addEventListener("scroll", updateActiveHash, { passive: true });
    window.addEventListener("hashchange", updateActiveHash);
    return () => {
      window.removeEventListener("scroll", updateActiveHash);
      window.removeEventListener("hashchange", updateActiveHash);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" && (!activeHash || activeHash === "#hero");
    }
    if (path.startsWith("#")) {
      return pathname === "/" && activeHash === path;
    }
    return pathname === path;
  };
  const effectiveTheme = (resolvedTheme ?? theme) === "dark" ? "dark" : "light";
  const themeToggleLabel = mounted
    ? effectiveTheme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme"
    : "Toggle theme";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      aria-label="Primary navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group" aria-label={`${personalInfo.fullName} home`}>
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">
                {personalInfo.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline-block">
              {personalInfo.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationLinks.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
              className="rounded-lg"
              aria-label={themeToggleLabel}
              title={themeToggleLabel}
            >
              {mounted && effectiveTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-lg">
              <Link href="#contact">Get in Touch</Link>
            </Button>
          </div>

          {/* Mobile Menu & Theme Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
              className="rounded-lg"
              aria-label={themeToggleLabel}
              title={themeToggleLabel}
            >
              {mounted && effectiveTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navigationLinks.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all font-medium ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-lg mt-2">
                <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
