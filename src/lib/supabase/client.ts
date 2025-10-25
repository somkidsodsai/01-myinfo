import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

let client: ReturnType<typeof createBrowserSupabaseClient> | null = null;

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("Supabase browser client is not available on the server");
  }

  if (!client) {
    client = createBrowserSupabaseClient();
  }

  return client;
}
