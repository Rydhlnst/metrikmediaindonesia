# Launch Readiness Matrix

This matrix is the implementation trace for the PRD. `Implemented` means the
code path exists; `Verified` requires the listed automated or browser check.

## P0 — Launch gate

| Requirement | Implementation | Status | Verification |
| --- | --- | --- | --- |
| Homepage, article detail, category, tag, author, latest | `app/(public)` routes and `lib/queries.ts` | Implemented | Public route smoke tests |
| Search | `/pencarian`, `/api/articles` | Partial | Search filters, pagination, empty/error browser checks |
| Authentication | Better Auth routes and auth pages | Implemented | Auth flow smoke tests |
| Public submission | `/submit`, `/api/submissions` | Implemented | Ownership and workflow integration tests |
| Contributor dashboard | `/dashboard/my-articles`, submissions pages | Implemented | Contributor browser flow |
| Editorial review and revisions | Article/submission state machines and review APIs | Implemented | Transition and review integration tests |
| Article publishing and scheduling | Article APIs and `/api/cron/publish-scheduled` | Implemented | Idempotency and future-date tests |
| Article/category/tag CMS | Dashboard pages and protected APIs | Implemented | Protected mutation tests |
| Media library and secure uploads | `/dashboard/media`, `/api/media`, `/api/upload` | Partial | Zod, ownership, signature, and upload tests |
| Breaking News and Editor’s Choice | Article flags and public queries | Implemented | Expiration and visibility tests |
| Trending / Most Read | View events and rollups | Implemented | Dedupe and rollup tests |
| SEO metadata and structured data | Metadata generators and JSON-LD components | Implemented | Metadata and structured-data tests |
| Sitemap, News Sitemap, RSS, robots | App metadata routes | Implemented | XML and route smoke tests |
| Responsive public/admin layout | Existing responsive components | Partial | 320px/tablet/desktop browser checks |
| Client/server Zod validation | Shared validators and API handlers | Partial | Validator coverage and mutation tests |
| RBAC and ownership | Server session, permissions, protected APIs | Partial | Unauthorized, IDOR, and privilege tests |
| File validation and sanitization | `lib/image-utils.ts`, `lib/content-sanitizer.ts` | Implemented | Signature and sanitization tests |
| Rate limiting | `lib/rate-limit.ts` and sensitive routes | Partial | Rate-limit tests and endpoint audit |
| Audit logs | `lib/audit-log.ts` and editorial mutations | Partial | Mutation audit assertions |

## P1 — Immediate post-launch

| Requirement | Implementation | Status | Verification |
| --- | --- | --- | --- |
| Bookmarks | `/api/bookmarks`, bookmark UI | Implemented | Authenticated bookmark flow |
| Reading history | `/api/reading-history`, tracker | Implemented | Authenticated history flow |
| Notifications | Notification APIs and dashboard bell | Implemented | Recipient and ownership tests |
| Video and photo sections | `/video`, `/foto` routes | Implemented | Public route smoke tests |
| Advertisement manager | Dashboard and advertisement APIs | Implemented | Protected CRUD tests |
| Analytics dashboard | `/dashboard/analytics`, `/api/stats` | Implemented | Permission and bounded-query checks |
| Comments | Public submission and moderation APIs | Implemented | Abuse, moderation, and status tests |

## Operational gates

- Production Compose bootstraps only the admin/access-control data by default.
- Demo article fixtures require the explicit `demo` Compose profile.
- Production readiness must pass database, Redis, MinIO, migration, email, and
  configuration checks before the app is considered deployable.
- Domain, HTTPS, Cloudflare, backups, and Search Console remain environment
  checks and cannot be verified from the repository alone.
