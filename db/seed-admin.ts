import { config } from "dotenv";
import { resolve } from "path";
import { auth } from "../lib/auth";

config({ path: resolve(process.cwd(), ".env.local") });

async function seedAdminUser() {
  console.log("Seeding admin user...");

  try {
    // Create admin user via Better Auth
    const result = await (auth.api as any).createUser({
      body: {
        email: "admin@metrikmedia.id",
        password: "admin123",
        name: "Admin Metrik Media",
      },
    });

    console.log("Admin user created successfully:", {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
    });

    console.log("\nLogin credentials:");
    console.log("Email: admin@metrikmedia.id");
    console.log("Password: admin123");
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log("Admin user already exists, skipping...");
    } else {
      console.error("Error creating admin user:", error);
    }
  }
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
