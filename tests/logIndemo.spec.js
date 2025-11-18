import  {test, expect} from '@playwright/test'

test ('Demo login test ', async ({page}) =>{

    await page.goto('https://app.propelcommunity.com/log-in')
    
     await page.getByRole('textbox', { name: 'name@example.com' }).fill('testuser@yopmail.com');
  await page.getByRole('button', { name: 'Log in with magic code' }).click();
  await page.getByRole('textbox', { name: '••••••' }).fill('008151');
  await page.getByRole('button', { name: 'Show 21 more communities' }).click();
  await page.locator('div:nth-child(19) > .user-communities__inner > .btn-none').click();
  await page.getByRole('button', { name: 'Accept all' }).click();
})