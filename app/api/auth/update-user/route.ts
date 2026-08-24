import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { user as authUsers } from "@/db/schema/index";
import { requireAuth } from "@/lib/server-session";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zodError } from "@/lib/api-response";

const profileSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    avatar: z.string().url().max(2_000).nullable().optional(),
  })
  .refine((value) => value.name !== undefined || value.avatar !== undefined, {
    message: "No profile fields were supplied",
  });

export async function POST(request: NextRequest) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const sessionUser = authGuard.user;

  const payload = profileSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return zodError(payload.error);
  }

  const updates: Partial<typeof authUsers.$inferInsert> = {};
  if (payload.data.name !== undefined) updates.name = payload.data.name;
  if (payload.data.avatar !== undefined) {
    updates.avatar = payload.data.avatar;
    updates.image = payload.data.avatar;
  }

  const db = await getDb();
  const [updatedUser] = await db
    .update(authUsers)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(authUsers.id, sessionUser.id))
    .returning({ id: authUsers.id, name: authUsers.name, email: authUsers.email, avatar: authUsers.avatar });

  return NextResponse.json({ message: "Profile updated", data: updatedUser });
}
