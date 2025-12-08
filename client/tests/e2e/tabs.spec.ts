import { test, expect } from '@playwright/test';

import { navigateToSong } from './helpers/helpers.ts';
import { mockTabData, mockAuthState, mockDownloadEndpoint } from './fixtures/mock-routes.ts';
import type { TabResponse } from '../../src/types/tab.ts';

const wonderwallTab: TabResponse = {
  id: 2,
  song_name: "Wonderwall",
  artist: "Oasis",
  album: "(What's the Story) Morning Glory?",
  genre: "rock",
  style: "strumming",
  difficulty: "Beginner",
  description: "Released in 1995 on Oasis's landmark album '(What's the Story) Morning Glory?', 'Wonderwall' has become one of the most recognizable acoustic songs of the 1990s. Built around a steady strumming pattern in a capoed open position, it blends simple chord shapes with a rich, rhythmic groove that’s great for singalongs. The song is perfect for guitarists looking to develop timing, chord transitions, and dynamics while learning an enduring Britpop anthem.",
  lyrics_included: false,
  file_url: "tabs/oasis/wonderwall-351528e256.pdf",
  file_name: "wonderwall.pdf"
};

test('Logged-in user can download a tab', async ({ page }) => {
  await mockAuthState(page, { authenticated: true });
  await mockTabData(page, wonderwallTab);
  await mockDownloadEndpoint(page, wonderwallTab);

  await navigateToSong(page);

  const downloadButton = page.getByRole('button', { name: /Download song button/i });
  await expect(downloadButton).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    downloadButton.click(), 
  ]);

  const filename = download.suggestedFilename();
  const path = await download.path();

  expect(filename).toMatch(/wonderwall.*\.pdf/);
  expect(path).toBeTruthy();
});

test('Unauthenticated user sees auth modal when attempting download', async ({ page }) => {
  await mockAuthState(page, { authenticated: false });
  await mockTabData(page, wonderwallTab);
  await mockDownloadEndpoint(page, wonderwallTab);

  await navigateToSong(page);

  const downloadButton = page.getByRole('button', { name: /Download song button/i });
  await downloadButton.click();

  await expect(page.getByRole('heading', { name: /Before you download/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Redirect to sign into an account button/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Redirect to create an account button/i })).toBeVisible();
});