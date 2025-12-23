import { test, expect } from '@playwright/test';

import { mockAuthState, mockUserDownloads } from './fixtures/mock-routes';
import { testUser, downloadedTabs } from './constants';

test('Account page shows empty state when no downloads', async ({ page }) => {
  await mockAuthState(page, { authenticated: true, user: testUser });
  await mockUserDownloads(page, []);

  await page.goto('/account');

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: `Welcome, ${testUser.first_name}`,
    })
  ).toBeVisible();

  await expect(page.getByText("You have no downloaded songs. You can browse our selection of music sheets to download here.")).toBeVisible();
});

test('Account page shows downloaded tabs table when present', async ({ page }) => {
  await mockAuthState(page, { authenticated: true, user: testUser });
  await mockUserDownloads(page, downloadedTabs);

  await page.goto('/account');

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: `Welcome, ${testUser.first_name}`,
    })
  ).toBeVisible();
  
  await expect(page.getByRole('table', { name: /Downloaded tabs table/i })).toBeVisible();
  await expect(page.getByRole('row', { name: /Fast Car/ })).toBeVisible();
  await expect(page.getByRole('row', { name: /Wonderwall/ })).toBeVisible();
});

