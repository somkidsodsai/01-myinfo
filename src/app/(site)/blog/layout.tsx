import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Updates — Somkid Sodsai",
  description:
    "Notes on infrastructure best practices, automation experiments, and continuous learning from system administrator Somkid Sodsai.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
