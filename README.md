
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

### Run development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

## Project structure

- `src/` – application source files
- `src/app/` – main app entry, routing, and page components
- `src/app/components/` – UI components and shared helpers
- `src/styles/` – global styles and theme configuration
- `index.html` – Vite app entry page
- `vite.config.ts` – Vite configuration

## Notes

- This repo is configured as a PNPM workspace.
- Keep generated artifacts, dependency directories, and local environment files out of source control.
