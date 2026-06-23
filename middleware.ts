import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES } from "@/lib/constants/constants";

const PUBLIC_AUTH_ROUTES = [AUTH_ROUTES.SIGN_IN, AUTH_ROUTES.SIGN_UP];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isPublicAuthRoute(pathname: string) {
  return PUBLIC_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  if (pathname === "/") {
    const navigateTo = isLoggedIn ? AUTH_ROUTES.HOME : AUTH_ROUTES.SIGN_IN;
    return NextResponse.redirect(new URL(navigateTo, request.url));
  }

  if (isLoggedIn && isPublicAuthRoute(pathname)) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.HOME, request.url));
  }

  if (!isLoggedIn && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.SIGN_IN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/recipes/:path*",
    "/recipe/:path*",
    "/about/:path*",
    "/contact/:path*",
    "/profile/:path*",
    "/saved/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
