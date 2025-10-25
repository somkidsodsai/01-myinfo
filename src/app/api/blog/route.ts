import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError, ForbiddenError } from "@/lib/supabase/auth";
import { z } from "zod";
import { fetchBlogPosts } from "@/services/blog";
import { extractStoragePath } from "@/lib/utils";

const blogPostSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  image: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  readTime: z.string().optional().nullable(),
  views: z.number().int().nonnegative().default(0),
  author: z.record(z.string(), z.unknown()).optional().nullable(),
  tableOfContents: z
    .array(
      z.object({
        title: z.string().min(1),
        id: z.string().min(1),
      }),
    )
    .optional()
    .default([]),
  content: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const posts = await fetchBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts", error);
    return NextResponse.json({ message: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const payload = await request.json();
    const parsed = blogPostSchema.parse(payload);
    const imagePath = parsed.image ? extractStoragePath(parsed.image) ?? parsed.image : null;

    const record = {
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.excerpt ?? null,
      category: parsed.category ?? null,
      tags: parsed.tags,
      image: imagePath,
      date: parsed.date ?? null,
      readtime: parsed.readTime ?? null,
      views: parsed.views ?? 0,
      author: parsed.author ?? null,
      tableOfContents: parsed.tableOfContents ?? [],
      content: parsed.content ?? null,
    };

    const { count: existingSlugCount, error: slugError } = await serviceClient
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("slug", parsed.slug);

    if (slugError) throw slugError;
    if ((existingSlugCount ?? 0) > 0) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
    }

    const { data, error } = await serviceClient.from("blog_posts").insert(record).select().single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }
    console.error("Failed to create blog post", error);
    return NextResponse.json({ message: "Failed to create blog post" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const payload = await request.json();
    const { id, ...updates } = payload;

    if (!id) {
      return NextResponse.json({ message: "Missing blog post id" }, { status: 400 });
    }

    const parsed = blogPostSchema.parse(updates);
    const imagePath = parsed.image ? extractStoragePath(parsed.image) ?? parsed.image : null;

    const record = {
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.excerpt ?? null,
      category: parsed.category ?? null,
      tags: parsed.tags,
      image: imagePath,
      date: parsed.date ?? null,
      readtime: parsed.readTime ?? null,
      views: parsed.views ?? 0,
      author: parsed.author ?? null,
      tableOfContents: parsed.tableOfContents ?? [],
      content: parsed.content ?? null,
    };

    const { count: slugConflict, error: slugError } = await serviceClient
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("slug", parsed.slug)
      .neq("id", id);

    if (slugError) throw slugError;
    if ((slugConflict ?? 0) > 0) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
    }

    const { data, error } = await serviceClient
      .from("blog_posts")
      .update(record)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }
    console.error("Failed to update blog post", error);
    return NextResponse.json({ message: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing blog post id" }, { status: 400 });
    }

    const { error } = await serviceClient.from("blog_posts").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("Failed to delete blog post", error);
    return NextResponse.json({ message: "Failed to delete blog post" }, { status: 500 });
  }
}
