
# Modern Church Website

This repository contains the initial codebase for a modern church website design built from the original Figma concept:
https://www.figma.com/design/svN6qVR3BytfSPGMauBEqN/Design-modern-church-website.

The project is implemented using React, Vite, Tailwind CSS, shadcn UI patterns, and several Radix UI components. It includes a public website shell and an admin-style section with pages such as Dashboard, Events, Give, Prayer Requests, Sermons, Visitors, Members, Ministries, and Planned Visits.

## Getting Started

### Prerequisites

- Node.js (recommended latest LTS)
- `pnpm` package manager

### Install dependencies

```bash
pnpm install
```

### Configure Supabase

Copy `.env.example` to `.env` and provide the public URL and publishable key from
your Supabase project settings:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Only variables prefixed with `VITE_` are available to the browser. Never add a
Supabase service-role key to a `VITE_` variable. Service-role operations must
run in a separate trusted server environment.

The browser-safe Supabase client is exported from
`src/lib/supabase/client.ts`. It validates the required public environment
variables when imported.

### Admin Management

Administrator management is available at `/admin/admins` for super admins and
admins with the `MANAGE_ADMINS` permission. The portal can update admin
profiles directly through Supabase RLS, but creating a new Supabase Auth login
must happen through a trusted Edge Function.

Set the browser-safe function URL in `.env`:

```env
VITE_ADMIN_CREATE_USER_API_URL=https://your-project.supabase.co/functions/v1/admin-create-user
```

Deploy `supabase/functions/admin-create-user` and set these Supabase secrets:

```bash
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Never place the service-role key in `.env` or any `VITE_` variable.

### Bible Reader

A Bible reader page is available at `/bible`.
It uses Supabase Edge Functions to keep the API.Bible key secret while
supporting translation, book, chapter, and verse search.

Set the browser-safe Edge Function URLs in your local `.env`:

```env
VITE_BIBLE_BIBLES_API_URL=https://your-project.supabase.co/functions/v1/your-bibles-function
VITE_BIBLE_BOOKS_API_URL=https://your-project.supabase.co/functions/v1/your-books-function
VITE_BIBLE_CHAPTERS_API_URL=https://your-project.supabase.co/functions/v1/your-chapters-function
VITE_BIBLE_READER_API_URL=https://your-project.supabase.co/functions/v1/your-reader-function
```

The deployed functions should keep the API.Bible key in a Supabase secret:

```bash
supabase secrets set API_BIBLE_KEY=your-api-bible-key
```

The frontend expects the Bible functions to support these public contracts:

- Translations: `GET VITE_BIBLE_BIBLES_API_URL`, returning an array or `{ data: array }`
- Books: `GET VITE_BIBLE_BOOKS_API_URL?translation=<bibleId>`, returning an array or `{ data: array }`
- Chapters: `GET VITE_BIBLE_CHAPTERS_API_URL?translation=<bibleId>&bookId=<bookId>`, returning an array or `{ data: array }`
- Reader: `GET VITE_BIBLE_READER_API_URL?translation=<bibleId>&chapterId=<chapterId>`, returning `{ data: { reference, content, verses, copyright, fumsToken } }`

Only the function URLs belong in `VITE_` variables. Never expose the API.Bible
key in the Vite app.

### Create the database

Run the SQL files in `supabase/migrations/` in filename order using the Supabase
SQL editor or CLI:

1. `202606140001_initial_schema.sql`
2. `202606140002_row_level_security.sql`
3. `202606140003_atomic_visitor_submission.sql`
4. `202606140004_localize_jamaica.sql`
5. `202606140005_localize_giving_currency.sql`
6. `202606150001_media_storage.sql`
7. `202606190001_admin_permission_policies.sql`

The first migration creates the CMS, newcomer care, membership, attendance,
giving, and church-settings tables. It also adds indexes and automatic
`updated_at` triggers. The second migration enables row-level security and adds
public-read, public-submission, and active-admin policies.

The third migration adds the atomic public visitor-submission function used by
the data-access layer. It prevents partially-created visitor records.

The media-storage migration creates public `images`, `audio`, `videos`, and
`documents` buckets. Only active admins can upload, update, or delete objects.
Public bucket URLs can be displayed by the website.

The admin-permission migration adds `has_admin_permission`, keeps active-admin
read access, and gates write access by permission group such as `MANAGE_CMS`,
`MANAGE_CARE`, `MANAGE_MEMBERS`, `MANAGE_GIVING`, and `MANAGE_ADMINS`.

Bucket limits are intentionally conservative for the Supabase Free plan:

- Images: 5 MB
- Audio: 25 MB
- Videos: 50 MB
- PDF documents: 10 MB

Supabase Free projects allow at most 50 MB per file and include a limited total
storage allowance. Use YouTube or Vimeo links for full sermon videos, and use
compressed images and audio whenever possible.

To load safe development records after applying the migrations, run
`supabase/seed.sql`. The seed file is idempotent and does not create admin
accounts.

### Bootstrap the first admin

Create the first user through Supabase Authentication, then run this statement
from the trusted Supabase SQL editor using that user's ID:

```sql
insert into public.admin_profiles (id, full_name, email, role, permissions)
values (
  'AUTH_USER_ID',
  'Admin Name',
  'admin@example.com',
  'SUPER_ADMIN',
  array['MANAGE_ADMINS', 'MANAGE_CMS', 'MANAGE_CARE', 'MANAGE_MEMBERS', 'MANAGE_GIVING', 'VIEW_DASHBOARD']
);
```

Never expose or use a service-role key in this Vite application.

### Data access

Import public and authenticated-admin data functions from `src/lib/data`.
Database rows remain internal to this layer and are mapped to the camelCase
domain types in `src/types`.

- `src/lib/data/public.ts` contains published-content reads and public form
  submissions.
- `src/lib/data/admin.ts` contains authenticated care-workflow access and CMS
  CRUD operations.
- `src/lib/data/inputs.ts` defines form and update payloads.
- `src/lib/supabase/database.types.ts` defines the typed database contract used
  by the Supabase client.

Admin functions rely on the current Supabase Auth session and the
`admin_profiles` RLS policies. They must not be treated as authorization checks
on their own.

### Run development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

## Project structure

- `src/` - application source files
- `src/app/` - main app entry, routing, and page components
- `src/app/components/` - UI components and shared helpers
- `src/styles/` - global styles and theme configuration
- `index.html` - Vite app entry page
- `vite.config.ts` - Vite configuration

## Notes

- This repo is configured as a PNPM workspace.
- Keep generated artifacts, dependency directories, and local environment files out of source control.
