# Metrik Media Indonesia — Product Requirements Document

## 1. Project Overview

**Project Name:** Metrik Media Indonesia  
**Product Type:** Modern Digital News & Publishing Platform  
**Primary Approach:** Mobile-First, Responsive, Editorial Workflow Driven  
**Primary Goal:** Build a professional news publishing ecosystem with a strong public reading experience, editorial CMS, and public journal submission workflow.

Metrik Media Indonesia must not be treated as a simple news website with basic article CRUD. The product should be built as a complete publishing platform consisting of:

- Public news portal
- Editorial newsroom
- Contributor/public journal submission system
- Content moderation and revision workflow
- Media library
- SEO infrastructure
- Analytics and trending system
- Advertisement management
- Role-based access control
- Secure validation and authorization

The system must be designed **mobile-first** because the majority of news consumption is expected to happen from mobile devices. However, tablet and desktop layouts must be intentionally designed and must not look like stretched mobile layouts.

---

# 2. Core Product Principles

1. Mobile-first, but fully responsive across mobile, tablet, desktop, and wide desktop.
2. No dead buttons, dead links, empty interactions, or non-functional UI controls.
3. Every input must be validated using Zod on both client and server.
4. Server-side authorization is mandatory for all protected mutations.
5. Public users must never be able to publish directly without editorial approval.
6. Rich content must be sanitized before rendering.
7. File uploads must be validated securely beyond browser MIME type.
8. Editorial actions must be auditable.
9. SEO must be part of the architecture from the beginning.
10. Performance must be optimized for news consumption and low-end/mobile devices.

---

# 3. User Roles

## 3.1 Public / Guest

Capabilities:

- View homepage
- Read articles
- Browse categories
- Browse tags
- Browse author pages
- Search articles
- View latest news
- View trending news
- View breaking news
- View public journals/opinion content
- Share articles
- Register / login

## 3.2 Registered User

Capabilities:

- All guest capabilities
- Bookmark articles
- View reading history
- Manage profile
- Submit journals/articles for editorial review
- Track submission status
- Revise rejected/requested submissions

## 3.3 Contributor

Capabilities:

- Create article/journal drafts
- Edit own drafts
- Submit drafts for review
- View review feedback
- Revise submissions
- Re-submit revisions
- View published own submissions

## 3.4 Reporter

Capabilities:

- Create newsroom articles
- Edit own newsroom drafts
- Submit articles for editorial review
- Upload media

## 3.5 Editor

Capabilities:

- Review newsroom articles
- Review public submissions
- Request revisions
- Approve articles
- Reject articles
- Schedule publication
- Publish articles
- Set breaking news
- Set editor's choice
- Manage editorial metadata

## 3.6 Admin

Capabilities:

- All editor capabilities
- Manage categories
- Manage tags
- Manage authors
- Manage users
- Manage advertisements
- Manage media library
- Manage site settings
- View audit logs
- View analytics

## 3.7 Super Admin

Capabilities:

- All admin capabilities
- Manage roles
- Manage permissions
- Manage security-sensitive settings
- Manage system-level configuration

---

# 4. Role-Based Access Control

Do not use a simplistic `isAdmin` authorization model.

Use permission-based RBAC.

Suggested permissions:

```text
article.create
article.edit_own
article.edit_any
article.review
article.approve
article.publish
article.schedule
article.delete

submission.create
submission.edit_own
submission.review
submission.reject
submission.request_revision
submission.approve
submission.convert_article

media.upload
media.delete

category.manage
tag.manage
author.manage
user.manage
ads.manage
analytics.view
audit.view
settings.manage
roles.manage
permissions.manage
```

Every protected mutation must validate permissions on the server.

---

# 5. Public Website Information Architecture

```text
/
├── latest
├── search
├── category/[slug]
├── tag/[slug]
├── author/[slug]
├── article/[slug]
├── video
├── photo
├── infographic
├── journal
│   ├── [slug]
│   └── submit
├── account
│   ├── profile
│   ├── bookmarks
│   ├── history
│   └── submissions
└── auth
    ├── login
    ├── register
    ├── forgot-password
    └── reset-password
```

---

# 6. Homepage

## 6.1 Mobile Layout

Suggested structure:

```text
Header
Search
Breaking News
Main Headline
Top Stories
Latest News
Trending / Most Read
Editor's Choice
Category Sections
Video
Photo / Gallery
Infographic
Opinion
Public Journal
Newsletter / CTA if enabled
Footer
```

