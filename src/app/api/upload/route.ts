import { randomUUID } from "crypto";
import { Buffer } from "node:buffer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin, UnauthorizedError, ForbiddenError } from "@/lib/supabase/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MEDIA_BUCKET = "media";
const DEFAULT_PREFIX = "uploads";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 60 minutes
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

type StorageFileSummary = {
  name: string;
  path: string;
  size: number;
  createdAt: string | null;
  updatedAt: string | null;
  type: string;
  url: string;
};

const normalisePath = (path: string) => path.replace(/^\/+/, "");

const buildSignedUrl = async (client: SupabaseClient, path: string) => {
  const { data: signedData, error: signedError } = await client.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (!signedError && signedData?.signedUrl) {
    return signedData.signedUrl;
  }

  const { data: publicData } = client.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return publicData.publicUrl;
};

export async function GET(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") ?? DEFAULT_PREFIX;

    const { data, error } = await serviceClient.storage
      .from(MEDIA_BUCKET)
      .list(prefix, { sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      throw error;
    }

    const files: StorageFileSummary[] = await Promise.all(
      (data ?? [])
        .filter((item) => "name" in item && item.name)
        .map(async (item) => {
          const path = prefix ? `${prefix}/${item.name}` : item.name;
          const url = await buildSignedUrl(serviceClient, path);
          return {
            name: item.name,
            path,
            size: item.metadata?.size ?? 0,
            createdAt: item.created_at ?? null,
            updatedAt: item.updated_at ?? null,
            type: item.metadata?.mimetype ?? "application/octet-stream",
            url,
          };
        }),
    );

    return NextResponse.json(files);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("Failed to list media files", error);
    return NextResponse.json({ message: "Failed to list media files" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ message: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ message: "File exceeds 5 MB limit" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileExtension = (file.type.split("/")[1] ?? "png").toLowerCase();
    const filePath = `${DEFAULT_PREFIX}/${randomUUID()}.${fileExtension}`;

    const { error } = await serviceClient.storage.from(MEDIA_BUCKET).upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    if (error) {
      throw error;
    }

    const signedUrl = await buildSignedUrl(serviceClient, filePath);
    const { data: publicData } = serviceClient.storage.from(MEDIA_BUCKET).getPublicUrl(filePath);

    return NextResponse.json({
      path: filePath,
      url: signedUrl,
      publicUrl: publicData.publicUrl,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("Failed to upload file", error);
    return NextResponse.json({ message: "Failed to upload file" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { serviceClient } = await requireAdmin();
    const { searchParams } = new URL(request.url);
    let path = searchParams.get("path");

    if (!path) {
      const body = await request.json().catch(() => null);
      if (body && typeof body.path === "string") {
        path = body.path;
      }
    }

    if (!path) {
      return NextResponse.json({ message: "Missing file path" }, { status: 400 });
    }

    const normalised = normalisePath(path);
    const { error } = await serviceClient.storage.from(MEDIA_BUCKET).remove([normalised]);

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
    console.error("Failed to delete media file", error);
    return NextResponse.json({ message: "Failed to delete media file" }, { status: 500 });
  }
}
