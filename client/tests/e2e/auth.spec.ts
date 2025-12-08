import { test, expect } from '@playwright/test';

import {
  mockAuthState,
  mockLoginEndpoint,
  mockRegisterEndpoint,
  mockUserDownloads,
} from './fixtures/mock-routes';

const testUser = {
  id: 42,
  email: 'testuser@example.com',
  first_name: 'Test',
  last_name: 'User',
};

test('User can sign in and is taken to account page', async ({ page }) => {
  await mockAuthState(page, { authenticated: false });
  await mockLoginEndpoint(page, testUser);
  await mockUserDownloads(page, []);

  await page.goto('/login');

  await page.getByRole('textbox', { name: /Email address input/i }).fill(testUser.email);
  await page.getByRole('textbox', { name: /Password input/i }).fill('password123!');

  await page.getByRole('button', { name: /Sign in button/i }).click();

  await page.waitForURL('**/account');
  await expect(page.getByRole('heading', { level: 1, name: /Welcome, Test/i })).toBeVisible();
});

test('User can register and is taken to account page', async ({ page }) => {
  await mockAuthState(page, { authenticated: false });
  await mockRegisterEndpoint(page, testUser);
  await mockLoginEndpoint(page, testUser);
  await mockUserDownloads(page, []);

  await page.goto('/register');

  await page.getByRole('textbox', { name: /First name input/i }).fill(testUser.first_name);
  await page.getByRole('textbox', { name: /Last name input/i }).fill(testUser.last_name);
  await page.getByRole('textbox', { name: /Register email input/i }).fill(testUser.email);
  await page.getByRole('textbox', { name: /Register password input/i }).fill('Password123!');
  await page.getByRole('textbox', { name: /Confirm password input/i }).fill('Password123!');

  await page.getByRole('button', { name: /Create account button/i }).click();

  await page.waitForURL('**/account');
  await expect(page.getByRole('heading', { level: 1, name: /Welcome, Test/i })).toBeVisible();
});

