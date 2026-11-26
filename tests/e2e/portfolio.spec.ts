import { expect, test } from '@playwright/test';

test.describe('BAJAJ.OS Portfolio E2E & Visual QA', () => {
  test('renders sections 1-7 cleanly with interactive controls and zero console errors', async ({
    page,
  }, testInfo) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedResponses: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });
    page.on('response', (res) => {
      if (res.status() >= 400 && !res.url().includes('favicon.ico')) {
        failedResponses.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto('/');

    const skipButton = page.getByRole('button', { name: 'Skip' });
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
    }

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Aarna Bajaj');
    await page.waitForTimeout(350);

    // Section 2: Philosophy
    await expect(page.getByRole('heading', { name: /Try > Think/i })).toBeVisible();

    // Section 3: GitHub Live heatmap
    await expect(page.getByLabel('84-day GitHub activity heatmap')).toBeVisible();

    // Section 4: Featured Project Interactive Architecture
    const archTab = page.getByRole('tab', { name: 'Interactive Architecture' });
    await archTab.scrollIntoViewIfNeeded();
    await archTab.click();
    await expect(page.getByRole('button', { name: /NOVA Intelligence/i })).toBeVisible();
    await page.getByRole('button', { name: /NOVA Intelligence/i }).click();
    await expect(page.getByText(/Explicit tool allowlist/i)).toBeVisible();

    // Section 5: AI Lab Timeline view
    await page.getByRole('button', { name: 'Timeline', exact: true }).click();
    await expect(page.getByText(/TODO \/\/ NODE 01/i)).toBeVisible();

    // Section 6: Startup Idea delay simulation
    await page.getByRole('button', { name: 'Simulate Transit Delay' }).click();
    await expect(page.getByRole('button', { name: /Delay Active/i })).toBeVisible();

    // Section 7: Podcast Topic Roulette
    const beforeTopic = await page.getByText(/Selected Prompt #/i).textContent();
    await page.getByRole('button', { name: 'Spin Topic' }).click();
    const afterTopic = await page.getByText(/Selected Prompt #/i).textContent();
    expect(afterTopic).not.toBe(beforeTopic);

    // Overflow check
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(overflow).toBe(false);

    const isMobile = testInfo.project.name.includes('mobile');
    await page.screenshot({
      path: isMobile ? '.playwright-mcp/step4-mobile.png' : '.playwright-mcp/step4-desktop.png',
      fullPage: false,
    });

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(failedResponses).toEqual([]);
  });

  test('Security Lab toggle + Contact section render correctly', async ({ page }, testInfo) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await page.goto('/');

    // Skip boot sequence if present
    const skipButton = page.getByRole('button', { name: 'Skip' });
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
    }

    // ── Section 8: Security Lab ──────────────────────────────────────────────
    const secSection = page.locator('#security-lab');
    await secSection.scrollIntoViewIfNeeded();

    // The "Educational simulation" label must be visible
    await expect(page.getByText(/Educational simulation/i).first()).toBeVisible();

    // Default mode should be "Vulnerable"
    const vulnerableBtn = page.getByRole('button', { name: 'Vulnerable' });
    await expect(vulnerableBtn).toBeVisible();

    // Switch to "Hardened" mode and verify outcome badge changes
    const hardenedBtn = page.getByRole('button', { name: 'Hardened' });
    await hardenedBtn.scrollIntoViewIfNeeded();
    await hardenedBtn.click();
    // After switching, the status badge should show a "safe" outcome (422 or BOUND PARAMETER)
    await expect(page.getByText(/BLOCKED BY ZOD|BOUND PARAMETER|ESCAPED|ORIGIN \+ TOKEN|RATE LIMITED|SALTED ARGON2ID|STRICT NONCE/i).first()).toBeVisible();

    // Switch a scenario tab — XSS (shortLabel = 'XSS', has role="tab")
    const xssTab = page.getByRole('tab', { name: 'XSS', exact: true });
    await xssTab.scrollIntoViewIfNeeded();
    await xssTab.click();
    // The scenario h3 heading should update to include "XSS"
    await expect(page.getByRole('heading', { name: /XSS/i })).toBeVisible();

    // Screenshot Security Lab
    const isMobile = testInfo.project.name.includes('mobile');
    await page.screenshot({
      path: isMobile
        ? '.playwright-mcp/security-lab-mobile.png'
        : '.playwright-mcp/security-lab-desktop.png',
      fullPage: false,
    });

    // ── Section 9: Contact ───────────────────────────────────────────────────
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();

    // Scope all contact queries to the contact section to avoid strict-mode conflicts
    const contactForm = contactSection.locator('form');

    // Form fields must be present (labels: "Name", "Email", "Message")
    await expect(contactForm.getByRole('textbox', { name: 'Name', exact: true })).toBeVisible();
    await expect(contactForm.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
    await expect(contactForm.getByRole('textbox', { name: 'Message', exact: true })).toBeVisible();

    // Submit empty form → HTML5 validation prevents submission
    const submitBtn = contactForm.getByRole('button', { name: 'Send Message' });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Form should still be visible (not navigated away; HTML5 required validation fires)
    await expect(contactForm.getByRole('textbox', { name: 'Name', exact: true })).toBeVisible();

    // No console errors throughout
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});
