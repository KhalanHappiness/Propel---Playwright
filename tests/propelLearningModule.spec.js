import { expect, test } from "@playwright/test";
import { loginWithMagicCode } from "./LoginHelper";


test.setTimeout(200000);


test.beforeEach(async({page})=>{

    await loginWithMagicCode(page)
    await page.locator('a').filter({ hasText: 'Propel Learning' }).click();
})


test('Testing the propel learning page', async({page, context})=>{
    
  await page.getByText('Soft Skills', { exact: true }).click();
  await page.locator('.card-bottom').first().click();
  await page.getByRole('link', { name: 'View course' }).first().click();
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Enrol now' }).click();
  const page2 = await page2Promise;
  await page2.goto('https://www.jobberman.com/softskills/registration/propel/zoom');
  await page2.getByRole('region', { name: 'Cookie banner' }).click();
  await page2.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.bringToFront()

  // Grant clipboard permissions
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  //testing to ensure that the share functionalities work
  await page.getByRole('button').filter({ hasText: 'Copy link' }).click();
  await expect(page.getByText('Link Copied!')).toBeVisible();
 

  // Read from clipboard
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText())

  expect(clipboardText).toBe('https://www.jobberman.com/softskills/registration/propel/zoom');


  //Leaving the softskills course page 

  await page.locator('.main-topbar__left > .iconify').click();

  //share button functionality
 await page.getByTitle('Free Soft Skills Training for').click();
 await page.getByRole('button', { name: 'Copy Link', exact: true }).click()

  const clipboardText2 = await page.evaluate(() => navigator.clipboard.readText())
  expect(clipboardText2).toBe('https://www.jobberman.com/softskills/registration/propel/zoom');




})