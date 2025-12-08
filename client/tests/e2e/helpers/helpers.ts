import { expect, type Page } from '@playwright/test';

export async function navigateToSong(page: Page) {
  //Go to landing page
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('superguitartab.com');

  //Search song
  const searchButton = page.getByRole('button', { name: /Open search/i });
  await expect(searchButton).toBeVisible();
  await searchButton.click();

  await expect(page.locator('#search_bar_modal')).toBeVisible();
  const searchInput = page.getByRole('textbox', { name: /Search input/i });
  await expect(searchInput).toBeVisible();
  await searchInput.click(); 
  await searchInput.fill("Wonderwall");
  await expect(searchInput).toHaveValue('Wonderwall', { timeout: 2000 });

  const songRow = page.locator('#song-row-2');
  await expect(songRow).toBeVisible();
  await expect(songRow).toContainText('Wonderwall');
  await expect(songRow).toContainText('Oasis');
  await songRow.click(); 

  await expect(page).toHaveURL('/song/2');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Wonderwall');
}