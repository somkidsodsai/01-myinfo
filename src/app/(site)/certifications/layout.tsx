import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications & Credentials — Somkid Sodsai",
  description:
    "Professional certifications that demonstrate Somkid Sodsai’s commitment to secure, well-managed IT infrastructure and lifelong learning.",
};

export default function CertificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
