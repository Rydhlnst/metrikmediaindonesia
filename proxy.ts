import { NextRequest, NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/pencarian",
  "/tentang-kami",
  "/hubungi-kami",
  "/tim-editorial",
  "/saved",
  "/profile",
];

// Auth routes - redirect to dashboard if already logged in
const authRoutes = ["/login", "/signup"];

// Category slugs
const categorySlugs = ["bisnis", "olahraga", "pendidikan", "sosial-dan-budaya"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a static file or Next.js internal
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if it's a Payload admin route or API
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isCategoryPage = categorySlugs.some((slug) => pathname === `/${slug}`);
  const isArticlePage = categorySlugs.some((slug) =>
    pathname.startsWith(`/${slug}/`)
  );

  if (isPublicRoute || isCategoryPage || isArticlePage) {
    return NextResponse.next();
  }

  // Check for session cookie (better-auth)
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSession = !!sessionCookie;

  // If on auth routes and already logged in, redirect to dashboard
  if (authRoutes.some((route) => pathname.startsWith(route)) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If protected route and not logged in, redirect to login
  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
