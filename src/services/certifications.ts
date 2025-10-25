"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServerClientPreferService } from "@/lib/supabase/server";
import { extractStoragePath } from "@/lib/utils";

export type CertificationRecord = {
  id: string;
  name: string;
  organization: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  credentialId: string | null;
  verificationUrl: string | null;
  image: string | null;
  imagePath?: string | null;
  category: string | null;
  status: string | null;
  group: string | null;
};

const MEDIA_BUCKET = "media";
const SIGNED_URL_TTL = 60 * 60;

export async function fetchCertifications(client?: SupabaseClient): Promise<CertificationRecord[]> {
  try {
    const supabase = client ?? supabaseServerClientPreferService();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("issuedate", { ascending: false });

    if (error) {
      throw error;
    }

    const shaped = (data ?? []).map((row) => {
      const record = row as Record<string, unknown>;
      const storagePath =
        extractStoragePath((record.image as string | null) ?? null) ??
        (record.imagePath as string | null | undefined) ??
        null;

      return {
        id: String(record.id ?? ""),
        name: (record.name as string) ?? "",
        organization: (record.organization as string | null) ?? null,
        issueDate: (record.issueDate as string | null) ?? (record.issuedate as string | null) ?? null,
        expiryDate: (record.expiryDate as string | null) ?? (record.expirydate as string | null) ?? null,
        credentialId: (record.credentialId as string | null) ?? (record.credentialid as string | null) ?? null,
        verificationUrl:
          (record.verificationUrl as string | null) ?? (record.verificationurl as string | null) ?? null,
        image: null as string | null,
        imagePath: storagePath,
        category: (record.category as string | null) ?? null,
        status: (record.status as string | null) ?? null,
        group:
          (record.group as string | null) ??
          (record.groupName as string | null) ??
          (record.groupname as string | null) ??
          null,
      };
    });

    return Promise.all(
      shaped.map(async (item) => {
        if (!item.imagePath) {
          return item;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .createSignedUrl(item.imagePath, SIGNED_URL_TTL);

        if (!signedError && signedData?.signedUrl) {
          return { ...item, image: signedData.signedUrl };
        }

        const { data: publicData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(item.imagePath);
        return { ...item, image: publicData.publicUrl ?? null };
      }),
    );
  } catch (error) {
    console.error("fetchCertifications failed", error);
    throw new Error("Failed to load certifications");
  }
}
