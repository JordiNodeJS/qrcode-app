# QR Code Generator - Project Specification

## Project Overview

A modern, user-friendly web application built with Next.js 15 that allows users to generate QR codes from text input and includes a contact form for inquiries. The application leverages Server Components for optimal performance and integrates with Resend API for email functionality.

## Project Goals

1. **Primary Goal**: Provide a simple, fast QR code generation tool accessible from any device
2. **Secondary Goal**: Enable users to contact the team through an integrated contact form
3. **Technical Goal**: Demonstrate modern Next.js 15 best practices with App Router architecture

## Target Audience

- **General Users**: Anyone needing to create QR codes quickly without registration
- **Business Users**: Small businesses needing QR codes for marketing materials
- **Developers**: Other developers looking for a simple QR generation tool
- **Mobile Users**: Users on smartphones and tablets requiring responsive design

## Technical Stack

### Frontend
- **Framework**: Next.js 15.0+
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.0+
- **UI Library**: React 19

### Backend
- **API Routes**: Next.js App Router route handlers
- **Email Service**: Resend API
- **QR Generation**: qrcode library

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Core Features

### Feature 1: QR Code Generator

**Description**: Allow users to input text and generate a QR code that can be downloaded as an image.

**Functional Requirements**:
- Text input field accepting up to 2000 characters
- Real-time QR code preview as user types
- Download button to save QR code as PNG image
- Customizable QR code size (optional enhancement)
- Error handling for invalid inputs
- Loading state during generation

**User Stories**:
- As a user, I want to type or paste text so that I can create a QR code
- As a user, I want to see the QR code preview immediately so that I can verify it before downloading
- As a user, I want to download the QR code as an image so that I can use it in my projects
- As a user, I want clear feedback if something goes wrong so that I can understand and fix the issue

**Acceptance Criteria**:
- [ ] Input field accepts text up to 2000 characters
- [ ] QR code generates within 500ms of input change
- [ ] Downloaded QR code is clear and scannable
- [ ] Download filename includes timestamp
- [ ] Error messages display for invalid inputs
- [ ] Loading spinner shows during generation
- [ ] Works on mobile devices

### Feature 2: Contact Form

**Description**: Provide a contact form for users to send inquiries via email using Resend API.

**Functional Requirements**:
- Form fields: Name, Email, Subject, Message
- Client-side form validation
- Server-side validation and sanitization
- Email delivery to info@webcode.es
- Success/error feedback to user
- Rate limiting to prevent abuse
- Accessible form controls

**User Stories**:
- As a user, I want to contact the team so that I can ask questions or provide feedback
- As a user, I want immediate validation feedback so that I can correct errors before submitting
- As a user, I want confirmation that my message was sent so that I know it was received
- As an admin, I want to receive contact form submissions via email so that I can respond to inquiries

**Acceptance Criteria**:
- [ ] All form fields are required and validated
- [ ] Email format is validated
- [ ] Message length is between 10-1000 characters
- [ ] Form shows loading state during submission
- [ ] Success message displays after successful submission
- [ ] Error message displays if submission fails
- [ ] Email is sent to info@webcode.es with correct formatting
- [ ] Form resets after successful submission
- [ ] ARIA labels present for accessibility

## User Interface Requirements

### Layout
- Clean, modern design with consistent spacing
- Responsive layout for mobile, tablet, and desktop
- Maximum content width for readability
- Sticky navigation (if multi-page)
- Footer with copyright and links

### Color Scheme
- Primary: Modern blue/purple gradient
- Secondary: Neutral grays
- Success: Green tones
- Error: Red tones
- Background: Light gray or white

### Typography
- Headings: Bold, clear hierarchy
- Body text: Readable font at 16px base
- Code/monospace for technical content
- Proper line height for readability

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios
- Focus indicators
- Alt text for images

## Non-Functional Requirements

### Performance
- Page load time < 2 seconds
- QR code generation < 500ms
- Lighthouse score > 90
- Optimized images and assets
- Minimal bundle size

