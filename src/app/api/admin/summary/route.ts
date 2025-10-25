import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError, ForbiddenError } from "@/lib/supabase/auth";

export async function GET() {
  try {
    const { serviceClient } = await requireAdmin();
    const [projectsCount, blogCount, certificationsCount, messagesCount] = await Promise.all([
      serviceClient.from("projects").select("id", { count: "exact", head: true }),
      serviceClient.from("blog_posts").select("id", { count: "exact", head: true }),
      serviceClient.from("certifications").select("id", { count: "exact", head: true }),
      serviceClient.from("messages").select("id", { count: "exact", head: true }),
    ]);

    const recentMessages = await serviceClient
      .from("messages")
      .select("id, name, subject, receivedAt")
      .order("receivedAt", { ascending: false })
      .limit(5);

    return NextResponse.json({
      totals: {
        projects: projectsCount.count ?? 0,
        blogPosts: blogCount.count ?? 0,
        certifications: certificationsCount.count ?? 0,
        messages: messagesCount.count ?? 0,
      },
      recentMessages: recentMessages.data ?? [],
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("Failed to load admin summary", error);
    return NextResponse.json({ message: "Failed to load admin summary" }, { status: 500 });
  }
}

