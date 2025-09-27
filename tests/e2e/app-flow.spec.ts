import { test, expect } from '@playwright/test';
import crypto from 'crypto';

// Helper to generate unique email per run
function uniqueEmail() {
  return `e2e_${Date.now()}_${crypto.randomBytes(4).toString('hex')}@example.com`;
}

test.describe('End-to-End User Journey', () => {
  test('register -> generate copy -> process image', async ({ page, baseURL }) => {
    const email = uniqueEmail();
    const password = 'StrongP@ssw0rd';

    // 1. Visit auth page
    await page.goto('/auth');
    await expect(page.getByRole('heading', { name: 'Masuk ke Akun' })).toBeVisible();

    // 2. Switch to register mode
    await page.getByRole('button', { name: 'Belum punya akun? Daftar' }).click();
    await expect(page.getByRole('heading', { name: 'Daftar Akun Baru' })).toBeVisible();

    // 3. Fill registration form
    await page.locator('#email').fill(email);
    await page.locator('#username').fill('e2euser');
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: 'Daftar' }).click();

    // 4. After register, redirect expected. Wait for either dashboard or admin redirect sequence.
    await page.waitForURL(/\/(dashboard|admin)/, { timeout: 15000 });

    // 5. Navigate to home page to use tools
    await page.goto('/');

    // 6. Expand Copy Generator
    const copyGeneratorButton = page.getByRole('button', { name: /Generator Copy AI/i });
    await copyGeneratorButton.click();

    // 7. Fill product name and generate
    const productInput = page.getByPlaceholder('Contoh: Beef Yakiniku Premium');
    await productInput.fill('Beef Yakiniku Premium');
    const generateBtn = page.getByRole('button', { name: /Buat Copy Otomatis/ });
    await generateBtn.click();

    // 8. Expect result blocks appear (title & description labels)
    await expect(page.getByText('📝 Judul Produk').first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('📋 Deskripsi Produk').first()).toBeVisible();

    // 9. Upload & process a tiny in-memory image
    // Create a 1x1 PNG data URL converted to Buffer
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(pngBase64, 'base64');

    // Set input[file] (hidden) - locate by accept attribute via CSS
    const fileChooser = page.waitForEvent('filechooser');
    // Trigger: the dropzone has a button with "Pilih Foto"
    await page.getByRole('button', { name: 'Pilih Foto' }).click();
    const chooser = await fileChooser;
    await chooser.setFiles({ name: 'tiny.png', mimeType: 'image/png', buffer });

    // 10. Wait for processed preview (Hasil Pemrosesan header then PNG badge)
    await expect(page.getByRole('heading', { name: 'Hasil Pemrosesan' })).toBeVisible();
    // Wait until download button appears (Unduh PNG / JPEG)
    await expect(page.getByRole('link', { name: /Unduh (PNG|JPEG)/ })).toBeVisible({ timeout: 15000 });

    // 11. Basic metrics endpoint smoke (optional)
    const metricsResp = await page.request.get(`${baseURL}/api/metrics`);
    expect(metricsResp.ok()).toBeTruthy();
    const metricsText = await metricsResp.text();
    expect(metricsText).toContain('app_requests_total');
    expect(metricsText).toContain('copy_generated_total');
    expect(metricsText).toContain('image_processed_total');
  });
});
