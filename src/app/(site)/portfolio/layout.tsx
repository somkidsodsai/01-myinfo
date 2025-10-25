import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Batcat",
  description:
    "Case studies and experiments from Batcat - showcasing knowledge systems, design operations, and storytelling for product teams.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
