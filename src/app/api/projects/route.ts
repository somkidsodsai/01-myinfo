import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError, ForbiddenError } from "@/lib/supabase/auth";
import { z } from "zod";
import { fetchProjects } from "@/services/projects";
import { extractStoragePath } from "@/lib/utils";
import { supabaseServiceRoleClient, supabaseServerClient } from "@/lib/supabase/server";

const projectSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  technologies: z.array(z.string().trim()).default([]),
  year: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  link: z.string().trim().optional().nullable(),
});

export async function GET() {
  try {
    const supabase = (() => {
      try {
        return supabaseServiceRoleClient();
      } catch {
        return supabaseServerClient();
      }
    })();

    const projects = await fetchProjects(supabase);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects", error);
    return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const payload = await request.json();
    const parsed = projectSchema.parse(payload);
    const normalisedImage = parsed.image ? extractStoragePath(parsed.image) ?? parsed.image : null;
    const projectToInsert = {
      ...parsed,
      image: normalisedImage,
    };

    const { count: slugConflict, error: slugError } = await serviceClient
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("slug", parsed.slug);

    if (slugError) throw slugError;
    if ((slugConflict ?? 0) > 0) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
    }

    const { data, error } = await serviceClient.from("projects").insert(projectToInsert).select().single();

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
    console.error("Failed to create project", error);
    return NextResponse.json({ message: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const payload = await request.json();
    const { id, ...updates } = payload;

    if (!id) {
      return NextResponse.json({ message: "Missing project id" }, { status: 400 });
    }

    const parsed = projectSchema.parse(updates);
    const normalisedImage = parsed.image ? extractStoragePath(parsed.image) ?? parsed.image : null;
    const projectToUpdate = {
      ...parsed,
      image: normalisedImage,
    };

    const { count: slugConflict, error: slugError } = await serviceClient
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("slug", parsed.slug)
      .neq("id", id);

    if (slugError) throw slugError;
    if ((slugConflict ?? 0) > 0) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
    }

    const { data, error } = await serviceClient
      .from("projects")
      .update(projectToUpdate)
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
    console.error("Failed to update project", error);
    return NextResponse.json({ message: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing project id" }, { status: 400 });
    }

    const { error } = await serviceClient.from("projects").delete().eq("id", id);

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
    console.error("Failed to delete project", error);
    return NextResponse.json({ message: "Failed to delete project" }, { status: 500 });
  }
}
