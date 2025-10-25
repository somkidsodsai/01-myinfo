import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { isAdminUser } from "@/lib/supabase/auth";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname === "/admin/login";

  if (isAdminPath && !isLoginPath) {
    if (!user || !isAdminUser(user)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      if (pathname !== "/admin/login") {
        redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isLoginPath && user && isAdminUser(user)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/dashboard";
    redirectUrl.searchParams.delete("redirect");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};



