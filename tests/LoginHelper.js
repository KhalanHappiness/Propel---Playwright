import { expect } from '@playwright/test';

async function loginWithMagicCode(page) {
  await page.goto('https://app.propelcommunity.app/log-in', {
    waitUntil: 'domcontentloaded',
    timeout: 80000
  });

  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
    console.log('Network idle timeout - continuing anyway');
  });

  // Step 1: Enter email
  const emailInput = page.getByPlaceholder('name@example.com');
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.fill('testuser@yopmail.com');

  // Step 2: Click login button
  const loginButton = page.getByRole('button', { name: 'Log in with magic code' });
  await loginButton.waitFor({ state: 'visible', timeout: 10000 });
  await loginButton.click();

  // Step 3: Enter magic code
  const magicCodeInput = page.getByPlaceholder('••••••');
  await magicCodeInput.waitFor({ state: 'visible', timeout: 15000 });
  await magicCodeInput.fill('008151');

  //Confirmation that the community page has been displayed
  const successMessage = page.getByText('Dive into your community of choice.');
  await successMessage.waitFor({ state: 'visible', timeout: 15000 });

  // Join a random community 
  // const joinButtons = page.getByRole('link').filter({ hasText: /^$/ });
  // const joinCount = await joinButtons.count();
  // if (joinCount > 0) {
  //   const randomIndex = Math.floor(Math.random() * joinCount);
  //   await joinButtons.nth(randomIndex).click();
  // }

  //Join a community
 await page.getByRole('link').filter({ hasText: /^$/ }).nth(2).click();

  // Click the accept all cookies modal
   await page.getByRole('button', { name: 'Accept All' }).click()

  await expect(page.getByText('Welcome back 👋')).toBeVisible();


 console.log('Login with magic code successful');


}

export { loginWithMagicCode }