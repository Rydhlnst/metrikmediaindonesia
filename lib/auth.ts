import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index";
import { sendEmail } from "@/lib/email";
import { eq } from "drizzle-orm";

const connectionString = process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/metrikmedia";
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your Metrik Media password",
        html: `<p>Use the link below to reset your password.</p><p><a href="${url}">Reset password</a></p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your Metrik Media email",
        html: `<p>Verify your email address to activate your account.</p><p><a href="${url}">Verify email</a></p>`,
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  databaseHooks: {
    session: {
      create: {
        async before(session) {
          const [account] = await db
            .select({ isActive: schema.user.isActive })
            .from(schema.user)
            .where(eq(schema.user.id, session.userId))
            .limit(1);
          if (!account?.isActive) {
            throw new APIError("FORBIDDEN", {
              message: "This account is inactive.",
              code: "ACCOUNT_INACTIVE",
            });
          }
        },
      },
    },
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
