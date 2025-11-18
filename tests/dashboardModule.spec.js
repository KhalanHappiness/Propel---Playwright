import { loginWithMagicCode } from './LoginHelper'
import {test, expect} from '@playwright/test'
import { beforeEach } from 'node:test'

test.setTimeout(200000);


test.beforeEach(async({page})=>{

    await loginWithMagicCode(page)



})

test('Dashboard ', async ({page})=>{
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await expect(page.getByText('Welcome back 👋')).toBeVisible();
  await page.locator('.dashboard-section > div > a').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByText('Showcase what matters Talent Profile 83% Completed Complete profile').click();
  await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Apply now' }).click();
  await expect(page.locator('header').getByText('Finance')).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'View Jobs' }).click();
  await expect(page.locator('header').getByText('Jobs', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button').nth(4).click();
  await page.getByRole('link', { name: 'Browse Courses' }).click();
  await expect(page.getByText('Courses', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button').nth(4).click();
  await page.getByRole('button').nth(4).click();
  await page.getByRole('link', { name: 'Browse opportunities' }).click();
  await expect(page.locator('header').getByText('Opportunities')).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button').nth(4).click();
  await page.locator('.d-flex.justify-content-between.item-lists').first().click();
  await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.locator('#dashboardHome').getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
  await expect(page.locator('header').getByText('Jobs', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.locator('#dashboardHome').getByRole('link').filter({ hasText: /^$/ }).nth(2).click();
  await expect(page.locator('header').getByText('Finance')).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.locator('#dashboardHome').getByRole('link').filter({ hasText: /^$/ }).nth(3).click();
  await expect(page.getByText('Referral', { exact: true }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'View all opportunities' }).click();
  await expect(page.locator('header').getByText('Opportunities')).toBeVisible();
  await page.getByRole('link', { name: 'Dashboard' }).click();


})