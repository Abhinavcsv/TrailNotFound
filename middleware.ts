import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/planner", "/profile", "/dashboard"];

export default auth((req) => {
  const isProtected = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/planner/:path*", "/profile/:path*", "/dashboard/:path*"],
};
