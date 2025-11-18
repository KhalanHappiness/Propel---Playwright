import {expect, test} from '@playwright/test'
import { loginWithMagicCode } from './LoginHelper'


test.setTimeout(200000)

test.beforeEach(async({page})=>{

    await loginWithMagicCode(page)
    await page.getByRole('complementary').getByText('Opportunities', { exact: true }).click();
})


test('Testing the opportunities module', async({page})=>{

 
  await page.getByRole('link', { name: 'Learn more' }).nth(1).click();
  await page.getByRole('button', { name: 'View opportunity' }).click();
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Take me to opportunity' }).click();
  const page2 = await page2Promise;
  await page.bringToFront()
  await page.locator('.iconify.iconify--carbon').click();

  //Click to save
  await page.getByRole('button').filter({ hasText: 'Save' }).click();

  //Click to share the opportunity
  await page.getByRole('button').filter({ hasText: 'Tell your community' }).click();
  await page.getByRole('button', { name: 'Share to slack' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  //Clicking to exit the specified opportunity page
  await page.locator('.main-topbar__left > .iconify > path').click()


  //Tell your community link
  await page.getByRole('link', { name: 'Tell community' }).first().click();
  await page.getByRole('button', { name: 'Share to slack' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  //Testing the search functionality
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Sandoz');
  await page.getByRole('textbox', { name: 'Search' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Sandoz Schorlaship 2025' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search' }).clear()

  //Testing the filter functionality using the opportunity tags

  await page.getByRole('tab', { name: 'General' }).click();
  await page.getByRole('tab', { name: 'Education' }).click();
  await page.getByRole('tab', { name: 'Hackathon', exact: true }).click();
  await page.getByRole('tab', { name: 'Gig' }).click();
  await page.getByRole('tab', { name: 'Scholarship' }).click();

  await page.getByRole('tab', { name: 'All' }).click();
  await page.reload()



})