import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/db/index";
import {
  authors,
  permissions,
  rolePermissions,
  roles,
  user as authUsers,
} from "@/db/schema/index";
import { eq } from "drizzle-orm";
import { apiError } from "@/lib/api-response";
import { assertSameOrigin } from "@/lib/request-security";
import { hasPermission, PERMISSIONS, type Permission } from "@/lib/permissions";

export interface ServerSessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  authorId?: number;
  slug?: string;
  avatar?: string | null;
  permissions?: string[];
}

function normalizeRole(role?: string | null): string {
  return role?.trim().toLowerCase().replace(/\s+/g, "_") || "user";
}

export function isContributor(user: ServerSessionUser | null): boolean {
  return ["kontributor", "contributor", "reporter", "journalist"].includes(
    normalizeRole(user?.role)
  );
}

export function isEditor(user: ServerSessionUser | null): boolean {
  return ["editor", "editor_in_chief", "chief_editor", "seo_manager"].includes(
    normalizeRole(user?.role)
  );
}

export function isAdmin(user: ServerSessionUser | null): boolean {
  return ["super_admin", "administrator", "admin"].includes(
    normalizeRole(user?.role)
  );
}

export function canManageEditorial(user: ServerSessionUser | null): boolean {
  return (
    hasPermission(user, PERMISSIONS.ARTICLES_EDIT_ANY) ||
    hasPermission(user, PERMISSIONS.SUBMISSIONS_REVIEW)
  );
}

export async function getSessionFromRequest(
  request: NextRequest
): Promise<ServerSessionUser | null> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return null;

    const sessionUser = session.user;
    const db = await getDb();
    const [authUser] = await db
      .select({ roleName: roles.name, isActive: authUsers.isActive })
      .from(authUsers)
      .leftJoin(roles, eq(authUsers.roleId, roles.id))
      .where(eq(authUsers.id, sessionUser.id))
      .limit(1);
    if (!authUser?.isActive) return null;
    const permissionRows = await db
      .select({ key: permissions.key })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .innerJoin(roles, eq(rolePermissions.roleId, roles.id))
      .where(eq(roles.name, authUser.roleName || ""));
    const permissionKeys = permissionRows.map((row) => row.key);
    const [author] = await db
      .select({ id: authors.id, slug: authors.slug, role: authors.role })
      .from(authors)
      .where(eq(authors.authUserId, sessionUser.id))
      .limit(1);

    if (author) {
      return {
        id: sessionUser.id,
        authorId: author.id,
        name: sessionUser.name,
        email: sessionUser.email,
        // The Better Auth role is authoritative for authorization. The author
        // role is editorial display metadata and must not downgrade an admin.
        role: normalizeRole(authUser?.roleName || author.role || "contributor"),
        slug: author.slug,
        avatar: sessionUser.image || null,
        permissions: permissionKeys,
      };
    }

    return {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      role: normalizeRole(authUser?.roleName),
      avatar: sessionUser.image || null,
      permissions: permissionKeys,
    };
  } catch (error) {
    console.warn("Unable to resolve session", error);
    return null;
  }
}

export type AuthGuard =
  | { user: ServerSessionUser; error: null }
  | { user: null; error: NextResponse };

export async function requireAuth(request: NextRequest): Promise<AuthGuard> {
  const originError = assertSameOrigin(request);
  if (originError) return { user: null, error: originError };
  const user = await getSessionFromRequest(request);
  if (!user) {
    return {
      user: null,
      error: apiError(401, "UNAUTHORIZED", "Authentication required"),
    };
  }
  return { user, error: null };
}

export async function requireEditor(request: NextRequest): Promise<AuthGuard> {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard;
  const editorialAccess =
    hasPermission(authGuard.user, PERMISSIONS.SUBMISSIONS_REVIEW) ||
    hasPermission(authGuard.user, PERMISSIONS.TAXONOMY_MANAGE) ||
    hasPermission(authGuard.user, PERMISSIONS.ARTICLES_EDIT_ANY);
  if (!editorialAccess) {
    return { user: null, error: apiError(403, "FORBIDDEN", "Editorial permission required") };
  }
  return authGuard;
}

export async function requireAdmin(request: NextRequest): Promise<AuthGuard> {
  return requirePermission(request, PERMISSIONS.ROLES_MANAGE, "Administrator permission required");
}

export async function requirePermission(
  request: NextRequest,
  permission: Permission,
  message = "Permission required"
): Promise<AuthGuard> {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard;
  if (!hasPermission(authGuard.user, permission)) {
    return { user: null, error: apiError(403, "FORBIDDEN", message) };
  }
  return authGuard;
}
