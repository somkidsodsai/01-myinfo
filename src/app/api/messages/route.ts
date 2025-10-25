import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError, ForbiddenError } from "@/lib/supabase/auth";
import { z } from "zod";
import { supabaseServiceRoleClient } from "@/lib/supabase/server";
import { fetchMessages } from "@/services/messages";

const messageStatusSchema = z.enum(["unread", "read", "archived"]);

const messageCreateSchema = z.object({
  name: z.string().trim().optional().nullable(),
  email: z.string().trim().optional().nullable(),
  subject: z.string().trim().optional().nullable(),
  message: z.string().trim().optional().nullable(),
  status: messageStatusSchema.optional().default("unread"),
  receivedAt: z.string().optional().nullable(),
});

const messageUpdateSchema = z.object({
  id: z.string().min(1, "Message id is required"),
  status: messageStatusSchema,
});

export async function GET() {
  try {
    const { serviceClient } = await requireAdmin();
    const messages = await fetchMessages(serviceClient);
    return NextResponse.json(messages);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("Failed to fetch messages", error);
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = messageCreateSchema.parse(payload);
    const supabase = supabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        ...parsed,
        receivedAt: parsed.receivedAt ?? new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }
    console.error("Failed to create message", error);
    return NextResponse.json({ message: "Failed to create message" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const payload = await request.json();
    const parsed = messageUpdateSchema.parse(payload);

    const { data, error } = await serviceClient
      .from("messages")
      .update({ status: parsed.status })
      .eq("id", parsed.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("Failed to update message", error);
    return NextResponse.json({ message: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing message id" }, { status: 400 });
    }

    const { error } = await serviceClient.from("messages").delete().eq("id", id);

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
    console.error("Failed to delete message", error);
    return NextResponse.json({ message: "Failed to delete message" }, { status: 500 });
  }
}
