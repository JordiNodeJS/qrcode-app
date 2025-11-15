# GitHub Copilot Coding Instructions

## Project Overview
This is a Next.js 16 QR code generator application with integrated contact form functionality using Resend API. The project uses the App Router architecture, TypeScript, and modern React patterns including Server Components and Client Components.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Email Service**: Resend API
- **QR Code Generation**: qrcode library
- **Package Manager**: pnpm

## Architecture & Patterns

### Component Structure
- Use Server Components by default for better performance
- Mark components as Client Components only when necessary (use `'use client'` directive)
- Client Components are needed for:
  - Interactive features (forms, buttons with onClick handlers)
  - Browser APIs (useState, useEffect, etc.)
  - Event handlers

### File Organization
```
app/
  layout.tsx          # Root layout
  page.tsx            # Home page with QR generator
  globals.css         # Global styles
  api/
    contact/
      route.ts        # Contact form API endpoint
components/
  QRGenerator.tsx     # QR code generation component
  ContactForm.tsx     # Contact form component
lib/
  utils.ts            # Utility functions
## GitHub Copilot — Project Instructions (CONCISE)

This file gives concise, actionable guidance for AI coding agents working on this repository.

Overview
- Next.js (App Router, recent v16 layout), TypeScript, Tailwind. App entry: `app/` (Server
  Components by default). Use `pnpm` for package management.
- Key integrations: `qrcode` (client-side QR generation), `resend` (email sending via
  `app/api/contact/route.ts`).

Quick start commands
```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build
pnpm start
pnpm lint
```

Files to inspect first
- `app/api/contact/route.ts` — server validation, Spanish messages, mock-send behavior.
- `components/ContactForm.tsx`, `components/QRGenerator.tsx` — client interactions and constraints.
- `lib/constants.ts`, `lib/utils.ts` — validation limits and helpers
- `app/layout.tsx`, `ThemeProvider.tsx` — global layout and theme init.

Conventions & notes for edits
- Server Components by default — add `'use client'` only when using hooks, event handlers,
  or browser APIs (clipboard, print, localStorage).
- Keep client and server validation rules in sync (`lib/constants.ts`, `lib/utils.ts`).
- Server messages are Spanish; do not change unless localizing intentionally.
- The contact route returns a mock send result when `RESEND_API_KEY` is absent in development —
  preserve this for safe local testing.

Environment
- Put secrets in `.env.local`: `RESEND_API_KEY` (required for real sends), optional
  `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`.

Agent tips
- Use small, surgical patches. Prefer changing minimal files and keeping the server/client
  separation consistent.
- For testing the contact flow locally, POST JSON to `/api/contact`; in dev the route will
  mock if the key is missing.

If helpful, I can add a small POST script to `scripts/` for local sanity tests, or a unit
test for validation utilities in `lib/utils.ts`.

Please review and tell me any areas you want expanded or any examples to add.