## 6.2 Tablet/Desktop Layout

The layout must reflow into multi-column editorial composition.

Example:

```text
┌─────────────────────────────┬───────────────┐
│ Main Headline               │ Top Stories   │
│ Large Editorial Image       │ Story #1      │
│ Title + Excerpt             │ Story #2      │
│                             │ Story #3      │
├─────────────────────────────┼───────────────┤
│ Latest News                 │ Trending      │
└─────────────────────────────┴───────────────┘
```

Do not simply stretch the mobile layout.

---

# 7. Public Navigation

Core navigation should support configurable categories.

Default items may include:

- Home
- Latest
- Nasional
- Politik
- Ekonomi
- Bisnis
- Teknologi
- Internasional
- Lifestyle
- Sport
- Opini
- Jurnal Publik
- Video
- Foto
- Search

Categories must come from the database/CMS and must not be hardcoded permanently in the frontend.

---

# 8. Article Detail Page

## 8.1 Article Header

Must support:

- Breadcrumb
- Category
- Title
- Subtitle
- Cover image
- Image caption
- Photographer/source
- Author
- Author avatar
- Published date/time
- Updated date/time
- Reading time

## 8.2 Article Actions

Must support:

- Share to WhatsApp
- Share to Facebook
- Share to X
- Copy link
- Bookmark
- Increase font size
- Decrease font size

Every visible button must work.

If a feature is not implemented, the button must either:

1. Not be rendered, or
2. Be explicitly disabled with a visible reason.

## 8.3 Article Body Blocks

Support at minimum:

- Paragraph
- H2
- H3
- Image
- Image gallery
- Blockquote
- Pull quote
- Bullet list
- Numbered list
- Table
- Video embed
- Hyperlink
- Related article embed

Arbitrary executable HTML must not be accepted.

## 8.4 Post-Article Section

Must include:

- Tags
- Author information
- Related stories
- Recommended stories
- Latest stories
- Popular stories

---

# 9. Breaking News

Suggested fields:

```text
isBreakingNews
breakingNewsPriority
breakingNewsStartAt
breakingNewsEndAt
```

Breaking news must support automatic expiration.

Expired breaking news items must automatically disappear from the ticker without requiring manual removal.

---

# 10. Search

Search should index more than exact article titles.

Searchable data:

- Title
- Subtitle
- Excerpt
- Content
- Author
- Category
- Tags
- Keywords

Filters:

- Keyword
- Category
- Author
- Date range
- Sort by relevance
- Sort newest
- Sort oldest
- Sort most popular

Search results must have:

- Loading state
- Empty state
- Error state
- Result count
- Pagination/cursor navigation

---

# 11. Trending / Most Read

Do not calculate trending purely from page refresh count.

Suggested event model:

```text
article_views
- id
- articleId
- sessionHash
- ipHash
- userAgentHash
- createdAt
```

Aggregated statistics:

```text
views_1h
views_24h
views_7d
views_total
```

These can power:

- Trending Now
- Most Read Today
- Most Read This Week

Avoid expensive raw aggregate queries on every homepage request.

---

# 12. Public Journal Submission

This is a core differentiator of Metrik Media Indonesia.

Public users must **never publish directly**.

Required workflow:

```text
Registered User
      ↓
Create Draft
      ↓
Submit
      ↓
Editorial Review
      ├── Revision Requested
      ├── Rejected
      └── Approved
              ↓
          Scheduled / Published
```

---

# 13. Journal Submission Form

## 13.1 Title

Requirements:

```ts
z.string()
  .trim()
  .min(10)
  .max(180)
```

## 13.2 Subtitle

```ts
z.string()
  .trim()
  .max(250)
  .optional()
```

## 13.3 Category

Use a database-backed dropdown.

The server must confirm that the category ID exists.

## 13.4 Content Type

Suggested options:

- Opini
- Jurnal
- Analisis
- Citizen Report

## 13.5 Excerpt / Summary

Suggested validation:

```ts
z.string()
  .trim()
  .min(80)
  .max(400)
```

Show live character counter.

## 13.6 Rich Content Editor

Must support:

- Paragraph
- H2
- H3
- Bullet list
- Numbered list
- Quote
- Link
- Image
- Table

Use a structured rich-text/block editor.

Do not allow arbitrary JavaScript or uncontrolled HTML.

## 13.7 Cover Image

Allowed image types:

- JPEG
- PNG
- WEBP

Suggested size limit:

