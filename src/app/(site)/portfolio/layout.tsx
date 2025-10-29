import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Infrastructure Work — Somkid Sodsai",
  description:
    "Projects, automations, and infrastructure improvements led by Somkid Sodsai to keep systems reliable and scalable.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
