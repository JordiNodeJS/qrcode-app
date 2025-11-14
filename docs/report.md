# Test Report — Screenshots

This report contains automated screenshots taken with Playwright and a brief description of each tested functionality.

- **Home page**: `/screenshots/home.png` — shows the landing page and main UI.
- **QR generation**: `/screenshots/qr.png` — the input field was filled and the QR code preview is visible.
- **Contact page (before submit)**: `/screenshots/contact_page.png` — contact form initial state.
- **Contact page (after submit)**: `/screenshots/contact_after_submit.png` — confirmation state after sending the message (server logged successful send).

## Notes
- Screenshots were captured against the local dev server at `http://localhost:3000` using `scripts/dev_screenshots.js`.
- The contact form was filled and submitted automatically. The server log shows a successful send via Resend with message id shown in the server response.

## Files
- `screenshots/home.png`
- `screenshots/qr.png`
- `screenshots/contact_page.png`
- `screenshots/contact_after_submit.png`


---
Generated automatically.
