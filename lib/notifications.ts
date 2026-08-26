import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import {
  permissions,
  rolePermissions,
  roles,
  user as authUsers,
} from "@/db/schema/index";

/**
 * Returns active Better Auth users who can review editorial submissions.
 * Notifications must target real user IDs instead of a hardcoded recipient.
 */
export async function getEditorialRecipientIds(): Promise<string[]> {
  const db = await getDb();
  const rows = await db
    .select({ userId: authUsers.id })
    .from(authUsers)
    .innerJoin(roles, eq(authUsers.roleId, roles.id))
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(
      and(
        eq(authUsers.isActive, true),
        eq(permissions.key, "submissions.review")
      )
    );

  return [...new Set(rows.map((row) => row.userId))];
}
