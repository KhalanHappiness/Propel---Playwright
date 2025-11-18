// global-setup.js
import { chromium } from '@playwright/test';
import { loginWithMagicCode } from './tests/LoginHelper';

async function globalSetup(config) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await loginWithMagicCode(page);
  
  // Save signed-in state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  
  await browser.close();
  console.log('✓ Authentication state saved');
}

export default globalSetup;