- Maximum 5 MB

Must validate:

- File extension
- MIME type
- Magic bytes/file signature
- File size
- Image dimensions

Never trust only `file.type` from the browser.

## 13.8 Author Information

Registered account should already contain:

- Name
- Profile photo
- Bio
- Email
- Social links

Submission should reuse stored profile information.

## 13.9 Publication Declarations

Require checkboxes such as:

- User declares they have rights to publish the submitted content.
- User agrees to editorial/publication policies.
- User understands the editorial team may revise or reject content.

These declarations must be validated on the server.

---

# 14. Contributor Dashboard

Sections:

- All Submissions
- Draft
- Submitted
- Under Review
- Revision Requested
- Approved
- Scheduled
- Published
- Rejected

Each submission card should show:

- Title
- Category
- Submission date
- Status
- Last update
- Editorial note if available
- Primary action

Example status-specific actions:

- Draft → Edit
- Submitted → View
- Revision Requested → Revise
- Published → View Article
- Rejected → View Reason

---

# 15. Editorial Revision Workflow

Editors must be able to leave review notes.

Workflow:

```text
Submission
    ↓
UNDER_REVIEW
    ↓
REVISION_REQUESTED
    ↓
Contributor edits
    ↓
Resubmit
    ↓
UNDER_REVIEW
```

Revision history must not be overwritten.

Store previous submission versions or revision snapshots.

---

# 16. Editorial Dashboard

Dashboard should contain:

- Awaiting Review count
- Revision Requested count
- Scheduled count
- Published Today count
- Rejected count

Editorial queue filters:

- Status
- Category
- Writer
- Submission date
- Content type

Queue data should include:

- Article title
- Writer
- Category
- Submitted date/time
- Status
- Actions

---

# 17. Admin Article Editor

Required fields:

- Title
- Slug
- Subtitle
- Excerpt
- Category
- Tags
- Cover image
- Content editor
- SEO title
- Meta description
- Canonical URL
- OG image
- Author
- Publish date
- Schedule date/time
- Article status
- Breaking News toggle
- Editor's Choice toggle
- Featured toggle
- Allow Comments toggle if comments are enabled

---

# 18. Editorial Statuses

Use a real editorial state machine.

Recommended statuses:

```text
DRAFT
SUBMITTED
UNDER_REVIEW
REVISION_REQUESTED
APPROVED
SCHEDULED
PUBLISHED
REJECTED
ARCHIVED
```

Do not reduce editorial workflow to only `draft` and `published`.

---

# 19. Article Preview

Editors/reporters must be able to preview unpublished articles.

Requirements:

- Production-like rendering
- Not publicly indexed
- Secure access
- Preview token/session authorization
- Preview must reflect current draft content

---

# 20. Scheduled Publishing

Editors can choose:

- Publish now
- Schedule publication

Scheduled articles must automatically transition:

```text
SCHEDULED → PUBLISHED
```

when the publication time is reached.

---

# 21. Media Library

Required features:

- Upload media
- Search media
- Filter images/videos
- Preview
- Edit alt text
- Edit caption
- Reuse media in articles
- Delete based on permission

Suggested metadata:

```text
id
filename
storageKey
mimeType
width
height
size
altText
caption
uploadedBy
createdAt
```

Do not store image binary/Base64 directly in the relational database.

---

# 22. Advertisement Management

Suggested ad placements:

```text
HOME_TOP
HOME_MIDDLE
ARTICLE_TOP
ARTICLE_MIDDLE
ARTICLE_BOTTOM
SIDEBAR
CATEGORY_TOP
```

Advertisement fields:

- Campaign name
- Image/mobile asset
- Image/desktop asset
- Target URL
- Start date
- End date
- Placement
- Active status
- Priority

Mobile and desktop assets should be independently configurable when needed.

---

# 23. Author Pages

Route:

```text
/author/[slug]
```

Contents:

- Name
- Profile image
- Bio
- Social links
- Total published articles
- Latest articles

---

# 24. Category Pages

Route:

```text
/category/[slug]
```

Contents:

- Category header
- Featured/category hero
- Latest articles
- Trending articles
- Editor's Choice
- Pagination/load more

---

# 25. Tag Pages

Route:

```text
/tag/[slug]
```

Used for internal linking, topic clusters, and SEO.

---

# 26. Bookmark System

Registered users can bookmark articles.

Suggested table:

```text
user_bookmarks
```

Route:

```text
/account/bookmarks
```

---

