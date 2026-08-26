const baseUrl = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const checks = [
  { path: "/", contentType: "html" },
  { path: "/latest", contentType: "html" },
  { path: "/video", contentType: "html" },
  { path: "/foto", contentType: "html" },
  { path: "/robots.txt", contentType: "text" },
  { path: "/sitemap.xml", contentType: "xml" },
  { path: "/news-sitemap.xml", contentType: "xml" },
  { path: "/rss.xml", contentType: "xml" },
  { path: "/api/health/live", contentType: "json" },
];

let failed = false;

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;
  try {
    const response = await fetch(url, { redirect: "manual" });
    const contentType = response.headers.get("content-type") || "";
    const typeMatches =
      check.contentType === "html" ? contentType.includes("text/html") :
      check.contentType === "xml" ? contentType.includes("xml") :
      check.contentType === "json" ? contentType.includes("json") : true;

    if (!response.ok || !typeMatches) {
      failed = true;
      console.error(`FAIL ${check.path}: status=${response.status}, content-type=${contentType}`);
      continue;
    }
    console.log(`PASS ${check.path}: ${response.status}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${check.path}: ${error instanceof Error ? error.message : "request failed"}`);
  }
}

if (failed) process.exitCode = 1;
