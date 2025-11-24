import { Page } from '@playwright/test';

import type { TabResponse } from "../../../src/types/tab";

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
    const fakePdf = createFakePdf();
    await route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      body: fakePdf,
    });
  });
}

function createFakePdf() {
  return Buffer.from(
    `%PDF-1.3
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] >>
endobj
trailer
<< /Root 1 0 R >>
%%EOF`
  );
}