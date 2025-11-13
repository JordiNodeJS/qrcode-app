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

### TypeScript
- Use explicit types for function parameters and return values
- Avoid `any` type - use specific types or `unknown`
- Use interfaces for object shapes
- Export types alongside components

### React & Next.js
- Prefer async Server Components for data fetching
- Use Server Actions for form submissions when appropriate
- Implement proper error boundaries
- Use Next.js Image component for images
- Use proper metadata exports for SEO

### API Routes
- Use App Router route handlers (`route.ts`)
- Return proper HTTP status codes
- Implement error handling with try-catch blocks
- Validate input data before processing
- Use environment variables for sensitive data

### Forms
- Implement client-side validation
- Provide user feedback (loading states, success/error messages)
- Use proper HTML5 input types
- Include accessibility attributes (aria-labels, roles)

### Styling
- Use Tailwind CSS utility classes
- Follow responsive design principles (mobile-first)
- Use semantic color classes
- Maintain consistent spacing scale

### Error Handling
- Catch and handle errors gracefully
- Provide meaningful error messages to users
- Log errors appropriately (but don't expose sensitive info)

### Environment Variables
- Store API keys in `.env.local`
- Never commit `.env.local` to version control
- Use `process.env.VARIABLE_NAME` for accessing env vars
- Prefix public env vars with `NEXT_PUBLIC_`

## Build & Development Commands

### Install Dependencies
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```
Server runs at http://localhost:3000

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Linting
```bash
pnpm lint
```

## Testing Guidelines
- Test QR code generation with various input lengths
- Verify contact form validation
- Test email sending functionality
- Check responsive design on different screen sizes
- Verify error states and loading states

## Security Considerations
- Validate and sanitize all user inputs
- Rate limit API endpoints if possible
- Use HTTPS in production
- Keep dependencies updated
- Don't expose API keys in client-side code

## Email Configuration (Resend)
- API Key stored in `RESEND_API_KEY` environment variable
- Emails sent to: info@webcode.es
- Use proper email templates
- Handle email sending errors gracefully

## Performance Optimization
- Use Next.js Image optimization
- Implement proper caching strategies
- Minimize client-side JavaScript
- Use Server Components for non-interactive content
- Optimize images and assets

## Accessibility
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

## Common Patterns

### API Route with Error Handling
```typescript
export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Process data
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Error message' }, { status: 500 });
  }
}
```

### Client Component with Form
```typescript
'use client'

export default function MyForm() {
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Submit logic
    } finally {
      setLoading(false);
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Important Notes
- Always run `pnpm install` after pulling changes
- Test locally before committing
- Keep commits atomic and well-described
- Update documentation when adding features
- Follow the existing code style and patterns
