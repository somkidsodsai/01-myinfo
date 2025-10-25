"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServerClientPreferService } from "@/lib/supabase/server";
import { extractStoragePath } from "@/lib/utils";

const MEDIA_BUCKET = "media";
const SIGNED_URL_TTL = 60 * 60; // 1 hour

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);
const supabaseHostname = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
})();

export type ProjectRecord = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  category: string | null;
  technologies: string[];
  year: string | null;
  image: string | null;
  imagePath?: string | null;
  link: string | null;
};

export async function fetchProjects(client?: SupabaseClient): Promise<ProjectRecord[]> {
  try {
    const supabase = client ?? supabaseServerClientPreferService();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      throw error;
    }

    const rows = (data ?? []).map((row) => ({
      ...row,
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
    })) as ProjectRecord[];

    const projects = await Promise.all(
      rows.map(async (project) => {
        if (!project.image) {
          return project;
        }

        const pathFromUrl =
          isHttpUrl(project.image) && supabaseHostname
            ? (() => {
                try {
                  const url = new URL(project.image);
                  if (url.hostname === supabaseHostname) {
                    return extractStoragePath(project.image);
                  }
                  return null;
                } catch {
                  return null;
                }
              })()
            : null;

        const storagePath = pathFromUrl ?? (!isHttpUrl(project.image) ? project.image : null);

        if (!storagePath) {
          return project;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .createSignedUrl(storagePath, SIGNED_URL_TTL);

        if (!signedError && signedData?.signedUrl) {
          return {
            ...project,
            image: signedData.signedUrl,
            // Preserve original path for editing scenarios
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
      }),
    );

    return projects;
  } catch (error) {
    console.error("fetchProjects failed", error);
    throw new Error("Failed to load projects");
  }
}
