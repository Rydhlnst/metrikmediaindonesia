import { NextRequest, NextResponse } from "next/server";

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
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

const categorySlugs = ["bisnis", "olahraga", "pendidikan", "sosial-dan-budaya", "teknologi"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isCategoryPage = categorySlugs.some((slug) => pathname === `/${slug}`);
  const isArticlePage = categorySlugs.some((slug) =>
    pathname.startsWith(`/${slug}/`)
  );

  if (isPublicRoute || isCategoryPage || isArticlePage) {
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      const sessionCookie = request.cookies.get("better-auth.session_token");
      if (sessionCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSession = !!sessionCookie;

  if (authRoutes.some((route) => pathname.startsWith(route)) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
