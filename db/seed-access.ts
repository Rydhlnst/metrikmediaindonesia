import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "./schema/index";

export type SeedDatabase = PostgresJsDatabase<typeof schema>;

const roleDefinitions = [
  { name: "user", description: "Registered reader account" },
  { name: "reporter", description: "Can create and manage owned article drafts" },
  { name: "admin", description: "System administration access" },
  { name: "super_admin", description: "Akses penuh terhadap seluruh sistem" },
  { name: "administrator", description: "Mengelola operasional platform & media" },
  { name: "editor_in_chief", description: "Mengontrol konten editorial, approve, reject, & publish" },
  { name: "editor", description: "Review, edit, add references, & manage tags" },
  { name: "journalist", description: "Membuat artikel, liputan lapangan, & upload media" },
  { name: "contributor", description: "Membuat draft artikel terbatas" },
  { name: "seo_manager", description: "Manage metadata, redirects, & sitemap configuration" },
  { name: "advertisement_manager", description: "Manage ad campaigns & business publications" },
] as const;

const permissionDefinitions = [
  ["dashboard.view", "View protected dashboards"],
  ["articles.create", "Create articles"],
  ["articles.edit_own", "Edit owned articles"],
  ["articles.edit_any", "Edit any article"],
  ["articles.publish", "Publish articles"],
  ["articles.delete", "Delete articles"],
  ["submissions.create", "Create submissions"],
  ["submissions.review", "Review submissions"],
  ["media.upload", "Upload media"],
  ["media.edit_any", "Edit any media"],
  ["media.delete_any", "Delete any media"],
  ["taxonomy.manage", "Manage taxonomy"],
  ["users.manage", "Manage users"],
  ["ads.manage", "Manage advertisements"],
  ["analytics.view", "View analytics"],
  ["audit_logs.view", "View audit logs"],
  ["settings.manage", "Manage settings"],
  ["roles.manage", "Manage roles and permissions"],
] as const;

const allPermissionKeys = permissionDefinitions.map(([key]) => key);

const rolePermissionKeys: Record<string, readonly string[]> = {
  super_admin: allPermissionKeys,
  administrator: allPermissionKeys,
  admin: allPermissionKeys,
  editor_in_chief: ["dashboard.view", "articles.create", "articles.edit_any", "articles.publish", "articles.delete", "submissions.review", "media.upload", "media.edit_any", "taxonomy.manage", "analytics.view"],
  editor: ["dashboard.view", "articles.create", "articles.edit_any", "articles.publish", "submissions.review", "media.upload", "media.edit_any", "taxonomy.manage", "analytics.view"],
  seo_manager: ["dashboard.view", "articles.edit_any", "taxonomy.manage", "analytics.view"],
  advertisement_manager: ["dashboard.view", "ads.manage"],
  contributor: ["dashboard.view", "articles.create", "articles.edit_own", "submissions.create", "media.upload", "analytics.view"],
  reporter: ["dashboard.view", "articles.create", "articles.edit_own", "submissions.create", "media.upload"],
  journalist: ["dashboard.view", "articles.create", "articles.edit_own", "submissions.create", "media.upload"],
  user: ["submissions.create"],
};

export async function seedAccessControl(db: SeedDatabase) {
  await db.insert(schema.roles).values([...roleDefinitions]).onConflictDoNothing();
  await db.insert(schema.permissions).values(
    permissionDefinitions.map(([key, description]) => ({ key, description }))
  ).onConflictDoNothing();

  const seededRoles = await db.select().from(schema.roles);
  const seededPermissions = await db.select().from(schema.permissions);
  const permissionIdByKey = new Map(seededPermissions.map((permission) => [permission.key, permission.id]));
  const rolePermissionRows = seededRoles.flatMap((role) =>
    (rolePermissionKeys[role.name] || []).flatMap((key) => {
      const permissionId = permissionIdByKey.get(key);
      return permissionId ? [{ roleId: role.id, permissionId }] : [];
    })
  );

  if (rolePermissionRows.length > 0) {
    await db.insert(schema.rolePermissions).values(rolePermissionRows).onConflictDoNothing();
  }

  const [superAdminRole] = await db
    .select()
    .from(schema.roles)
    .where(eq(schema.roles.name, "super_admin"))
    .limit(1);

  if (!superAdminRole) {
    throw new Error("super_admin role could not be seeded");
  }

  return superAdminRole;
}
