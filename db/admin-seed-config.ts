export type AdminSeedConfig = {
  email: string;
  password: string;
};

export function getAdminSeedConfig(env: Readonly<Record<string, string | undefined>>): AdminSeedConfig {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error("ADMIN_EMAIL is required");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("ADMIN_EMAIL must be a valid email address");
  }

  if (email.endsWith("@example.com") || email.endsWith("@example.invalid")) {
    throw new Error("ADMIN_EMAIL must use a real deployment address");
  }

  if (!password) {
    throw new Error("ADMIN_PASSWORD is required");
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long");
  }

  if (password === "admin123" || password.startsWith("use-a-strong-password")) {
    throw new Error("ADMIN_PASSWORD must not use a placeholder value");
  }

  return { email, password };
}
