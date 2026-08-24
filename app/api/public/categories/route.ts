import { NextResponse } from "next/server";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("GET /api/public/categories error:", error);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
