import { betterAuth } from "better-auth";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

function createAuth() {
  return betterAuth({
    database: {
      provider: "postgresql",
      url: process.env.POSTGRES_URL!,
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
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
}

let _auth: ReturnType<typeof createAuth> | null = null;

export function getAuth() {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}

export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_, prop) {
    const instance = getAuth();
    const value = (instance as any)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
