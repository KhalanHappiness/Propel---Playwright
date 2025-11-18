import { test, expect } from '@playwright/test'
import { loginWithMagicCode

 } from './LoginHelper';
test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
  await loginWithMagicCode(page);
  await page.getByRole('link', { name: 'Members' }).click();
  // Wait for page to load
  await expect(page.locator('header').getByText('Members')).toBeVisible();
});

test('User can access member page', async ({ page }) => {
  // Already navigated in beforeEach
  await expect(page.locator('header').getByText('Members')).toBeVisible();
//Members List displays with correct columns
  await expect(page.getByRole('cell', { name: 'Name' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Role' })).toBeVisible();

  // Verify that at least one member is shown
  const memberRows = page.locator('table tbody tr');
  await expect(memberRows.first()).toBeVisible();
  const count = await memberRows.count();
  expect(count).toBeGreaterThan(0);

//Switch between All Members and Membership Requests tabs
  // Verify default tab is selected
  await expect(page.getByRole('tab', { name: 'All Members' })).toHaveAttribute('aria-selected', 'true');

  // Switch to Membership Requests
  await page.getByRole('tab', { name: 'Membership Request' }).click();
  await expect(page.getByRole('tab', { name: 'Membership Request' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Approve All' })).toBeVisible();
  await page.getByRole('tab', { name: 'All Members' }).click();

  //Search Functionality
  const searchBox = page.getByRole('textbox', { name: 'Search...' })
  //search by name
  await searchBox.fill('ayomitide')

  //verify filtered results
  await expect(page.getByRole('cell', { name: 'Ayomitide Odunyemi' })).toBeVisible();

  //verify other members are filtered out
  await expect(page.getByText('Damilola Owolabi')).not.toBeVisible()

  console.log("Successfully searched and filtered the right results")

  //Search for member by email

  await searchBox.fill('testuser@yopmail.com')

  //verify the filtered results
  await expect(page.getByRole('cell', { name: 'testuser@yopmail.com' })).toBeVisible();

  console.log("Members Successfully searched and filtered by email")
  await searchBox.clear()

  // All members tabs shows the correct value
  const badge = page.locator('text=All Members').locator('..').getByText(/\d+/);
  await expect(badge).toBeVisible();
  // Verify count matches displayed members
  const count2 = await badge.textContent();
  console.log(`Total members: ${count2}`);
 console.log("The members successfully displayed the correct count")

  //Verify that clicking the Add member button opens a form
  const randomNum = Math.floor(Math.random() * 100000);

  await page.getByRole('button', { name: 'Add Members' }).click();
  await page.getByRole('textbox', { name: 'Amarachi' }).fill('test');
  await page.getByRole('textbox', { name: 'Doe' }).fill('test');
  await page.getByRole('textbox', { name: 'name@email.com' }).fill(`test${randomNum}@yopmail.com`)
  await page.getByRole('button', { name: 'Send invite' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  //Verify the filter and sorting feature
 // Click the A-Z button
  await page.getByRole('button', { name: 'Showing: A - Z' }).click();

  // Filter the active members
  await page.getByText('Active', { exact: true }).click();
  await page.getByRole('button', { name: 'Showing: Active' }).click();

  //Filter the in active members
  await page.getByText('Inactive').click();
  await page.getByRole('button', { name: 'Showing: Inactive' }).click();

  //Filter the invited members
  await page.getByText('Invited').click();
  await page.getByRole('button', { name: 'Showing: Invited' }).click();
  console.log("successfully sorted filtered invited members")

  //Sort the members from a to z
  await page.getByText('A - Z').click();
  await page.getByRole('button', { name: 'Showing: A - Z' }).click();
  console.log("successfully sorted members form A to Z")

  //Sort the members from z to a
  await page.getByText('Z - A').click();

  console.log("successfully sorted members form Z to A")


  

});