### Security
- Input sanitization to prevent XSS
- Rate limiting on API endpoints
- Environment variables for sensitive data
- HTTPS in production
- CORS configuration
- No sensitive data in client-side code

### Scalability
- Stateless API routes
- CDN-ready static assets
- Serverless-compatible architecture
- Efficient caching strategy

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### SEO
- Proper meta tags
- Semantic HTML structure
- Open Graph tags
- Sitemap.xml
- Robots.txt

## API Specifications

### POST /api/contact

**Purpose**: Send contact form submission via email

**Request Body**:
```typescript
{
  name: string;      // 2-100 characters
  email: string;     // Valid email format
  subject: string;   // 5-200 characters
  message: string;   // 10-1000 characters
}
```

**Response Success (200)**:
```typescript
{
  success: true;
  message: "Email sent successfully";
}
```

**Response Error (400/500)**:
```typescript
{
  success: false;
  error: string;     // Error message
}
```

## Data Models

### Contact Form Submission
```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: Date;
}
```

### QR Code Configuration
```typescript
interface QRCodeConfig {
  text: string;
  size?: number;         // Default: 300
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';  // Default: 'M'
}
```

## Environment Variables

```bash
# Required
RESEND_API_KEY=re_8wjE2rmh_PYnSQDjX6XP4mUUZhtmgTM2M

# Optional
NODE_ENV=development|production
```

## File Structure

```
qrcode-app/
├── .github/
│   ├── copilot-instructions.md
│   └── prompts/
│       └── pr.prompt.md
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── QRGenerator.tsx
│   └── ContactForm.tsx
├── lib/
│   └── utils.ts
├── docs/
│   ├── specification.md
│   └── tasks.md
├── public/
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── README.md
└── LICENSE
```

## Testing Strategy

### Unit Testing
- Component rendering tests
- Form validation logic
- Utility functions
- QR code generation

### Integration Testing
- API route handlers
- Form submission flow
- Email sending
- Error handling

### E2E Testing (Optional)
- Complete user flows
- Cross-browser testing
- Mobile device testing

## Deployment

### Hosting
- **Platform**: Vercel (recommended)
- **Alternative**: Netlify, Railway, AWS

### CI/CD
- Automatic deployments on git push
- Preview deployments for pull requests
- Environment variable configuration
- Build status checks

### Monitoring
- Error tracking (optional)
- Analytics (optional)
- Email delivery monitoring

## Future Enhancements

### Phase 2 Features
- [ ] Customizable QR code colors
- [ ] Different QR code sizes
- [ ] SVG download option
- [ ] URL shortening integration
- [ ] QR code scanning/validation
- [ ] Batch QR code generation
- [ ] History of generated QR codes (local storage)
- [ ] Dark mode support

### Phase 3 Features
- [ ] User accounts and authentication
- [ ] QR code analytics
- [ ] API for programmatic access
- [ ] Advanced QR code customization (logo overlay)
- [ ] Multiple export formats (SVG, EPS, PDF)

## Success Metrics

- **User Engagement**: Number of QR codes generated per month
- **Contact Form**: Number of submissions per month
- **Performance**: Page load time < 2s maintained
- **Uptime**: 99.9% availability
- **User Satisfaction**: Positive feedback ratio

## Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Resend API downtime | High | Low | Implement retry logic, show user-friendly errors |
| Spam through contact form | Medium | High | Add rate limiting, consider CAPTCHA |
| Large text input crashes browser | Medium | Low | Implement character limits, loading states |
| Browser compatibility issues | Medium | Low | Test across major browsers, use polyfills |

## Timeline

- **Week 1**: Project setup, documentation, core UI
- **Week 2**: QR code generator implementation
- **Week 3**: Contact form and API integration
- **Week 4**: Testing, refinement, deployment

## Maintenance

- Regular dependency updates
- Security patches
- Monitor API usage and costs
- User feedback incorporation
- Performance optimization

---

**Document Version**: 1.0  
**Last Updated**: November 13, 2025  
**Author**: Development Team
