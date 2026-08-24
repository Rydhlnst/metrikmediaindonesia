import { config } from "dotenv";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { getDb } from "../db/index";
import { user, account, roles, users } from "../db/schema/index";
import { eq } from "drizzle-orm";

config({ path: resolve(process.cwd(), ".env.local") });

const ADMIN_EMAIL = "admin@metrikmedia.id";
const ADMIN_PASSWORD = "admin123";

async function seedAdminUser() {
  console.log("Seeding admin user...");

  const db = await getDb();
  const [superAdminRole] = await db.select().from(roles).where(eq(roles.name, "super_admin")).limit(1);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const [existing] = await db.select().from(user).where(eq(user.email, ADMIN_EMAIL)).limit(1);

  if (existing) {
    console.log("Admin user already exists, skipping Better Auth creation...");
  } else {
    const userId = crypto.randomUUID();

    await db.insert(user).values({
      id: userId,
      name: "Admin Metrik Media",
      email: ADMIN_EMAIL,
      emailVerified: true,
      roleId: superAdminRole?.id ?? null,
      isActive: true,
    });

    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
    });

    console.log("Admin user created successfully:", { id: userId, email: ADMIN_EMAIL });
  }

  // Sinkron ke tabel users legacy (dipakai untuk FK editorId di articles)
  const [legacyUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  if (!legacyUser) {
    await db.insert(users).values({
      name: "Admin Metrik Media",
      email: ADMIN_EMAIL,
      password: passwordHash,
      roleId: superAdminRole?.id ?? null,
      isActive: true,
    });
    console.log("Legacy users row created for admin");
  } else if (legacyUser.roleId !== (superAdminRole?.id ?? null)) {
    await db.update(users).set({ roleId: superAdminRole?.id ?? null }).where(eq(users.email, ADMIN_EMAIL));
  }

  console.log("\nLogin credentials:");
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}

seedAdminUser()
  .then(() => {
    console.log("\nSeed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
