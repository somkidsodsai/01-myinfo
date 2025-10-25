"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
