import { describe, expect, it } from "vitest";
import { sanitizeRichHtml } from "@/lib/content-sanitizer";
import { canTransitionArticle, canTransitionSubmission } from "@/lib/editorial-state";

describe("content safety", () => {
  it("removes scripts, handlers, unsafe URLs, and unapproved iframes", () => {
    const html = sanitizeRichHtml(
      `<p onclick="alert(1)">Safe</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><iframe src="https://evil.example/embed"></iframe><iframe src="https://www.youtube.com/embed/ok"></iframe>`
    );
    expect(html).not.toContain("script");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("evil.example");
    expect(html).toContain("youtube.com/embed/ok");
  });
});

describe("editorial state transitions", () => {
  it("allows valid article transitions and rejects invalid jumps", () => {
    expect(canTransitionArticle("draft", "submitted")).toBe(true);
    expect(canTransitionArticle("published", "draft")).toBe(false);
  });

  it("requires a reviewable submission before approval", () => {
    expect(canTransitionSubmission("under_review", "approved")).toBe(true);
    expect(canTransitionSubmission("draft", "approved")).toBe(false);
  });
});
