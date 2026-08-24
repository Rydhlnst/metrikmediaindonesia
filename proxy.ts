import { NextRequest, NextResponse } from "next/server";
import { canManageEditorial, getSessionFromRequest, isContributor } from "@/lib/server-session";
import { resolveRedirect } from "@/lib/redirects";

const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

const editorialDashboardPrefixes = [
  "/dashboard/analytics",
  "/dashboard/editorial",
  "/dashboard/topics",
  "/dashboard/locations",
  "/dashboard/entities",
  "/dashboard/categories",
  "/dashboard/tags",
  "/dashboard/authors",
  "/dashboard/seo-health",
  "/dashboard/redirects",
  "/dashboard/media",
  "/dashboard/comments",
  "/dashboard/advertisements",
  "/dashboard/business-publications",
  "/dashboard/pages",
  "/dashboard/users",
  "/dashboard/roles",
  "/dashboard/settings",
  "/dashboard/articles",
  "/dashboard/submissions",
];

export async function proxy(request: NextRequest) {
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

  const redirectExcluded = [
    "/dashboard",
    "/profile",
    "/saved",
    "/submissions",
    "/auth",
    ...authRoutes,
  ];
  if (!redirectExcluded.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    const redirect = await resolveRedirect(pathname);
    if (redirect && redirect.newUrl !== pathname) {
      return NextResponse.redirect(new URL(redirect.newUrl, request.url), redirect.statusCode);
    }
  }

  const user = await getSessionFromRequest(request);
  const authenticated = Boolean(user);

  const protectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname === "/saved" ||
    pathname === "/profile" ||
    pathname.startsWith("/submissions");
  if (protectedRoute && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/dashboard" && authenticated && !canManageEditorial(user) && !isContributor(user)) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (pathname.startsWith("/dashboard") && !canManageEditorial(user)) {
    const blocked = editorialDashboardPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    if (blocked) {
      return NextResponse.redirect(new URL(isContributor(user) ? "/dashboard/my-articles" : "/profile", request.url));
    }
    if (pathname.startsWith("/dashboard/my-articles") && !isContributor(user)) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
