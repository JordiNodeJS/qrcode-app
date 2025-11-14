const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const base = process.env.TARGET_URL || 'https://qrcode-8bga5sid7-melosdevs-projects.vercel.app';
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Opening home page...');
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'home.png'), fullPage: true });

  // Try to generate a QR by filling the first text input we find
  console.log('Attempting QR generation...');
  try {
    const inputSelectors = [
      'input[type="text"]',
      'input[name="text"]',
      'input[placeholder*="Text"]',
      'textarea',
    ];
    let filled = false;
    for (const sel of inputSelectors) {
      const el = await page.$(sel);
      if (el) {
        await el.fill('Prueba de QR desde Playwright ' + Date.now());
        filled = true;
        break;
      }
    }
    // wait a bit for QR to render
    if (filled) await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, 'qr.png'), fullPage: true });
  } catch (err) {
    console.error('QR generation step failed:', err.message);
  }

  // Contact form
  console.log('Opening contact page...');
  await page.goto(base + '/contact', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'contact_page.png'), fullPage: true });

  console.log('Filling contact form...');
  try {
    const tryFill = async (selectors, value) => {
      for (const sel of selectors) {
        try {
          const el = await page.$(sel);
          if (el) {
            await el.fill(value);
            return true;
          }
        } catch (e) {
          // ignore
        }
      }
      return false;
    };

    await tryFill(['input[name="name"]', 'input[placeholder*="Name"]', 'input#name', 'input'], 'Playwright Tester');
    await tryFill(['input[name="email"]', 'input[placeholder*="Email"]', 'input#email'], 'tester+pw@webcode.es');
    await tryFill(['input[name="subject"]', 'input[placeholder*="Subject"]', 'input#subject'], 'Prueba desde Playwright');
    await tryFill(['textarea[name="message"]', 'textarea[placeholder*="Message"]', 'textarea#message', 'textarea'], 'Este es un mensaje de prueba enviado automáticamente por Playwright para verificar el form.');

    // Try clicking submit buttons
    const submitSelectors = ['button[type="submit"]', 'button:has-text("Send")', 'button:has-text("Enviar")', 'input[type="submit"]'];
    let clicked = false;
    for (const s of submitSelectors) {
      try {
        const btn = await page.$(s);
        if (btn) {
          await Promise.all([page.waitForResponse(r => r.status() === 200 || r.status() === 201, { timeout: 5000 }).catch(() => {}), btn.click().catch(() => {})]);
          clicked = true;
          break;
        }
      } catch (e) {}
    }

    // wait and capture result
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, 'contact_after_submit.png'), fullPage: true });
  } catch (err) {
    console.error('Contact form step failed:', err.message);
  }

  await browser.close();
  console.log('Screenshots saved to', outDir);
})();
