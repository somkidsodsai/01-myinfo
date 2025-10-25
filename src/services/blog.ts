"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServerClientPreferService } from "@/lib/supabase/server";
import { extractStoragePath } from "@/lib/utils";

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  image: string | null;
  imagePath?: string | null;
  date: string | null;
  readTime: string | null;
  views: number;
  author: Record<string, unknown> | null;
  tableOfContents: Array<{ title: string; id: string }>;
  content: string | null;
};

const normaliseArray = <T>(value: unknown, fallback: T[]): T[] => {
  return Array.isArray(value) ? (value as T[]) : fallback;
};

const MEDIA_BUCKET = "media";
const SIGNED_URL_TTL = 60 * 60; // 1 hour

const supabaseHostname = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
})();

const resolveStoragePath = (image: string | null | undefined): string | null => {
  if (!image) {
    return null;
  }
  const pathFromValue = extractStoragePath(image);
  if (pathFromValue) {
    return pathFromValue;
  }
  if (!supabaseHostname) {
    return image;
  }
  try {
    const url = new URL(image);
    if (url.hostname === supabaseHostname) {
      return extractStoragePath(image);
    }
  } catch {
    // Non-URL strings fall through
  }
  return image;
};

const enhanceWithSignedImage = async (
  supabase: SupabaseClient,
  project: Omit<BlogPostRecord, "image" | "imagePath"> & { image: string | null; imagePath?: string | null },
): Promise<BlogPostRecord> => {
  const storagePath = project.imagePath ?? resolveStoragePath(project.image);
  if (!storagePath) {
    return { ...project, image: project.image, imagePath: null };
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL);

  if (!signedError && signedData?.signedUrl) {
    return {
      ...project,
      image: signedData.signedUrl,
      imagePath: storagePath,
    };
  }

  const { data: publicData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
  if (publicData.publicUrl) {
    return {
      ...project,
      image: publicData.publicUrl,
      imagePath: storagePath,
    };
  }

  return {
    ...project,
    image: null,
    imagePath: storagePath,
  };
};

const shapeBlogPost = (row: Record<string, unknown>): Omit<BlogPostRecord, "image" | "imagePath"> & {
  image: string | null;
  imagePath?: string | null;
} => {
  const tagsSource = (row as Record<string, unknown>).tags ?? [];
  const tags = normaliseArray<string>(row.tags, normaliseArray<string>(tagsSource, []));
  const tableOfContents = normaliseArray<{ title: string; id: string }>(
    (row as Record<string, unknown>).tableOfContents ??
      (row as Record<string, unknown>)["tableOfContents"] ??
      (row as Record<string, unknown>).tableofcontents ??
      [],
  );

  const imagePath =
    (row.imagePath as string | null | undefined) ??
    (row.image_path as string | null | undefined) ??
    resolveStoragePath((row.image as string | null | undefined) ?? null);

  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: (row.excerpt as string | null) ?? null,
    category: (row.category as string | null) ?? null,
    tags,
    image: (row.image as string | null) ?? null,
    imagePath,
    date: (row.date as string | null) ?? null,
    readTime:
      (row.readTime as string | null) ??
      ((row as Record<string, unknown>)["readTime"] as string | null) ??
      ((row as Record<string, unknown>).readtime as string | null) ??
      null,
    views: typeof row.views === "number" ? row.views : Number(row.views ?? 0) || 0,
    author: (row.author as Record<string, unknown> | null) ?? null,
    tableOfContents,
    content: (row.content as string | null) ?? null,
  };
};

export async function fetchBlogPosts(client?: SupabaseClient): Promise<BlogPostRecord[]> {
  try {
    const supabase = client ?? supabaseServerClientPreferService();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) return [];

    const shaped = data.map((row) => shapeBlogPost(row as Record<string, unknown>));
    return Promise.all(shaped.map((item) => enhanceWithSignedImage(supabase, item)));
  } catch (error) {
    console.error("fetchBlogPosts failed", error);
    throw new Error("Failed to load blog posts");
  }
}

export async function fetchBlogPostBySlug(slug: string, client?: SupabaseClient): Promise<BlogPostRecord> {
  try {
    const supabase = client ?? supabaseServerClientPreferService();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      throw error ?? new Error("Blog post not found");
    }

    const shaped = shapeBlogPost(data as Record<string, unknown>);
    return enhanceWithSignedImage(supabase, shaped);
  } catch (error) {
    console.error("fetchBlogPostBySlug failed", error);
    throw new Error("Failed to load blog post");
  }
}