# 27. Reading History

Registered users may see recent reading history.

Requirements:

- User-owned only
- Paginated
- Can be cleared by user
- Should not block public reading if tracking fails

---

# 28. User Account Area

Mobile-first account sections:

- Profile
- My Journals
- Bookmarks
- Reading History
- Account Settings
- Security
- Logout

---

# 29. SEO Requirements

Every article must support:

- HTML title
- Meta description
- Canonical URL
- OpenGraph metadata
- Twitter/X card metadata
- Article JSON-LD
- BreadcrumbList JSON-LD
- Person JSON-LD
- Organization JSON-LD
- WebSite JSON-LD

Required routes/files:

```text
/sitemap.xml
/news-sitemap.xml
/robots.txt
/rss.xml
```

SEO must not be left for a future phase.

---

# 30. Mobile-First Responsive Rules

Recommended breakpoint intent:

```text
320–639px   → Mobile
640–1023px  → Tablet
1024–1439px → Desktop
1440px+     → Wide Desktop
```

Do not create separate codebases.

Use the same content architecture with different responsive composition.

---

# 31. Mobile Bottom Navigation

If an app-like mobile navigation is used:

- Home
- Latest
- Categories
- Search
- Account

Desktop must use a normal top navigation/header layout.

Do not keep mobile bottom navigation on desktop.

---

# 32. No Dead Button Policy

Every visible interactive element must be in one of three states:

1. Fully functional
2. Explicitly disabled with a clear explanation
3. Not rendered

This applies to:

- Buttons
- Icon buttons
- Links
- Dropdowns
- Tabs
- Filters
- Pagination
- Breadcrumbs
- Share controls
- Bookmark controls
- Search
- Forms
- Menus
- CTA buttons

No placeholder interactions are allowed in production.

---

# 33. Zod Validation Architecture

Zod must be used on both client and server.

Required pipeline:

```text
User Input
   ↓
Client Zod Validation
   ↓
Server Request
   ↓
Server Zod Validation
   ↓
Authentication
   ↓
Authorization
   ↓
Business Rule Validation
   ↓
Sanitization
   ↓
Database
```

Client-side validation improves UX.

Server-side validation is the source of truth.

---

# 34. Shared Zod Schema Example

```ts
export const createArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10)
    .max(180),

  subtitle: z
    .string()
    .trim()
    .max(250)
    .optional(),

  excerpt: z
    .string()
    .trim()
    .min(50)
    .max(400),

  categoryId: z
    .string()
    .uuid(),

  tags: z
    .array(z.string().uuid())
    .max(10),

  content: articleContentSchema,

  coverImageId: z
    .string()
    .uuid(),

  status: z.enum([
    "DRAFT",
    "SUBMITTED"
  ])
});
```

---

# 35. Referential Validation

Zod validates input format but does not prove referenced data exists.

Example:

```ts
categoryId: z.string().uuid()
```

This only confirms valid UUID syntax.

The server must still verify that the category exists and is usable.

Apply the same logic to:

- Category
- Tag
- Author
- Media
- Article
- User
- Role
- Submission

---

# 36. Rich Content Sanitization

Required content pipeline:

```text
Rich Editor JSON
      ↓
Zod Schema
      ↓
Allowed Block Validation
      ↓
URL Sanitization
      ↓
Safe HTML Rendering
```

Reject or strip dangerous content such as:

- `<script>`
- `javascript:` URLs
- inline event handlers
- uncontrolled iframes
- `onclick`
- `onerror`

---

# 37. File Upload Security

Never use the raw user filename as the storage filename.

Generate safe random storage keys, for example:

```text
UUID.webp
```

Validate:

- File extension
- MIME type
- Magic bytes
- File size
- Dimensions
- Allowed media category

Upload endpoints must be rate-limited.

---

# 38. Rate Limiting

Suggested baseline limits:

```text
Login           → 5 attempts / minute
Register        → 5 attempts / minute
Forgot Password → 5 attempts / 15 minutes
Submission      → 5 submissions / hour
Upload          → 20 uploads / hour
Search          → 60 requests / minute
```

The exact limits can be tuned after real traffic data becomes available.

---

# 39. Ownership Validation

All user-owned resources must validate ownership on the server.

Example:

```text
PATCH /submission/:id
```

Before update:

```text
submission.userId === session.user.id
```

unless the user has elevated editorial permissions.

This prevents IDOR vulnerabilities.

---

# 40. Suggested Core Database Tables

