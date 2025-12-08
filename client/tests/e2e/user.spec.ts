import { test, expect } from '@playwright/test';

import { mockAuthState, mockUserDownloads } from './fixtures/mock-routes';

const testUser = {
  id: 99,
  email: 'account@example.com',
  first_name: 'Account',
  last_name: 'User',
};

const downloadedTabs = [
  {
    id: 1,
    song_name: 'Fast Car',
    artist: 'Tracy Chapman',
    album: 'Tracy Chapman',
    genre: 'folk',
    style: 'strumming',
    difficulty: 'Beginner',
    description: 'Classic',
    lyrics_included: true,
    file_url: 'tabs/fast-car.pdf',
    file_name: 'fast-car.pdf',
  },
  {
    id: 2,
    song_name: 'Wonderwall',
    artist: 'Oasis',
    album: "(What's the Story) Morning Glory?",
    genre: 'rock',
    style: 'strumming',
    difficulty: 'Beginner',
    description: 'Hit song',
    lyrics_included: false,
    file_url: 'tabs/wonderwall.pdf',
    file_name: 'wonderwall.pdf',
  },
];

test('Account page shows empty state when no downloads', async ({ page }) => {
  await mockAuthState(page, { authenticated: true, user: testUser });
  await mockUserDownloads(page, []);

  await page.goto('/account');

  await expect(page.getByRole('heading', { level: 1, name: /Welcome, Account/i })).toBeVisible();
  await expect(page.getByText("Oh no, you haven't downloaded any tabs yet")).toBeVisible();
});

test('Account page shows downloaded tabs table when present', async ({ page }) => {
  await mockAuthState(page, { authenticated: true, user: testUser });
  await mockUserDownloads(page, downloadedTabs);

  await page.goto('/account');

  await expect(page.getByRole('heading', { level: 1, name: /Welcome, Account/i })).toBeVisible();
  await expect(page.getByRole('table', { name: /Downloaded tabs table/i })).toBeVisible();
  await expect(page.getByRole('row', { name: /Fast Car/ })).toBeVisible();
  await expect(page.getByRole('row', { name: /Wonderwall/ })).toBeVisible();
});

