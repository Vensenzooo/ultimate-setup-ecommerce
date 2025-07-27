
# Copilot Instructions for AI Coding Agents

## Current Practices

### Project Overview
Modern Next.js e-commerce platform using TypeScript, Tailwind CSS, and modular components. Major flows: admin, client, guest, catalog.

### Architecture & Structure
- **App Routing:** All pages in `app/` (Next.js App Router v13+). Subfolders for flows: `admin/`, `client/`, `guest/`, `catalog/`.
- **Components:** Shared/domain-specific in `components/` (see `components/admin/`, `components/comparison/`, `components/ui/`).
- **Hooks:** Custom hooks in `hooks/` (e.g., `use-cart.ts`, `use-toast.ts`).
- **Lib:** Utilities in `lib/utils.ts`.
- **Styles:** Global styles in `styles/globals.css`, `app/globals.css`.
- **Config:** Tailwind, PostCSS, Next.js configs in root.

### Developer Workflows
- Install dependencies: `pnpm install`
- Run dev server: `pnpm dev`
- Build for production: `pnpm build`
- Preview build: `pnpm start`
- Type checking: `pnpm type-check` (if available)
- Linting: `pnpm lint` (if available)

### Code Standards & Conventions
- **TypeScript:** Strict typing, prefer `interface` for objects, explicit return types, avoid `any`.
- **Component Structure:** Functional components only, props interface above component, default export for pages, named export for utilities/hooks.
- **File Naming:** kebab-case for files/folders, PascalCase for components, camelCase for functions/props.
- **Styling:** Tailwind-first, mobile-first, use variants via conditional classes.

### Patterns & Examples
- **UI Primitive Example:** See `components/ui/button.tsx` for API and variants.
- **Admin Page Example:** See `app/admin/products/page.tsx`.
- **Custom Hook Example:** See `hooks/use-cart.ts`.
- **Loading State Example:** See `app/catalog/loading.tsx`.

### Integration Points
- Static assets: `public/`
- External libraries: Next.js, React, Tailwind CSS, PostCSS, PNPM

### Testing Status
Tests are not yet implemented. Do not expect unit/integration/E2E tests in the current codebase.

### Common Tasks
- Add admin page: create folder in `app/admin/`, add `page.tsx` and optionally `loading.tsx`, use `components/admin/`.
- Add UI primitive: add to `components/ui/`, export and document usage.
- Add custom hook: add to `hooks/`, follow patterns in `use-cart.ts`.

### Key Files & Directories
- `app/` — Next.js App Router pages/layouts
- `components/` — Shared/domain React components
- `hooks/` — Custom React hooks
- `lib/utils.ts` — Utility functions
- `public/` — Static assets
- `styles/` — Global styles
- `tailwind.config.ts` — Tailwind config

---

## Migration & Backend Integration Tasks

### Phase 1: Project Analysis & Cleanup
- Analyze codebase structure, identify/remove mock/demo data
- Implement API layer in `lib/api/` (see example structure below)

### Phase 2: Backend Development (XAMPP)
- Create MySQL schema (see SQL in docs/backend-schema.sql)
- Build PHP REST API (see docs/backend-structure.md)

### Phase 3: Frontend-Backend Integration
- Configure `.env.local` for API connection
- Implement API client in `lib/api/client.ts` (see example in docs/api-client-example.ts)
- Replace mock data with real API calls in components

### Phase 4: Testing & Validation
- Test API endpoints with curl
- Verify frontend features with real data

### Execution Checklist
- [ ] Project analysis report created
- [ ] All mock data files removed
- [ ] API layer implemented
- [ ] Components updated with loading states
- [ ] Database created and sample data inserted
- [ ] Backend API CRUD endpoints tested
- [ ] Environment variables configured
- [ ] API client tested
- [ ] Frontend connected to backend
- [ ] Authentication flow working
- [ ] Error handling implemented
- [ ] Performance optimized

---
For questions or unclear conventions, ask for clarification or review recent changes before proceeding.
