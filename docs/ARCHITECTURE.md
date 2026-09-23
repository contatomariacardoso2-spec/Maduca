# Architecture — Maduca

## Current V0

The current app is a navigable Next.js client prototype. It intentionally ships with demo data so the information architecture and workflows can be evaluated before backend coupling.

## Target V1

```text
Browser
  └─ Next.js App Router
      ├─ Server Components (read-heavy screens)
      ├─ Client Components (forms, boards, studio interactions)
      ├─ Server Actions / Route Handlers
      └─ Supabase
          ├─ Auth
          ├─ Postgres + RLS
          └─ Storage (portfolio/campaign assets)
```

## Data boundaries

- Browser receives only workspace-scoped data authorized by RLS.
- Service-role credentials are server-only.
- AI calls occur server-side.
- Original briefs and contractual metadata are never overwritten by generated content.

## Suggested route evolution

- `/today`
- `/studio`
- `/ideas`
- `/campaigns`
- `/brands`
- `/portfolio`
- `/money`
- `/calendar`
- `/reviews`
- `/p/[slug]` public portfolio

V0 uses one client shell for speed of iteration; split into routes when backend CRUD begins.
