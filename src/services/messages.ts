"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServerClient } from "@/lib/supabase/server";

export type MessageRecord = {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  status: string;
  receivedAt: string;
};

export async function fetchMessages(client?: SupabaseClient): Promise<MessageRecord[]> {
  try {
    const supabase = client ?? supabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("receivedat", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((row) => {
      const record = row as Record<string, unknown>;
      return {
        id: String(record.id ?? ""),
        name: (record.name as string | null) ?? null,
        email: (record.email as string | null) ?? null,
        subject: (record.subject as string | null) ?? null,
        message: (record.message as string | null) ?? null,
        status: (record.status as string | null) ?? "unread",
        receivedAt:
          (record.receivedAt as string | null) ?? (record.receivedat as string | null) ?? new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("fetchMessages failed", error);
    throw new Error("Failed to load messages");
  }
}
