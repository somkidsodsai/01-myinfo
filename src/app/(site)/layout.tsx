"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalTechBackground from "@/components/GlobalTechBackground";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <GlobalTechBackground />
      <Navigation />
      <main className="relative z-10 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
