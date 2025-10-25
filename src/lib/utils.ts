import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractStoragePath(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const pattern = /\/storage\/v1\/object\/(?:public|sign)\/[^/]+\/(.+?)(?:\?.*)?$/;
    const match = url.pathname.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
    const mediaIndex = url.pathname.indexOf("/media/");
    if (mediaIndex !== -1) {
      return url.pathname.substring(mediaIndex + "/media/".length).replace(/^\/+/, "");
    }
    return value.replace(/^\/+/, "");
  } catch {
    return value.replace(/^\/+/, "");
  }
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}
