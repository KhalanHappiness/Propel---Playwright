import {test, expect} from '@playwright/test'
import { loginWithMagicCode } from "./LoginHelper";


test.setTimeout(200000);



test.beforeEach(async({page})=>{

    await loginWithMagicCode(page)
})

test('Testing the profile page', async({page})=>{
 await page.getByRole('button', { name: 'avatar Saadat' }).click();
 await page.getByRole('menuitem', { name: 'My Profile' }).click();
 await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

})