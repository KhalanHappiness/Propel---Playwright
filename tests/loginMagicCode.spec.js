const { test, expect } = require('@playwright/test');
import { loginWithMagicCode } from './LoginHelper';

test.describe('Login Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Increase timeout for this specific beforeEach
    test.setTimeout(120000); // 2 minutes
    
    await page.goto('https://app.propelcommunity.app/log-in', {
      waitUntil: 'domcontentloaded',
      timeout: 80000
    });
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      console.log('Network idle timeout - continuing anyway');
    });
  });

 test('Login with valid email and magic code', async ({ page }) => {
    await loginWithMagicCode(page)
  });

  test('Negative: empty email disables login button', async ({ page }) => {
    console.log('Testing empty email scenario');
    
    // Wait for login button to be present
    const loginBtn = page.getByRole('button', { name: 'Log in with magic code' });
    await loginBtn.waitFor({ state: 'visible', timeout: 10000 });
    
    // Button should be disabled with empty email
    await expect(loginBtn).toBeDisabled();
    console.log('Login button is disabled as expected');
  });

  test('Negative Test: invalid magic code', async ({ page }) => {
    console.log('Starting login test with invalid magic code');
    
    // Step 1: Enter email
    const emailInput = page.getByPlaceholder('name@example.com');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill('testuser@yopmail.com');
    console.log('Email entered');

    // Step 2: Click login button
    const loginButton = page.getByRole('button', { name: 'Log in with magic code' });
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();
    console.log('Login button clicked');

    // Step 3: Wait for magic code input and enter invalid code
    const magicCodeInput = page.getByPlaceholder('••••••');
    await magicCodeInput.waitFor({ state: 'visible', timeout: 15000 });
    await magicCodeInput.fill('008152');
    console.log('Invalid magic code entered');
    
    // Wait for error processing
    await page.waitForTimeout(2000);

    // Step 4: Confirm error message appears
    const errorMessage = page.getByText('Invalid token please try again');
    await errorMessage.waitFor({ state: 'visible', timeout: 15000 });
    await expect(errorMessage).toBeVisible();
    console.log('Error message displayed as expected');
  });

});