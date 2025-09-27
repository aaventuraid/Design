const { test, expect } = require('@playwright/test');
const crypto = require('crypto');

function uniqueEmail() {
  return `e2e_${Date.now()}_${crypto.randomBytes(4).toString('hex')}@example.com`;
}

test.describe('End-to-End User Journey', () => {
  test('register -> generate copy -> process image', async ({ page, baseURL }) => {
    const email = uniqueEmail();
    const password = 'StrongP@ssw0rd';

    await page.goto('/auth');
    await expect(page.getByRole('heading', { name: 'Masuk ke Akun' })).toBeVisible();

    await page.getByRole('button', { name: 'Belum punya akun? Daftar' }).click();
    await expect(page.getByRole('heading', { name: 'Daftar Akun Baru' })).toBeVisible();

    await page.locator('#email').fill(email);
    await page.locator('#username').fill('e2euser');
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: 'Daftar' }).click();

    await page.waitForURL(/\/(dashboard|admin)/, { timeout: 15000 });

    await page.goto('/');

    const copyGeneratorButton = page.getByRole('button', { name: /Generator Copy AI/i });
    await copyGeneratorButton.click();

    const productInput = page.getByPlaceholder('Contoh: Beef Yakiniku Premium');
    await productInput.fill('Beef Yakiniku Premium');
    const generateBtn = page.getByRole('button', { name: /Buat Copy Otomatis/ });
    await generateBtn.click();

    await expect(page.getByText('📝 Judul Produk').first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('📋 Deskripsi Produk').first()).toBeVisible();

    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(pngBase64, 'base64');

    const fileChooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Pilih Foto' }).click();
    const chooser = await fileChooser;
    await chooser.setFiles({ name: 'tiny.png', mimeType: 'image/png', buffer });

    await expect(page.getByRole('heading', { name: 'Hasil Pemrosesan' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Unduh (PNG|JPEG)/ })).toBeVisible({ timeout: 15000 });

    const metricsResp = await page.request.get(`${baseURL}/api/metrics`);
    expect(metricsResp.ok()).toBeTruthy();
    const metricsText = await metricsResp.text();
    expect(metricsText).toContain('app_requests_total');
    expect(metricsText).toContain('copy_generated_total');
    expect(metricsText).toContain('image_processed_total');
  });
});
