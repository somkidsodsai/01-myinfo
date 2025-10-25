import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal & Field Notes - Batcat",
  description:
    "Writing, facilitation kits, and experiments from Batcat on design systems, knowledge operations, and team rituals.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
