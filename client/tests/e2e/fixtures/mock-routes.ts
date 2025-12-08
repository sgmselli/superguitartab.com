import { Page } from '@playwright/test';

import type { TabResponse } from "../../../src/types/tab";
import type { UserResponse } from "../../../src/types/user";

const authenticatedUser = {
  id: 10,
  email: "user@example.com",
  first_name: "Test",
  last_name: "User",
};

export async function mockTabData(
    page: Page,
    tabData: TabResponse
) {
  await page.route(`**/api/v1/tabs/tab/${tabData.id}`, route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(tabData)
    })
  );

  await page.route(`**/tabs/${tabData.file_url}`, async route => {
    const fakePdf = new TextEncoder().encode('%PDF-1.4\n%EOF');
    await route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      body: fakePdf,
    });
  });
}

type AuthStateOptions = { authenticated: boolean; user?: UserResponse };

export async function mockAuthState(page: Page, { authenticated, user }: AuthStateOptions) {
    await page.route('**/api/v1/user/current', (route) => {
      if (authenticated) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(user ?? authenticatedUser),
        });
        return;
      }
      route.fulfill({ status: 401 });
  });

  await page.route('**/api/v1/auth/refresh', (route) => route.fulfill({ status: 401 }));
}

export async function mockDownloadEndpoint(page: Page, tab: TabResponse) {
  await page.route(`**/api/v1/tabs/tab/${tab.id}/download`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ file_url: tab.file_url }),
    })
  );
}

export async function mockLoginEndpoint(page: Page, user: UserResponse) {
  await page.route('**/api/v1/auth/login', async (route) => {
    const body = route.request().postData() ?? '';
    const formData = new URLSearchParams(body);
    const email = formData.get('username');
    const password = formData.get('password');

    if (email === user.email && password) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user),
      });
      return;
    }

    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ detail: "Incorrect username or password." }),
    });
  });
}

export async function mockRegisterEndpoint(page: Page, user: UserResponse) {
  await page.route('**/api/v1/user/register', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(user),
    });
  });
}

export async function mockUserDownloads(page: Page, tabs: any[] = []) {
  await page.route('**/api/v1/user/current/downloads', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(tabs),
    });
  });
}