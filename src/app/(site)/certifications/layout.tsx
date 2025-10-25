import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications & Credentials - Batcat",
  description:
    "Professional certifications validating Batcat's expertise across design systems, operations, accessibility, and data storytelling.",
};

export default function CertificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