```text
users
sessions
accounts

roles
permissions
role_permissions
user_roles

authors

articles
article_revisions
article_views

categories
tags
article_tags

media

journal_submissions
submission_revisions
editorial_reviews

bookmarks
reading_history

advertisements
notifications

audit_logs
site_settings
```

---

# 41. Suggested Article Model

```text
id
title
slug
subtitle
excerpt
content

authorId
categoryId
coverMediaId

status

publishedAt
scheduledAt

isFeatured
isBreaking
isEditorsChoice

seoTitle
seoDescription
canonicalUrl

createdBy
updatedBy

createdAt
updatedAt
deletedAt
```

---

# 42. Audit Log

Editorial/admin actions must be auditable.

Suggested fields:

```text
id
userId
action
resourceType
resourceId
oldValue
newValue
ipAddress
userAgent
createdAt
```

Examples of audited actions:

- Publish article
- Update article
- Delete article
- Approve journal
- Reject journal
- Request revision
- Change role
- Delete media
- Change site settings

---

# 43. Autosave

Article editors and contributor editors must support autosave.

Recommended behavior:

- Debounce save 2–5 seconds after user stops typing
- Show `Saving...`
- Show `Saved` state
- Avoid saving on every keystroke
- Handle save failure visibly
- Preserve last safe draft

---

# 44. Unsaved Changes Protection

If there are unsaved changes and the user attempts to leave the editor, show a warning.

Do not silently discard long-form content.

---

# 45. Pagination and Query Efficiency

Do not fetch all articles and filter on the client.

Prefer:

- Server-side pagination
- Cursor pagination for large feeds
- Indexed queries
- Cached aggregates for trending metrics

---

# 46. Loading, Empty, Error, and Success States

Every major module must support:

- Loading state
- Skeleton state
- Empty state
- Error state
- Success state

No blank pages should appear when there is no data.

---

# 47. Responsive Admin Tables

Desktop may use tables.

Mobile should transform dense tables into cards/list rows where necessary.

Example desktop:

```text
Title | Author | Category | Date | Status | Actions
```

Example mobile:

```text
Title
Category
Author • Date
Status
Primary Action
```

Avoid horizontal scrolling for primary workflows whenever possible.

---

# 48. Performance Targets

Recommended Core Web Vitals targets:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Required optimization areas:

- SSR/Server rendering where appropriate
- Responsive images
- Image optimization
- Lazy loading
- CDN
- Database indexes
- Pagination
- Caching
- Avoid excessive client-side JavaScript
- Avoid unnecessary animation libraries
- Optimize fonts
- Use skeletons intentionally

Homepage must remain light even when feature-rich.

---

# 49. Admin Information Architecture

```text
/admin
├── dashboard
├── editorial
├── articles
├── submissions
├── categories
├── tags
├── authors
├── users
├── media
├── advertisements
├── analytics
├── audit-log
└── settings
```

---

# 50. MVP Priority

## P0 — Mandatory Before Launch

- Homepage
- Article detail
- Category page
- Tag page
- Author page
- Latest news
- Search
- Authentication
- Public journal submission
- Contributor dashboard
- Editorial review
- Revision workflow
- Article publishing
- Scheduled publishing
- Article CMS
- Category CMS
- Tag CMS
- Media library
- Breaking News
- Editor's Choice
- Trending / Most Read
- SEO metadata
- Sitemap
- News Sitemap
- RSS
- Responsive mobile/tablet/desktop layout
- Client-side Zod validation
- Server-side Zod validation
- RBAC
- Ownership validation
- File validation
- Rich content sanitization
- Rate limiting
- Audit logs

## P1 — Strong Post-Launch Features

- Bookmark
- Reading history
- Notifications
- Video
- Photo gallery
- Infographics
- Advertisement manager
- Analytics dashboard

## P2 — Optional / Growth Features

- Comments
- Follow author
- Personalized recommendations
- Newsletter automation
- Advanced recommendation engine

Comments should not block MVP launch because they introduce moderation, spam, and abuse-management complexity.

---

# 51. Security Requirements

The system must include:

- Zod validation client-side
- Zod validation server-side
- Server-side authorization
- Role/permission checks
- Resource ownership checks
- HTML/rich text sanitization
- Secure file upload validation
- Rate limiting
- Secure session handling
- Secure cookies when applicable
- CSRF/origin protection for mutations where applicable
- Audit logs
- Input normalization
- Database constraints
- Transaction-safe critical mutations
- Safe error responses
- No stack trace exposed to public users

