
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
