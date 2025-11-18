import {test, expect} from '@playwright/test'


test("Test for ashton page functionality on all browsers", async({page})=>{

    await page.goto('https://roaspig.com/login')
  await page.getByRole('textbox', { name: 'you@brand.com' }).click();
  await page.getByRole('textbox', { name: 'you@brand.com' }).fill('happinesskhalan@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Khalan@2020!');
  await page.getByRole('button', { name: '👁️‍🗨️' }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.locator('[data-test-id="button-skip"]').click();
    await page.pause()
})