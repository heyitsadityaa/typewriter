# Typewriter - A minimalistic, vintage-inspired blog platform

![Typewriter Banner](./public/assets/typewriter.png)

A modern, type-safe blogging platform built with Next.js 15, tRPC, Drizzle ORM, and PostgreSQL. This project demonstrates full-stack development with end-to-end type safety, efficient state management, and a clean, responsive user interface.

## Project Preview

### Screenshots

![Theme](./public/assets/typewriter-theme.jpg)
_Dark mode support throughout the application_

### Demo Video

[Watch the Demo Video](https://github.com/user-attachments/assets/7d3e4268-517e-4e62-8d0d-dffcc9907b57)

> _Click to watch the full demo video._

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Architecture Decisions & Trade-offs](#architecture-decisions--trade-offs)
- [Key Learnings & Improvements](#key-learnings--improvements)

---

## Tech Stack

### Core Technologies

- **Next.js 15** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database (Neon hosted)
- **Drizzle ORM** - Type-safe database ORM
- **tRPC** - End-to-end type-safe API layer
- **Zod** - Schema validation

### State Management & Data Fetching

- **TanStack Query (React Query)** - Server state management (integrated via tRPC)
- **TanStack Form** - Type-safe form state management with validation
- **Zustand** - Global client state for drafts

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Icon library
- **Sonner** - Toast notifications

---

## Key Features

### Content Management

- **Full CRUD Operations** for blog posts and categories
- **Draft System** with offline-first persistence using localStorage
- **Many-to-Many Relationships** between posts and categories
- **Category Filtering** with sidebar navigation
- **Post Statistics** including word count and reading time estimation

### User Experience

- **Dark/Light Mode** with persistent theme preferences
- **Fully Responsive Design** optimized for all devices
- **Smooth Animations** and transitions throughout the application
- **Loading & Error States** with toast notifications
- **Mobile-Optimized Navigation** with touch-friendly interactions

### Architecture

- **End-to-End Type Safety** with tRPC and TypeScript
- **Optimistic UI Updates** for instant user feedback
- **Server-Side Rendering** with Next.js App Router
- **Type-Safe Database Queries** using Drizzle ORM
- **Form Validation** with Zod schemas and TanStack Form

### Pages & Routes

- **Landing Page** with hero section and feature showcase
- **Posts Listing** with grid layout and category badges
- **Individual Post View** with full content display
- **Create/Edit Posts** with text editing
- **Category Management** for organizing content

---

## Project Structure

```
typewriter/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Landing page
│   ├── post/                # Blog post routes
│   │   ├── page.tsx         # Posts listing
│   │   ├── [id]/page.tsx    # Individual post view
│   │   └── [id]/update/     # Post edit page
│   ├── create/              # Create post page
│   └── categories/          # Category management
├── components/              # React components
│   ├── post-card.tsx        # Post preview card
│   ├── post-form.tsx        # Post create/edit form
│   ├── category-sidebar.tsx # Category filter sidebar
│   ├── navbar.tsx           # Navigation bar
│   ├── footer.tsx           # Footer component
│   └── ui/                  # Reusable UI components
├── trpc/                    # tRPC configuration
│   ├── server/
│   │   ├── routers/         # API routers
│   │   │   ├── post.ts      # Post CRUD operations
│   │   │   ├── category.ts  # Category operations
│   │   │   └── post-categories.ts # Category filtering
│   │   └── index.ts         # tRPC server setup
│   └── client/              # tRPC client hooks
├── db/                      # Database configuration
│   ├── schema.ts            # Drizzle ORM schema
│   └── drizzle.ts           # Database connection
├── store.ts                 # Zustand store (drafts)
└── .env                     # Environment variables
```

---

## Database Schema

### Tables

#### `posts`

```typescript
{
  id: serial (primary key)
  title: varchar() - Post title
  content: text - HTML content from TipTap editor
  author: varchar(100) - Post author name
  published: boolean - Publication status
  createdAt: timestamp - Creation timestamp
  updatedAt: timestamp - Last update timestamp
}
```

#### `categories`

```typescript
{
  id: serial (primary key)
  title: varchar(50) - Category name
  slug: varchar(50) - Category slug
  description: text - Category description
}
```

#### `postCategories` (Junction Table)

```typescript
{
  id: serial (primary key)
  postId: integer (foreign key -> posts.id)
  categoryId: integer (foreign key -> categories.id)
}
```

### Relationships

- **Posts ↔ Categories**: Many-to-many relationship via `postCategories` junction table
- Cascade deletes: Removing a post/category removes associated relationships

---

## Architecture Decisions & Trade-offs

### 1. **Draft System: Client-Side vs Server-Side**

**Decision**: Implemented drafts using Zustand + localStorage (client-side)

**Rationale**:

- ✅ Instant save (no network latency)
- ✅ Works offline
- ✅ Simple implementation
- ✅ No additional database complexity

**Trade-offs**:

- ❌ Drafts not synced across devices
- ❌ Lost if browser data cleared
- ❌ No server-side backup

**Alternative Considered**: Server-side drafts with `published: false`

- Would require additional API endpoints
- More complex state management
- Better for multi-device scenarios

### 3. **Category Checkboxes: Custom vs Native**

**Decision**: Used native `<input type="checkbox">` instead of Radix UI Checkbox

**Rationale**:

- Custom component didn't forward native props correctly
- Native inputs guaranteed accessibility
- Simpler controlled component pattern
- No loss in functionality

### 4. **Data Fetching: useSuspenseQuery vs useQuery**

**Decision**: Mixed approach - `useSuspenseQuery` with `useQuery` for inline loaders

**Rationale**:

- `useSuspenseQuery` for prefetched data (posts, categories)
- `useQuery` where inline loading states needed
- Best of both worlds: fast initial load + granular loading feedback

**Trade-offs**:

- Slightly more complex implementation
- Need to handle Suspense boundaries carefully
- Better UX than single approach

### 5. **Post Card Excerpts: Fixed Length**

**Decision**: 30-word excerpts for all post cards

**Rationale**:

- Consistent card heights
- Predictable grid layout
- Easier to scan
- Encourages clicking through to read more

**Alternative Considered**: Variable-size cards (Pinterest-style)

- Would require more complex CSS (masonry layout)
- Less predictable UI
- More implementation time

### 6. **Error Handling Strategy**

**Decision**: Toast notifications + inline error messages

**Rationale**:

- Non-blocking user experience
- Clear feedback on actions
- Form errors stay visible until corrected

### 7. **TypeScript Configuration**

**Decision**: Strict mode enabled, minimal `any` types

**Rationale**:

- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- tRPC provides end-to-end type safety

**Stats**:

- ~95% of code fully typed
- `any` used only for:
  - Dynamic API response shapes (normalized afterward)
  - Third-party library type gaps

---

**Total Time**: ~14 hours to 18 hours

- Used Radix UI primitives (saved ~2 hours)
- Neon for hosted PostgreSQL (saved ~1 hour)
- Tailwind CSS for rapid styling (saved ~3 hours)
- Client-side drafts instead of server implementation (saved ~2 hours)

## Key Learnings & Improvements

### What Went Well

- tRPC provided excellent type safety and developer experience
- Drizzle ORM made database queries intuitive
- Component structure remained clean and maintainable

### What Could Be Improved (Given More Time)

1. **Server-Side Drafts**: Move draft system to database for multi-device support
2. **Search**: Implement full-text search with PostgreSQL `tsvector`
3. **Pagination**: Add cursor-based pagination for large post lists
4. **Image Upload**: Integrate Cloudinary or similar CDN
5. **SEO**: Add dynamic meta tags per post
6. **Testing**: Add unit tests (Vitest) and E2E tests (Playwright)
7. **Analytics**: Track post views and reading time
8. **Comments**: Add commenting system with nested replies

## Author

**Aditya Prakash**

- Portfolio: [aditya-portfolio-five-psi.vercel.app](https://aditya-portfolio-five-psi.vercel.app)
- LinkedIn: [linkedin.com/in/aditya-prakash-06199427b](https://www.linkedin.com/in/aditya-prakash-06199427b)
- GitHub: [@heyitsadityaa](https://github.com/heyitsadityaa)
