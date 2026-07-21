import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { AREA_CFG } from "../data/dashboard";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  const db = drizzle(sql, { schema });

  for (const [area, cfg] of Object.entries(AREA_CFG)) {
    // Only backfill if lat is still 0 (fresh column). Preserves any manual edits.
    const [existing] = await db
      .select()
      .from(schema.areaSettings)
      .where(eq(schema.areaSettings.area, area));

    const payload = {
      lat: cfg.lat,
      lng: cfg.lng,
      shortName: cfg.shortName,
      trend: cfg.trend,
      trendValue: cfg.trendValue,
      participants: cfg.participants,
      mdProgress: cfg.mdProgress,
      activeItems: cfg.activeItems,
    };

    if (!existing) {
      await db.insert(schema.areaSettings).values({
        area,
        pksStatus: cfg.pksStatus,
        newStores: cfg.newStores,
        ...payload,
      });
      console.log(`  + inserted ${area}`);
      continue;
    }

    if (existing.lat === 0 && existing.lng === 0) {
      await db
        .update(schema.areaSettings)
        .set(payload)
        .where(eq(schema.areaSettings.area, area));
      console.log(`  ~ backfilled ${area}`);
    } else {
      console.log(`  = skipped ${area} (already has coords)`);
    }
  }
  console.log("done");
}

main().catch((e) => { console.error(e); process.exit(1); });