Zod must never be treated as the only security mechanism.

---

# 52. Database and Business Validation Rules

Examples:

- Category must exist before article creation.
- Tag IDs must exist before article-tag relationships are written.
- Author must be active.
- User must have permission before publishing.
- A contributor cannot modify another contributor's submission.
- Rejected submissions cannot publish directly.
- Scheduled articles require a future publication timestamp.
- Published articles require valid author/category/content.
- Breaking News expiry must be greater than start time.
- Advertisement end date must be after start date.

Database-level constraints should complement Zod validations whenever possible.

---

# 53. Standard API/Error Behaviour

Use consistent structured responses.

Example success:

```json
{
  "success": true,
  "data": {}
}
```

Example validation error:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Data yang dikirim tidak valid.",
  "fieldErrors": {}
}
```

Do not expose database/internal stack details.

---

# 54. Accessibility Requirements

At minimum:

- Semantic HTML
- Keyboard accessible controls
- Visible focus states
- Proper form labels
- Alt text support
- Adequate color contrast
- Touch targets approximately 44px minimum
- Accessible modals/dialogs
- Accessible navigation
- ARIA only where needed

---

# 55. Definition of Done / Acceptance Checklist

- [ ] No dead buttons
- [ ] No dead routes
- [ ] No placeholder menu items in production
- [ ] Every form has a Zod schema
- [ ] Client-side validation works
- [ ] Server-side validation works
- [ ] Every protected mutation checks authorization
- [ ] Contributor can only modify owned resources unless elevated permission exists
- [ ] File uploads validate MIME + extension + magic bytes
- [ ] File uploads have size limits
- [ ] Rich content is sanitized
- [ ] Rate limiting is active on sensitive/public endpoints
- [ ] API errors use a consistent response structure
- [ ] Errors are understandable for users
- [ ] Loading states exist
- [ ] Skeleton states exist where appropriate
- [ ] Empty states exist
- [ ] Success states exist
- [ ] Mobile works at 320px width
- [ ] No unwanted page-level horizontal overflow
- [ ] Main mobile touch targets are approximately 44px minimum
- [ ] Tablet layout is intentionally designed
- [ ] Desktop uses available width properly
- [ ] Navigation is responsive
- [ ] Dense tables become mobile-friendly cards/lists when necessary
- [ ] Images are responsive
- [ ] Article SEO metadata exists
- [ ] Canonical URLs are correct
- [ ] Article structured data is valid
- [ ] Sitemap exists
- [ ] News sitemap exists
- [ ] RSS exists
- [ ] Autosave works
- [ ] Unsaved-change protection works
- [ ] Revision history works
- [ ] Editorial workflow works end-to-end
- [ ] Scheduled publishing works
- [ ] Breaking News expiration works
- [ ] Audit log works
- [ ] No critical console errors
- [ ] No hydration errors
- [ ] No unresolved TypeScript errors
- [ ] No production mutation bypasses server-side validation
- [ ] No production mutation bypasses authorization

---

# 56. Product Architecture Summary

```text
                    METRIK MEDIA INDONESIA
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
       READER            CONTRIBUTOR        NEWSROOM
          │                  │                  │
     Read News          Submit Journal       Reporter
       Search              Draft              Editor
      Bookmark             Review             Admin
          │                Revision             │
          └──────────────────┼──────────────────┘
                             │
                       CONTENT ENGINE
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
         SEO               MEDIA            ANALYTICS
          │                  │                  │
     Sitemap/RSS        Media Library      Trending/Views
```

The final product should behave as a complete digital publishing ecosystem rather than a simple news portal.

---

# 57. Final Engineering Directive

When implementing this specification:

1. Do not skip features silently.
2. Do not create fake buttons or placeholder interactions.
3. Do not rely only on frontend validation.
4. Do not rely only on Zod for security.
5. Do not allow public direct publishing without editorial approval.
6. Do not store unsafe arbitrary HTML.
7. Do not trust uploaded filenames or browser-reported MIME types.
8. Do not expose admin-only actions to unauthorized users.
9. Do not load entire datasets into the browser unnecessarily.
10. Do not compromise mobile usability for desktop aesthetics.
11. Do not compromise desktop/tablet quality simply because the product is mobile-first.
12. Treat all server inputs as untrusted.
13. Treat accessibility, SEO, performance, and security as release requirements.
14. Ensure every major flow works end-to-end before marking the feature complete.

