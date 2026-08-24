import { and, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import { getDb } from "@/db/index";
import { advertisements } from "@/db/schema/index";
import { withRedisCache } from "@/lib/redis";

export type ActiveAdvertisement = {
  id: number;
  title: string;
  image: string | null;
  desktopImage: string | null;
  mobileImage: string | null;
  position: string;
};

export async function getActiveAdvertisements(position: string, limit = 1): Promise<ActiveAdvertisement[]> {
  const now = new Date();
  return withRedisCache(`advertisements:${position}:${limit}`, 60, async () => {
    const db = await getDb();
    return db
      .select({ id: advertisements.id, title: advertisements.title, image: advertisements.image, desktopImage: advertisements.desktopImage, mobileImage: advertisements.mobileImage, position: advertisements.position })
      .from(advertisements)
      .where(and(
        eq(advertisements.position, position),
        eq(advertisements.status, "active"),
        or(isNull(advertisements.startDate), lte(advertisements.startDate, now)),
        or(isNull(advertisements.endDate), gte(advertisements.endDate, now))
      ))
      .orderBy(desc(advertisements.createdAt))
      .limit(limit);
  });
}
