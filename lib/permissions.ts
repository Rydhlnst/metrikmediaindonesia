import type { ServerSessionUser } from "@/lib/server-session";

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  ARTICLES_CREATE: "articles.create",
  ARTICLES_EDIT_OWN: "articles.edit_own",
  ARTICLES_EDIT_ANY: "articles.edit_any",
  ARTICLES_PUBLISH: "articles.publish",
  ARTICLES_DELETE: "articles.delete",
  SUBMISSIONS_CREATE: "submissions.create",
  SUBMISSIONS_REVIEW: "submissions.review",
  MEDIA_UPLOAD: "media.upload",
  MEDIA_EDIT_ANY: "media.edit_any",
  MEDIA_DELETE_ANY: "media.delete_any",
  TAXONOMY_MANAGE: "taxonomy.manage",
  USERS_MANAGE: "users.manage",
  ADS_MANAGE: "ads.manage",
  ANALYTICS_VIEW: "analytics.view",
  AUDIT_LOGS_VIEW: "audit_logs.view",
  SETTINGS_MANAGE: "settings.manage",
  ROLES_MANAGE: "roles.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];

// Compatibility policy used until role_permissions has been seeded. Once a role
// has explicit mappings, those mappings are authoritative.
export const ROLE_PERMISSION_FALLBACKS: Record<string, Permission[]> = {
  super_admin: ALL_PERMISSIONS,
  administrator: ALL_PERMISSIONS,
  admin: ALL_PERMISSIONS,
  editor_in_chief: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ARTICLES_CREATE,
    PERMISSIONS.ARTICLES_EDIT_ANY,
    PERMISSIONS.ARTICLES_PUBLISH,
    PERMISSIONS.ARTICLES_DELETE,
    PERMISSIONS.SUBMISSIONS_REVIEW,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.MEDIA_EDIT_ANY,
    PERMISSIONS.MEDIA_DELETE_ANY,
    PERMISSIONS.TAXONOMY_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  editor: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ARTICLES_CREATE,
    PERMISSIONS.ARTICLES_EDIT_ANY,
    PERMISSIONS.ARTICLES_PUBLISH,
    PERMISSIONS.SUBMISSIONS_REVIEW,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.MEDIA_EDIT_ANY,
    PERMISSIONS.TAXONOMY_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  seo_manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ARTICLES_EDIT_ANY,
    PERMISSIONS.TAXONOMY_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  advertisement_manager: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.ADS_MANAGE],
  contributor: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ARTICLES_CREATE,
    PERMISSIONS.ARTICLES_EDIT_OWN,
    PERMISSIONS.SUBMISSIONS_CREATE,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  kontributor: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ARTICLES_CREATE,
    PERMISSIONS.ARTICLES_EDIT_OWN,
    PERMISSIONS.SUBMISSIONS_CREATE,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  reporter: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ARTICLES_CREATE,
    PERMISSIONS.ARTICLES_EDIT_OWN,
    PERMISSIONS.SUBMISSIONS_CREATE,
    PERMISSIONS.MEDIA_UPLOAD,
  ],
  journalist: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ARTICLES_CREATE,
    PERMISSIONS.ARTICLES_EDIT_OWN,
    PERMISSIONS.SUBMISSIONS_CREATE,
    PERMISSIONS.MEDIA_UPLOAD,
  ],
  user: [PERMISSIONS.SUBMISSIONS_CREATE],
};

export function hasPermission(
  user: Pick<ServerSessionUser, "role" | "permissions"> | null,
  permission: Permission
): boolean {
  if (!user) return false;
  if (user.permissions && user.permissions.length > 0) {
    return user.permissions.includes(permission);
  }
  return (ROLE_PERMISSION_FALLBACKS[user.role.trim().toLowerCase()] || []).includes(
    permission
  );
}
