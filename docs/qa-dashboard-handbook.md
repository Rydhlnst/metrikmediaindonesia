# Metrik Media Indonesia — Dashboard QA Handbook

Live URL tested: https://metrikmediaindonesia.beres.io/dashboard

Test date: 2026-08-30

Account used: administrator account supplied for QA. Credentials are intentionally not stored in this document.

## Login and logout

1. Open the dashboard URL. Unauthenticated visitors are redirected to `/login?redirect=%2Fdashboard`.
2. Enter the administrator email and password, then select **Masuk ke Dashboard**.
3. The dashboard opens with the summary cards, charts, recent articles, and recent comments.
4. Select the **Admin Metrik Media** account control in the sidebar footer.
5. Select **Keluar**. QA result: the session ended and the browser returned to the public homepage.

Evidence: `C:/Users/LENOVO/.codex/visualizations/2026/08/26/01a03cf6-059f-78b2-8574-bac2604ea870/live-dashboard/dashboard-account-dropdown.png`

## Route evidence

All listed routes were opened on the live deployment and one screenshot was saved per route. A route marked **PASS** stayed on its requested URL and did not show a visible error in the accessibility snapshot.

| Route | Handbook description | Result | Screenshot |
|---|---|---|---|
| `/dashboard` | Executive overview: counts, charts, recent articles, and comments. | PASS | `dashboard.png` |
| `/dashboard/analytics` | Traffic and performance analytics. | PASS | `dashboard-analytics.png` |
| `/dashboard/editorial` | Editorial workflow board for review and publishing. | PASS | `dashboard-editorial.png` |
| `/dashboard/articles` | Article list and editorial actions. | PASS | `dashboard-articles.png` |
| `/dashboard/submissions` | User-submission review queue. | PASS | `dashboard-submissions.png` |
| `/dashboard/topics` | Topic management. | PASS | `dashboard-topics.png` |
| `/dashboard/locations` | Location and region management. | PASS | `dashboard-locations.png` |
| `/dashboard/entities` | Entity relationship management. | PASS | `dashboard-entities.png` |
| `/dashboard/categories` | Category management. | PASS | `dashboard-categories.png` |
| `/dashboard/tags` | Tag management. | PASS | `dashboard-tags.png` |
| `/dashboard/authors` | Author management. | PASS | `dashboard-authors.png` |
| `/dashboard/seo-health` | SEO health and pre-publish checks. | PASS | `dashboard-seo-health.png` |
| `/dashboard/redirects` | 301 redirect management. | PASS | `dashboard-redirects.png` |
| `/dashboard/media` | Media library and asset management. | PASS | `dashboard-media.png` |
| `/dashboard/comments` | Comment moderation. | PASS | `dashboard-comments.png` |
| `/dashboard/advertisements` | Advertisement and sponsored-content management. | PASS | `dashboard-advertisements.png` |
| `/dashboard/pages` | Static-page management. | PASS | `dashboard-pages.png` |
| `/dashboard/users` | User administration. | PASS | `dashboard-users.png` |
| `/dashboard/roles` | Role and access management. | PASS | `dashboard-roles.png` |
| `/dashboard/settings` | Global site and SEO settings. | PASS | `dashboard-settings.png` |
| `/dashboard/profile` | Current administrator profile. | PASS | `dashboard-profile.png` |
| `/dashboard/my-articles` | Articles owned by the current user. | PASS | `dashboard-my-articles.png` |
| `/dashboard/business-publications` | Business publication submissions. | PASS | `dashboard-business-publications.png` |
| `/dashboard/articles/new` | Create a new article. | PASS | `dashboard-articles-new.png` |
| `/dashboard/authors/new` | Create an author. | PASS | `dashboard-authors-new.png` |
| `/dashboard/categories/new` | Create a category. | PASS | `dashboard-categories-new.png` |
| `/dashboard/tags/new` | Create a tag. | PASS | `dashboard-tags-new.png` |
| `/dashboard/pages/new` | Create a static page. | PASS | `dashboard-pages-new.png` |
| `/dashboard/roles/new` | Create a role. | PASS | `dashboard-roles-new.png` |
| `/dashboard/advertisements/new` | Create an advertisement banner. | PASS | `dashboard-advertisements-new.png` |
| `/dashboard/articles/1/edit` | Edit an existing article. | PASS | `dashboard-articles-1-edit.png` |
| `/dashboard/articles/revisions/1` | Review article revision history. | PASS | `dashboard-articles-revisions-1.png` |
| `/dashboard/authors/1/edit` | Edit an existing author. | PASS | `dashboard-authors-1-edit.png` |
| `/dashboard/categories/9/edit` | Edit an existing category. | PASS | `dashboard-categories-9-edit.png` |
| `/dashboard/tags/8/edit` | Edit an existing tag. | PASS | `dashboard-tags-8-edit.png` |
| `/dashboard/roles/1/edit` | Edit an existing role. | PASS | `dashboard-roles-1-edit.png` |

Evidence directory:

`C:/Users/LENOVO/.codex/visualizations/2026/08/26/01a03cf6-059f-78b2-8574-bac2604ea870/live-dashboard/`

## Edge-case results

- `/dashboard/submissions/1` returned to `/dashboard/submissions` because no submission with ID `1` was available.
- `/dashboard/advertisements/1/edit` returned to `/dashboard/advertisements` because no advertisement with ID `1` was available.
- `/dashboard/pages/1/edit` returned to `/dashboard/pages` because no static page with ID `1` was available.
- `/dashboard/business-publications/1` produced an error state for the unavailable record. Confirm whether this should be a consistent 404 page or a list redirect.

## QA findings

- PASS: Admin authentication and dashboard authorization.
- PASS: Sidebar route links resolve for the tested dashboard inventory.
- PASS: Account dropdown opens and exposes **Profil Saya** and **Keluar**.
- PASS: Logout invalidates the session and returns to the public homepage.
- PASS: No hydration error or critical browser console error was observed during the route sweep.
- Fixed: Article editor pages no longer register duplicate TipTap `link` and `underline` extensions. Recheck the browser console after deployment.
- Fixed in source: unavailable business-publication records now redirect to `/dashboard/business-publications` on a 404. Recheck the live route after deployment.
- Follow-up: repeat the same sweep at 320px, tablet, and desktop widths, then test mutations with controlled test records.
