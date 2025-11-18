import { test, expect } from '@playwright/test';

test('signup test', async ({ page }) => {
  test.setTimeout(150000);
  
  await page.goto('https://app.propelcommunity.app', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  //click the cookies accept all button
  await page.getByRole('button', { name: 'Accept all' }).click();

  //Click the signup button
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  //Fill in the sign up form
  const randomNum = Math.floor(Math.random() * 100000);
  await page.getByRole('textbox', { name: 'Email address*' }).fill(`test${randomNum}@yopmail.com`);
  await page.getByRole('textbox', { name: 'First name*' }).fill('test');
  await page.getByRole('textbox', { name: 'Last name*' }).fill('test');
  await page.locator('.checkbox-icon').click();
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();

  await page.pause()

  //Enter the magic code
  await page.getByRole('textbox', { name: '••••••' }).fill('008151');

  //Create password
  await page.getByRole('textbox', { name: '•••••••••••' }).fill('Testuser@2020!');
  await page.getByRole('button', { name: 'Create Password' }).click();

  //Go through the on boarding process
  await page.locator('.form-control.base-select--placeholder').first().selectOption('Female');
  await page.locator('.form-control.base-select--placeholder').first().selectOption('Norway');
  await page.locator('.form-control.base-select--placeholder').first().selectOption('Data Engineer');
  await page.locator('.form-control.base-select--placeholder').first().selectOption('Beginner (Less than 1 year)');
  await page.locator('.form-control.base-select--placeholder').first().selectOption('Land a new job');
  await page.locator('.form-control.base-select--placeholder').first().selectOption('Explore gig opportunities');
  await page.locator('div:nth-child(6) > .base-select-wrapper > .base-select-container > .form-control').selectOption('Friend/Colleague');
   await page.getByRole('button', { name: 'Continue' }).click();

   //User should be able to select or search for interests

 await page.getByRole('textbox', { name: 'Search skills & interest...' }).click();
 await page.locator('div:nth-child(2) > .icon > path').click();
 await page.locator('div:nth-child(3)').first().click();
  await page.getByRole('button', { name: 'Continue' }).click();

    //User should be able to join a community by clicking the join button on a community of their choice

  await page.locator('.btn.btn-secondary').first().click();
  await page.getByRole('button', { name: 'Join this community' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  
  await page.getByRole('button', { name: 'Start Tour' }).click();
  await expect(page.getByText('Welcome back 👋')).toBeVisible();

  
});
 
  
  

 