import {test, expect} from '@playwright/test'
import { loginWithMagicCode } from './LoginHelper'

test.setTimeout(200000);


test.beforeEach(async({page})=>{

    await loginWithMagicCode(page)
    await page.locator('a').filter({ hasText: 'Finance' }).click();

})

test('Finance module testing', async({page})=>{

    await expect(page.getByRole('tab', {name: 'Loan Products'})).toHaveAttribute('aria-selected', 'true')

    await page.getByRole('tab', { name: 'Loan History' }).click();
    await expect(page.getByRole('tab', {name: 'Loan History'})).toHaveAttribute('aria-selected', 'true')

    // Fill passcode
    await page.getByRole('textbox').first().fill('1');
    await page.getByRole('textbox').nth(1).fill('2');
    await page.getByRole('textbox').nth(2).fill('3');
    await page.getByRole('textbox').nth(3).fill('4');
    
    // Click Continue in the passcode dialog
    await page.getByRole('dialog').filter({ hasText: 'Enter your passcode' }).getByRole('button', { name: 'Continue' }).click();

    await page.locator('.main-topbar__left > .iconify').click();

    // Applying for cash loan
    await page.locator('a').filter({ hasText: 'Get cash loans' }).click();
    
    // Click Continue in the finance partner info dialog
    await page.getByRole('dialog').filter({ hasText: 'In order to serve you' }).getByRole('button', { name: 'Continue' }).click();

    // Fill passcode again
    await page.getByRole('textbox').first().fill('1');
    await page.getByRole('textbox').nth(1).fill('2');
    await page.getByRole('textbox').nth(2).fill('3');
    await page.getByRole('textbox').nth(3).fill('4');

    // Click Continue in the passcode dialog (second time)
    await page.getByRole('dialog').filter({ hasText: 'Enter your passcode' }).getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('textbox', { name: 'Enter loan amount' }).fill('₦ 4,0000');
    await page.getByRole('button', { name: 'Select loan purpose' }).click();
    await page.getByText('Rent', { exact: true }).click();
    await page.getByRole('textbox', { name: '08012345678' }).fill('08022132324');
    await page.getByRole('dialog').locator('svg').nth(3).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // await page.pause()



})