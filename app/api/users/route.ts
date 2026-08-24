import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/db/index";
import { roles, user as authUsers } from "@/db/schema/index";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/server-session";
import { userCreateSchema } from "@/lib/validators/public";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard.error) return guard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 10)));
    const search = searchParams.get("search")?.trim();
    const roleId = Number(searchParams.get("roleId"));
    const filters = [search ? or(ilike(authUsers.name, `%${search}%`), ilike(authUsers.email, `%${search}%`)) : undefined, Number.isInteger(roleId) && roleId > 0 ? eq(authUsers.roleId, roleId) : undefined].filter(Boolean);
    const where = filters.length ? and(...filters) : undefined;
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(authUsers).where(where);
    const data = await db.select({ id: authUsers.id, name: authUsers.name, email: authUsers.email, avatar: authUsers.image, roleId: authUsers.roleId, isActive: authUsers.isActive, createdAt: authUsers.createdAt, updatedAt: authUsers.updatedAt, roleName: roles.name }).from(authUsers).leftJoin(roles, eq(authUsers.roleId, roles.id)).where(where).orderBy(desc(authUsers.createdAt)).limit(limit).offset((page - 1) * limit);
    return NextResponse.json({ data, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } });
  } catch (error) {
    console.error("GET /api/users failed", error);
    return NextResponse.json({ message: "Failed to load users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard.error) return guard.error;
  try {
    const parsed = userCreateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const body = parsed.data;
    const signedUp = await auth.api.signUpEmail({ body: { name: body.name, email: body.email.toLowerCase(), password: body.password, image: body.avatar || undefined } });
    const db = await getDb();
    const [data] = await db.update(authUsers).set({ roleId: body.roleId ?? null, isActive: body.isActive ?? true, image: body.avatar ?? null, updatedAt: new Date() }).where(eq(authUsers.id, signedUp.user.id)).returning({ id: authUsers.id, name: authUsers.name, email: authUsers.email, roleId: authUsers.roleId, isActive: authUsers.isActive });
    return NextResponse.json({ message: "User created", data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users failed", error);
    return NextResponse.json({ message: "Could not create user" }, { status: 422 });
  }
}
