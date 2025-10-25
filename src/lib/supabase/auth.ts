import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseServiceRoleClient } from "@/lib/supabase/server";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
  }
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new UnauthorizedError();
  }

  if (!isAdminUser(user)) {
    throw new ForbiddenError();
  }

  let serviceClient: SupabaseClient;
  try {
    serviceClient = supabaseServiceRoleClient();
  } catch (error) {
    console.warn("Supabase service role client unavailable; falling back to session client", error);
    serviceClient = supabase;
  }

  return { user, supabase, serviceClient } as {
    user: User;
    supabase: SupabaseClient;
    serviceClient: SupabaseClient;
  };
}

export function isAdminUser(user: User | null | undefined) {
  const role = (user?.app_metadata?.role as string | undefined) ?? (user?.user_metadata?.role as string | undefined);
  return role === "admin";
}


