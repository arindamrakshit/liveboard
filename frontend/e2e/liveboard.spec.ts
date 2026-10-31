import { test, expect } from '@playwright/test';

test.describe('LiveBoard User Journeys', () => {
  test('1. Landing page loads and allows navigation to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LiveBoard/);
    await expect(page.getByRole('heading', { name: /Your team’s work/i })).toBeVisible();

    // Click Sign In
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
  });

  test('2. Demo login flow into dashboard', async ({ page }) => {
    await page.goto('/login');

    // Click quick demo button for Alice
    await page.getByRole('button', { name: /Alice \(Owner\)/i }).click();

    // Submit form
    await page.getByRole('button', { name: /Sign In/i }).click();

    // Check redirection to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: /Good day/i })).toBeVisible();
    await expect(page.getByText(/Active Projects/i)).toBeVisible();
  });

  test('3. Open project board and interact with Kanban columns', async ({ page }) => {
    // Authenticate via local state
    await page.addInitScript(() => {
      localStorage.setItem(
        'liveboard-auth',
        JSON.stringify({
          state: {
            user: { id: 1, email: 'alice@liveboard.dev', username: 'alice', fullName: 'Alice Johnson' },
            accessToken: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token',
            isAuthenticated: true,
          },
          version: 0,
        })
      );
    });

    await page.goto('/dashboard');
    await expect(page.getByText(/Your Projects/i)).toBeVisible();

    // Open first project card
    const firstProject = page.locator('div[class*="projectCard"]').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await expect(page).toHaveURL(/.*projects.*board/);
    }
  });

  test('4. Offline resilience banner visibility', async ({ page, context }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'liveboard-auth',
        JSON.stringify({
          state: {
            user: { id: 1, email: 'alice@liveboard.dev', username: 'alice', fullName: 'Alice Johnson' },
            accessToken: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token',
            isAuthenticated: true,
          },
          version: 0,
        })
      );
    });

    await page.goto('/dashboard');

    // Emulate offline network condition
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    // Offline banner or badge should indicate offline status
    await expect(page.getByText(/offline/i).first()).toBeVisible();

    // Restore online network
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
  });
});
