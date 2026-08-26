import { config } from "dotenv";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { account, user, users } from "../db/schema/index";
import { getAdminSeedConfig } from "./admin-seed-config";
import { seedAccessControl } from "./seed-access";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

export async function seedAdminUser() {
  const { email, password } = getAdminSeedConfig(process.env);
  console.log(`Seeding admin user for ${email}...`);

  const db = await getDb();
  const superAdminRole = await seedAccessControl(db);

  const [existingAuthUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  const authUserId = existingAuthUser?.id ?? crypto.randomUUID();

  if (!existingAuthUser) {
    await db.insert(user).values({
      id: authUserId,
      name: "Admin Metrik Media",
      email,
      emailVerified: true,
      roleId: superAdminRole.id,
      isActive: true,
    });
    console.log("Better Auth admin user created");
  } else {
    await db
      .update(user)
      .set({ roleId: superAdminRole.id, isActive: true, emailVerified: true, updatedAt: new Date() })
      .where(eq(user.id, existingAuthUser.id));
    console.log("Better Auth admin user already exists; password preserved");
  }

  const [credentialAccount] = await db
    .select({ id: account.id, password: account.password })
    .from(account)
    .where(and(eq(account.userId, authUserId), eq(account.providerId, "credential")))
    .limit(1);

  if (!credentialAccount) {
    const passwordHash = await hashPassword(password);
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: authUserId,
      providerId: "credential",
      userId: authUserId,
      password: passwordHash,
    });
    console.log("Credential account created");
  } else if (!(await isBetterAuthPasswordHash(credentialAccount.password))) {
    await db
      .update(account)
      .set({ password: await hashPassword(password), updatedAt: new Date() })
      .where(eq(account.id, credentialAccount.id));
    console.log("Credential account password hash repaired");
  }

  const [legacyUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!legacyUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      name: "Admin Metrik Media",
      email,
      password: passwordHash,
      roleId: superAdminRole.id,
      isActive: true,
    });
    console.log("Legacy admin user created");
  } else {
    await db
      .update(users)
      .set({ roleId: superAdminRole.id, isActive: true, updatedAt: new Date() })
      .where(eq(users.id, legacyUser.id));
    console.log("Legacy admin user already exists; password preserved");
  }

  console.log("Admin seed completed");
}

async function isBetterAuthPasswordHash(passwordHash: string | null): Promise<boolean> {
  if (!passwordHash) return false;

  try {
    await verifyPassword({ hash: passwordHash, password: "" });
    return true;
  } catch {
    return false;
  }
}

seedAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Admin seed failed:", error instanceof Error ? error.message : "unknown error");
    process.exit(1);
  });
