import { getDb } from "@/db/index";
import { auditLogs } from "@/db/schema/index";
import type { NextRequest } from "next/server";

export async function writeAuditLog(
  request: NextRequest,
  input: { userEmail?: string; action: string; resource: string; resourceId?: number; details?: Record<string, unknown> }
) {
  try {
    const db = await getDb();
    await db.insert(auditLogs).values({
      userEmail: input.userEmail || null,
      action: input.action,
      resource: input.resource,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null,
      details: { ...(input.details || {}), ...(input.resourceId ? { resourceId: input.resourceId } : {}) },
    });
  } catch (error) {
    console.error("Audit log write failed", error);
  }
}
