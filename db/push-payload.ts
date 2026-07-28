import { getPayload } from "payload";
import config from "../payload.config";

async function pushSchema() {
  console.log("Pushing Payload schema to database...");
  const payload = await getPayload({ config });
  console.log("Schema push complete.");
  process.exit(0);
}

pushSchema().catch((err) => {
  console.error("Schema push failed:", err);
  process.exit(1);
});
