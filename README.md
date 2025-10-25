## Batcat · Design Desk

A Next.js 15 + React 19 workspace that replaces the original Vite build. It keeps the shadcn component system, Tailwind design tokens, and Radix primitives while moving routing, layouts, and data providers into the App Router.

### Stack

- Next.js 15 / React 19
- TypeScript
- Tailwind CSS 3.x with the original design token configuration
- shadcn UI (Radix primitives) + lucide icons
- TanStack React Query, next-themes, sonner toasts

### Project structure

- `src/app/(site)/…` – public marketing pages (home, about, portfolio, blog, certifications, skills, contact)
- `src/app/(admin)/admin/…` – admin workspace (login, dashboard, profile, projects, blog, certifications, skills, messages, media, settings)
- `src/components` – shared UI, navigation, sections, shadcn primitives
- `src/data/mock-data.ts` – all copy, mock records, stats, and admin seed data for easy updates before hooking to a backend
- `src/services` – Supabase-backed data access helpers with graceful fallbacks to mock data
- `src/app/api/*` – JSON endpoints proxying Supabase queries

### Getting started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public site. Admin routes live under `/admin` (e.g. `/admin/login`, `/admin/dashboard`).

Lint the codebase with:

```bash
npm run lint
```

Warnings remain for `<img>` usage in a few areas; replace with `next/image` if you’d like automatic optimisation.

### Supabase integration

The codebase now ships with Supabase stubs and API routes. To switch from the mock data:

1. **Create a Supabase project**  
   - Note the project URL and anon key. Generate a service-role key (Settings → API).

2. **Configure environment variables**  
   - Copy `.env.example` to `.env.local` and fill in:
     ```bash
     NEXT_PUBLIC_SUPABASE_URL=...
     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     SUPABASE_SERVICE_ROLE_KEY=...
     ```
   - Restart the dev server after saving.

3. **Provision tables**  
   Suggested schemas (use the Supabase SQL editor; adjust fields to match your needs):
   ```sql
   create table blog_posts (
     id uuid primary key default gen_random_uuid(),
     slug text unique not null,
     title text not null,
     excerpt text,
     category text,
     tags text[],
     image text,
     date date,
     readtime text,
     views integer default 0,
     author jsonb,
     "tableOfContents" jsonb,
     content text
   );

   create table projects (
     id uuid primary key default gen_random_uuid(),
     slug text unique,
     title text not null,
     description text,
     category text,
     technologies text[],
     year text,
     image text,
     link text
   );

   create table certifications (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     organization text,
     issueDate date,
     expiryDate date,
     credentialId text,
     verificationUrl text,
     image text,
     category text,
     status text,
     "group" text
   );

   create table messages (
     id uuid primary key default gen_random_uuid(),
     name text,
     email text,
     subject text,
     message text,
     status text default 'unread',
     receivedAt timestamptz default now()
   );
   ```

4. **Seed initial data**  
   - Insert the content from `src/data/mock-data.ts` (or export via Supabase spreadsheet upload) so the UI shows live data immediately.

5. **Update admin mutations**  
   - API routes (`/api/blog`, `/api/projects`, `/api/certifications`, `/api/messages`) already read from Supabase or fall back to mock data.  
   - Wire admin create/update/delete actions to call `supabaseBrowserClient` (see `src/lib/supabase/client.ts`) or invoke new API routes for mutations.  
   - Add Row Level Security policies so only authenticated admins can modify data.

### Additional notes

- Until Supabase variables are provided, the UI falls back to the mock data in `src/data/mock-data.ts`.
- Tailwind styling remains identical to the previous build via `tailwind.config.ts` and `globals.css`.
- Admin auto-reply, theme, and other local settings still persist in `localStorage`.
