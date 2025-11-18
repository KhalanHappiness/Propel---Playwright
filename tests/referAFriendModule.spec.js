import { expect, test } from "@playwright/test";

import { loginWithMagicCode } from "./LoginHelper";
test.setTimeout(150000);


test.beforeEach(async({page})=>{

    await loginWithMagicCode(page)


})

test('testing the refer a friend module', async({page, context})=>{

  // Grant clipboard permissions before interacting with clipboard
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.getByRole('complementary').locator('a').filter({ hasText: 'Refer a Friend' }).click();

  await page.getByRole('textbox').locator('..').getByRole('button').click();
  
  // Now clipboard read will work
  const copiedLink = await page.evaluate(() => navigator.clipboard.readText());
  
  console.log('Copied link:', copiedLink);

  const newPage = await context.newPage();
  await newPage.goto(copiedLink);
  
  await expect(newPage.getByRole('heading', { name: 'Sign up to join a community' })).toBeVisible();
  
  await newPage.close();
})