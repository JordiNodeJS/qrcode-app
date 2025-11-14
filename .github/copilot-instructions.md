# GitHub Copilot Coding Instructions

## Project Overview
This is a Next.js 15 QR code generator application with integrated contact form functionality using Resend API. The project uses the App Router architecture, TypeScript, and modern React patterns including Server Components and Client Components.

## Tech Stack
- **Framework**: Next.js 15 with App Router
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
```

## Coding Standards

# Copilot / AI Agent Instructions — QR Code App

This file gives concise, actionable guidance for AI coding agents working on this repository.

## At-a-glance
- Next.js 16 (App Router) + TypeScript + Tailwind CSS. Entry: `app/` (Server Components by default).
- QR generation: `components/QRGenerator.tsx` (uses `qrcode` toDataURL, max 2000 chars).
- Contact API: `app/api/contact/route.ts` (Resend email integration; includes a local mock path when `RESEND_API_KEY` is missing in development).
- Package manager: `pnpm`. Scripts available in `package.json` (`dev`, `build`, `start`, `lint`).

## Key files to inspect
- `lib/utils.ts` — shared utility functions (validation, HTML escape, logging helpers).
- `lib/constants.ts` — application-wide constants (QR limits, form validation limits, error messages).
- `app/api/contact/route.ts` — validation rules, email HTML template, mock-send behavior, env overrides.
- `components/ContactForm.tsx` — client-side validation, uses FormField component, ticket UI with copy/print.
- `components/QRGenerator.tsx` — client-only, responsive QR generation, uses constants from lib/constants.
- `components/FormField.tsx` — reusable form input/textarea component with error handling.
- `components/PageLayout.tsx` — reusable page wrapper with gradient background.
- `components/Button.tsx` — reusable button component with variants (primary, secondary, ghost).
- `app/layout.tsx` — theme init script, `ThemeProvider`, global layout.
- `package.json` — runtime and dev dependencies; use `pnpm` commands.

## Architecture & conventions (project-specific)
- **Server Components by default**: Only mark files with `'use client'` when they use browser APIs, hooks, or event handlers.
- **Shared utilities**: Use `lib/utils.ts` for reusable functions (validation, escaping, logging). Use `lib/constants.ts` for app-wide constants.
- **Reusable components**: `FormField`, `PageLayout`, and `Button` are available for consistent UI patterns.
- **Validation**: Done both client-side (ContactForm with `lib/utils`) and server-side (route.ts with `lib/utils`). Server messages are in Spanish; client can be English.
- **Contact route**: Validates fields using `validateFormData()`, checks `RESEND_API_KEY`, uses mock send in dev if key missing, calls `resend.emails.send()`.
- **QR generation**: Limited to `QR_CODE_MAX_LENGTH` (2000 chars) from `lib/constants`. Width dynamically set based on viewport, capped at `QR_CODE_MAX_WIDTH`.

## Environment & integration notes
- Required env: `RESEND_API_KEY` (put in `.env.local`). Optional overrides: `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` (comma-separated).
- If `RESEND_API_KEY` is missing and `NODE_ENV === 'development'`, route.ts uses a local mock send result — useful for local testing without sending real emails.
- Do NOT log or commit secrets. The route logs send results and errors for debugging — keep those logs but avoid printing secrets.

## Developer workflows (concrete commands)
Install dependencies:
# GitHub Copilot — Project Instructions (concise)

This file gives targeted, actionable guidance for AI coding agents working on this repository.

**Stack & entry points**
- Next.js 16 (App Router) + TypeScript + Tailwind CSS. App entry: `app/` (Server Components by default).
- Key files: `app/api/contact/route.ts`, `components/QRGenerator.tsx`, `components/ContactForm.tsx`, `app/layout.tsx`.

**What to know first (big picture)**
- UI: Server Components by default; interactive features are implemented as Client Components with `'use client'` (see `ContactForm.tsx` and `QRGenerator.tsx`).
- QR flow: `QRGenerator.tsx` uses the `qrcode` package and calls `QRCode.toDataURL(...)` to produce data-URLs (capped at 2000 characters). Data URLs are rendered with `<Image unoptimized />`.
- Contact flow: `app/api/contact/route.ts` validates input (Spanish messages), then sends email via the `resend` SDK or a local mock when `RESEND_API_KEY` is absent in development.
- The app uses a ThemeProvider + a small init script in `app/layout.tsx` to toggle dark mode by adding `class="dark"` to `<html>` (Tailwind configured with `darkMode: 'class'`).

**Important conventions & patterns**
- Server vs Client: Only add `'use client'` when the component uses browser APIs, hooks, or event handlers (e.g., clipboard, window.print, localStorage).
- Validation: Keep UI validation in sync with server rules. Server limits in `route.ts`: name 2–100, subject 5–200, message 10–1000, email validated by regex.
- Environment safety: Never log secrets. `route.ts` logs results but never prints the API key. Use `RESEND_FROM_EMAIL` / `RESEND_TO_EMAIL` to override recipients.
- Mocking: If `RESEND_API_KEY` is missing and `NODE_ENV === 'development'`, the route returns a mock send result so the front-end can behave normally during local dev.

**Dev & debug commands**
```
pnpm install
pnpm dev      # starts dev server on http://localhost:3000
pnpm build
pnpm start
pnpm lint
```

**Env / integration notes**
- Required (local): create `.env.local` with `RESEND_API_KEY=...`.
- Optional overrides: `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` (comma-separated list).
- In production, ensure `RESEND_API_KEY` is present; otherwise the API returns 500.

**Examples & code pointers**
- QR generation: `components/QRGenerator.tsx` enforces `maxLength={2000}` on the textarea and checks `value.length > 2000` before generating.
- Contact API: `app/api/contact/route.ts` composes an HTML + plain-text email and calls `resend.emails.send({...})`; it catches and logs errors and returns Spanish-friendly error messages to the client.
- Contact UI: `components/ContactForm.tsx` posts JSON to `/api/contact`, then shows a ticket with copy/print helpers implemented via clipboard API and `window.open`/print.

**When editing**
- Keep server messages in Spanish unless the change targets localization.
- Preserve the mock-send behavior used during development or document how to replicate it if removed.
- If you change the contact email HTML, update both the template in `route.ts` and the README if relevant.
 
**Uso de la herramienta `apply_patch`**

- **Qué hace:** `apply_patch` aplica un diff/patch a archivos en el workspace. Úsalo para editar archivos existentes desde el agente.
- **Parámetros obligatorios en la llamada a la función:**
  - `input` (string): el contenido completo del patch en formato V4A. El string debe incluir `*** Begin Patch` y `*** End Patch` y todos los cambios intermedios.
  - `explanation` (string): una breve explicación de para qué sirve el patch (1-2 oraciones).
- **Formato del `input` (resumen rápido):**
  - El patch empieza con `*** Begin Patch` y termina con `*** End Patch`.
  - Para cada archivo a modificar: `*** Update File: /absolute/path/to/file`
  - Use context lines y prefijos `-` (líneas a eliminar) y `+` (líneas a añadir).
  - Use `@@` para indicar la función/clase o ubicación cuando sea necesario.
  - No uses números de línea.
- **Reglas importantes:**
  - Usa rutas absolutas para los archivos (ej. `g:\DEV\tmp\qrcode-app\path\to\file`).
  - Respeta la indentación original (tabs vs espacios).
  - Evita mezclar cambios no relacionados en un mismo patch.
  - Si necesitas crear nuevos archivos, usa `create_file` en lugar de `apply_patch`.
- **Checklist antes de llamar a `apply_patch`:**
  - Confirmar la ruta absoluta del archivo objetivo.
  - Asegurarse de incluir `*** Begin Patch` y `*** End Patch` en `input`.
  - Incluir `explanation` con una frase clara sobre el propósito.
  - Revisar el patch para no romper la sintaxis del archivo.
- **Ejemplo mínimo de `input` válido (copiar/adaptar):**

  *** Begin Patch
  *** Update File: g:\\DEV\\tmp\\qrcode-app\\.github\\copilot-instructions.md
  @@
  - If you change the contact email HTML, update both the template in `route.ts` and the README if relevant.
  + If you change the contact email HTML, update both the template in `route.ts` and the README if relevant.
  + Añadida una línea de ejemplo para `apply_patch`.
  *** End Patch

Con esto se evita olvidar parámetros como `input` y `explanation`, o usar rutas relativas que causan fallos.
If you'd like, I can also:
- add a small test harness for the contact route (mocking Resend), or
- add a sanity script to POST example payloads to `/api/contact` for local testing.

Please review and tell me which parts to expand or clarify.
If any section is unclear or you want more examples (e.g., a test harness for the contact route or a small script to simulate form submissions), tell me which part and I will extend this file accordingly.

### referencias para crear prompts personalizados y agentes
https://code.visualstudio.com/docs/copilot/customization/prompt-files
https://code.visualstudio.com/docs/copilot/customization/custom-agents
