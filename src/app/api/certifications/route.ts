import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError, ForbiddenError } from "@/lib/supabase/auth";
import { z } from "zod";
import { fetchCertifications } from "@/services/certifications";

const certificationSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  organization: z.string().trim().optional().nullable(),
  issueDate: z.string().trim().optional().nullable(),
  expiryDate: z.string().trim().optional().nullable(),
  credentialId: z.string().trim().optional().nullable(),
  verificationUrl: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  status: z.string().trim().optional().nullable(),
  group: z.string().trim().optional().nullable(),
});

export async function GET() {
  try {
    const certifications = await fetchCertifications();
    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Failed to fetch certifications", error);
    return NextResponse.json({ message: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const payload = await request.json();
    const parsed = certificationSchema.parse(payload);
    const { data, error } = await serviceClient.from("certifications").insert(parsed).select().single();

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
    console.error("Failed to create certification", error);
    return NextResponse.json({ message: "Failed to create certification" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const payload = await request.json();
    const { id, ...updates } = payload;

    if (!id) {
      return NextResponse.json({ message: "Missing certification id" }, { status: 400 });
    }

    const parsed = certificationSchema.parse(updates);

    const { data, error } = await serviceClient
      .from("certifications")
      .update(parsed)
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
    console.error("Failed to update certification", error);
    return NextResponse.json({ message: "Failed to update certification" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing certification id" }, { status: 400 });
    }

    const { error } = await serviceClient.from("certifications").delete().eq("id", id);

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
    console.error("Failed to delete certification", error);
    return NextResponse.json({ message: "Failed to delete certification" }, { status: 500 });
  }
}
