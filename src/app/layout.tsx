import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Somkid Sodsai - System Administrator Portfolio",
  description:
    "Somkid Sodsai is a system administrator in Thailand focused on reliable, secure infrastructure and continuous learning across the IT landscape.",
  openGraph: {
    title: "Somkid Sodsai - System Administrator Portfolio",
    description:
      "Discover Somkid Sodsai's infrastructure projects, certifications, and writing on keeping systems dependable while exploring new IT skills.",
    url: "https://somkidsodsai.com",
    type: "website",
    locale: "en_US",
    siteName: "Somkid Sodsai Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Somkid Sodsai - System Administrator Portfolio",
    description:
      "Keeping infrastructure stable while learning every day. Explore Somkid Sodsai's projects, certifications, and insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-screen bg-background text-foreground antialiased")}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
