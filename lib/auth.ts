import { betterAuth } from "better-auth";
import postgres from "postgres";

const connectionString = process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/metrikmedia";

export const auth = betterAuth({
  database: postgres(connectionString),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
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
