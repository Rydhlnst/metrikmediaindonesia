import { betterAuth } from "better-auth";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.POSTGRES_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }: { user: any; url: string; token: string }) => {
      console.log(`Password reset for ${user.email}: ${url}`);
    },
    sendVerificationEmail: async ({ user, url, token }: { user: any; url: string; token: string }) => {
      console.log(`Email verification for ${user.email}: ${url}`);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      roleId: {
        type: "number",
        required: false,
        defaultValue: null,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      avatar: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  basePath: "/api/auth",
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
