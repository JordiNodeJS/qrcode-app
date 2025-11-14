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
- `screenshots/contact_page.png`
- `screenshots/contact_after_submit.png`


## Verificación de envío

- Realicé una llamada directa al endpoint `/api/contact` desde el navegador y obtuve respuesta con estado `200`.
- Respuesta recibida (JSON):

```
{"success":true,"message":"Email sent successfully","id":"c19e0f5f-3221-4831-a4ce-914bcef800a2"}
```

- Conclusión: el endpoint en producción respondió correctamente y generó un identificador de envío. Es muy probable que el correo haya sido enviado por el servicio configurado (Resend). Si no recibes el correo, revisa la bandeja de spam o los logs de Resend/Vercel.
