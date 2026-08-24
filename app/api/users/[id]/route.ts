import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { getDb } from "@/db/index";
import { roles, session as authSessions, user as authUsers } from "@/db/schema/index";
import { requireAdmin } from "@/lib/server-session";
import { userUpdateSchema } from "@/lib/validators/public";
import { zodError } from "@/lib/api-response";

async function getUser(id: string) {
  const db = await getDb();
  return db.select({ id: authUsers.id, name: authUsers.name, email: authUsers.email, avatar: authUsers.image, roleId: authUsers.roleId, isActive: authUsers.isActive, createdAt: authUsers.createdAt, updatedAt: authUsers.updatedAt, roleName: roles.name }).from(authUsers).leftJoin(roles, eq(authUsers.roleId, roles.id)).where(eq(authUsers.id, id)).limit(1);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request); if (guard.error) return guard.error;
  const [data] = await getUser((await params).id);
  return data ? NextResponse.json({ data }) : NextResponse.json({ message: "User not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request); if (guard.error) return guard.error;
  try {
    const id = (await params).id;
    const parsed = userUpdateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const body = parsed.data;
    const db = await getDb(); const [existing] = await getUser(id);
    if (!existing) return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (body.email) {
      const [emailTaken] = await db.select({ id: authUsers.id }).from(authUsers).where(and(ne(authUsers.id, id), eq(authUsers.email, body.email.trim().toLowerCase()))).limit(1);
      if (emailTaken) return NextResponse.json({ message: "Email is already in use" }, { status: 422 });
    }
    const nextIsActive = body.isActive === undefined ? existing.isActive : body.isActive;
    const [data] = await db.update(authUsers).set({ name: body.name?.trim() || existing.name, email: body.email?.trim().toLowerCase() || existing.email, roleId: body.roleId === undefined ? existing.roleId : body.roleId, image: body.avatar === undefined ? existing.avatar : body.avatar, isActive: nextIsActive, updatedAt: new Date() }).where(eq(authUsers.id, id)).returning({ id: authUsers.id, name: authUsers.name, email: authUsers.email, roleId: authUsers.roleId, isActive: authUsers.isActive });
    if (!nextIsActive) await db.delete(authSessions).where(eq(authSessions.userId, id));
    return NextResponse.json({ message: "User updated", data });
  } catch (error) {
    console.error("PATCH /api/users/[id] failed", error);
    return NextResponse.json({ message: "Could not update user" }, { status: 422 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request); if (guard.error) return guard.error;
  const id = (await params).id;
  if (id === guard.user.id) return NextResponse.json({ message: "You cannot deactivate your own account" }, { status: 422 });
  const db = await getDb();
  const [data] = await db.update(authUsers).set({ isActive: false, updatedAt: new Date() }).where(eq(authUsers.id, id)).returning({ id: authUsers.id });
  if (data) await db.delete(authSessions).where(eq(authSessions.userId, id));
  return data ? NextResponse.json({ message: "User deactivated" }) : NextResponse.json({ message: "User not found" }, { status: 404 });
}
