# Typewriter

A minimal, vintage-inspired blog platform built with Next.js, TRPC and Drizzle.

## Quick setup

Prerequisites
- Node.js 18+ (recommended)
- A Postgres database (Neon or any Postgres-compatible)
- Set environment variables in a `.env` file (at minimum):
  - DATABASE_URL=postgresql://user:pass@host:port/db

Local run
1. Install dependencies
   - npm install
2. Ensure your database is reachable and migrations (if any) are applied.
   - If using Drizzle migrations / drizzle-kit, run your migration commands (project-specific).
3. Start dev server
   - npm run dev
4. Open the app
   - http://localhost:3000

Build / production
- npm run build
- npm start

Notes
- The project expects an accessible Postgres instance. Adjust `DATABASE_URL` accordingly.
- Server-side TRPC routes use Drizzle ORM; confirm schema/migrations before running in production.

---

## Tech stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- TRPC (server + client)
- @tanstack/react-query (data fetching / caching)
- Drizzle ORM (database)
- TipTap (rich text editor)
- Sonner (toasts)
- Radix UI primitives (checkbox, label, etc.)
- Lucide icons

---

## Features implemented

Priority 1 (MVP)
- [x] View all posts (listing)
- [x] View single post page
- [x] Create post (form with title, author, content, categories)
- [x] Update post
- [x] Delete post (mutation + invalidation)
- [x] Categories list and filter posts by category
- [x] Rich text editor (TipTap) integrated with the form
- [x] TRPC + Drizzle backend with typed client/server
- [x] Client side validation for required fields

Priority 2
- [x] Save as Draft feature (published flag toggled when saving draft)
- [x] Server-side prefetching and hydration (dehydrate + HydrationBoundary)
- [x] Inline loading states (converted to useQuery for per-section loaders)
- [x] Controlled TipTap component (value/onChange)
- [x] Localized UI to show Draft badge on cards
- [x] Category checkbox inputs bound to form state (native input fallback)

Priority 3 (not implemented / partial)
- [ ] Authentication / user accounts
- [ ] Image uploads / media handling
- [ ] Full-text search / pagination
- [ ] Tests / E2E

---

## Implementation notes & trade-offs / decisions

- TRPC + Drizzle chosen for full-stack type safety and predictable queries/mutations.
- Prefetching + Hydration used on the posts page for faster first paint. To keep section-level loaders, some queries were switched from Suspense (`useSuspenseQuery`) to `useQuery`, enabling `isLoading` checks and inline skeletons.
- TipTap was wrapped into a controlled React component (value/onChange) so it can work with the form state and validations. Validator strips HTML tags to validate content presence.
- Category checkboxes use native `<input type="checkbox" />` bound to the form state to ensure clicks and accessibility work reliably. If you prefer a custom Checkbox component, ensure it forwards native input props (checked, onChange, id, name).
- Server router returns consistent types (empty arrays) instead of mixed types (e.g. `["No Data"]`) so clients can rely on shape checks like `posts.length`.
- UX: A full-screen skeleton was added for initial Suspense fallbacks in some places; other sections use inline skeletons. You can change to global Suspense or more granular per-component skeletons depending on desired UX.
- Validation vs draft: Save-as-draft bypasses some submission flows by toggling a flag and setting `published: false` on the server. You may need to relax/adjust validation rules for drafts if strict validators block saving drafts.

---

## Where to look (important files)

- app/post/page.tsx — posts listing page and server prefetch
- app/post/_ui/post-content.tsx — posts grid and category filtering
- components/post-card.tsx — post preview / excerpt logic
- components/post-form.tsx — create/update form, TipTap integration, drafts
- trpc/server/routers/post.ts — post CRUD mutations & queries
- trpc/server/routers/post-categories.ts — category-post relationships
- db/schema.ts & db/drizzle.ts — database schema & connection


## Time spent (approximate)
- ~10–15 hours (implementation, fixes, and wiring TRPC/TipTap/form behaviors)

If you want, I can:
- Add a seed script and example `.env.example`
- Convert remaining Suspense usage to `useQuery` for consistent inline loading
- Add authentication scaffold