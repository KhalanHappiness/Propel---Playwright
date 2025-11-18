import {test, expect} from '@playwright/test'
import { loginWithMagicCode } from './LoginHelper'

test.setTimeout(200000);

test.beforeEach(async({page})=>{

  await loginWithMagicCode(page);
  await page.getByRole('link', { name: /Jobs/i }).click()
})


test('Jobs page testing', async({page})=>{

  await expect(page.getByText('Jobs', { exact: true })).toBeVisible();

  //Verify the default tab is selected

    await expect(page.getByRole('tab', { name: 'All Jobs' })).toHaveAttribute('aria-selected', 'true')

  //Verify that you can switch to Applied tab

    await page.getByRole('tab', { name: 'Applied' }).click();
    await expect(page.getByRole('tab', { name: 'Applied' })).toHaveAttribute('aria-selected', 'true')

  //Verify that you can switch to the saved tab
    await page.getByRole('tab', { name: 'Saved' }).click();
    await expect(page.getByRole('tab', { name: 'Saved' })).toHaveAttribute('aria-selected', 'true')


  //Click to go back to the default tab
    await page.getByRole('tab', { name: 'All Jobs' }).click();

  //The search functionality
  //Verfiy that a user can find the elements they are looking for
//   await page.getByRole('textbox', { name: 'Search' }).click();
//   await page.getByRole('textbox', { name: 'Search' }).fill('software')
  
//   //Verify that the user can search and returns the correct results
//   await expect(page.getByText(/software/i).first()).toBeVisible();
//   await page.locator('.iconify.iconify--fluent.base-input__suffix').first().click();

//   //Reload the page
//     await page.reload();


  //Propel Job application process
  await page.locator('.job-card').first().click();
  await page.getByRole('button', { name: 'Hide job details' }).click();
  await page.getByRole('button', { name: 'View job details' }).click();
  await page.getByRole('button', { name: 'Apply for job' }).click();
  await page.getByRole('button', { name: 'Continue anyway' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'No, don\'t update it' }).click();
  await expect(page.getByText('Your application is currently').first()).toBeVisible();

  // await page.locator('.job-card').first().click();
  // await page.getByRole('button', { name: 'Apply for job' }).click();
  // const page1Promise = page.waitForEvent('popup');
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await expect(page.getByRole('heading', { name: 'Have you apply to this job?' })).toBeVisible();
  // await expect(page.getByText('Help us track your')).toBeVisible();
  // await page.getByRole('button', { name: 'No, not yet' }).click();
  // await expect(page.getByText('Feedback Submitted')).toBeVisible();

// await page.pause()
  //Refer and earn button and fill in the required input fields
 
  const randomNum = Math.floor(Math.random() * 100000)
  await page.getByRole('button', { name: 'Refer and earn' }).click();  
  await page.getByRole('textbox', { name: 'Enter full name' }).fill('Test');
  await page.getByRole('textbox', { name: 'name@example.com' }).fill(`test${randomNum}@yopmail.com`);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Ok, got it' }).click();
 
  //share icon buttons 
  await page.locator('.btn.btn-secondary.btn-lg.btn-icon').first().click();
  await page.locator('.btn.btn-secondary.btn-lg.btn-icon').first().click();
  await page.getByRole('button', { name: 'Propel - Grow Without Borders' }).click();
  await page.getByRole('button', { name: 'Copy Link', exact: true }).click();

  //To view and hide job details and leave the job page
  await page.getByRole('button', { name: 'Hide job details' }).click();
  await page.getByRole('button', { name: 'View job details' }).click();
  await page.locator('.main-topbar__left > .iconify > path').click()
 
 // Count all jobs across all pages
const allJobsTab = page.getByRole('tab', { name: /All Jobs/i });
const tabText = await allJobsTab.textContent();
const totalJobsFromTab = parseInt(tabText.match(/\d+/)[0]); // 336

let allJobsCount = 0;
let currentPage = 1;

// Loop through all pages
while (true) {
  // Count jobs on current page
  const jobCards = page.locator('.job-card');
  const jobsOnPage = await jobCards.count();
  allJobsCount += jobsOnPage;
  
  console.log(`Page ${currentPage}: ${jobsOnPage} jobs (Total so far: ${allJobsCount})`);
  
  // Try to click NEXT button
  const nextButton = page.getByRole('listitem').filter({ hasText: 'NEXT' });
  
  // Check if NEXT button is disabled or doesn't exist
  const isDisabled = await nextButton.getAttribute('class').then(
    className => className?.includes('disabled')
  ).catch(() => true);
  
  if (isDisabled) {
    break; // No more pages
  }
  
  // Click NEXT and wait for new page to load
  await nextButton.click();
  currentPage++;
}

// Assert total count matches
expect(allJobsCount).toBe(totalJobsFromTab);
console.log(`Total jobs counted: ${allJobsCount}, Expected: ${totalJobsFromTab}`);


 // Get the count from the "Applied" tab
 await page.getByRole('tab', { name: 'Applied' }).click();

  const appliedJobsTab = page.getByRole('tab', { name: /Applied/i });
  const tab2Text = await appliedJobsTab.textContent();
  const tab2Count = parseInt(tab2Text.match(/\d+/)[0]); // Extract number from "applied jobs"
  
  // Count the actual job cards displayed on the page
  const appliedJobCards = page.locator('.job-card');
  const displayedCount = await appliedJobCards.count();
  
  // Assert they match (or use appropriate logic for pagination)
  expect(displayedCount).toBeLessThanOrEqual(tab2Count);
  
  console.log(`Tab shows: ${tab2Count} jobs, Page displays: ${displayedCount} jobs`);

  
 // Get the count from the "Applied" tab
 await page.getByRole('tab', { name: 'Saved' }).click();

  const savedJobsTab = page.getByRole('tab', { name: /Saved/i });
  const tab3Text = await savedJobsTab.textContent();
  const tab3Count = parseInt(tab3Text.match(/\d+/)[0]); // Extract number from "applied jobs"
  
  // Count the actual job cards displayed on the page
  const savedJobCards = page.locator('.job-card');
  const displayCount3 = await savedJobCards.count();
  
  // Assert they match (or use appropriate logic for pagination)
  expect(displayCount3).toBeLessThanOrEqual(tab3Count);

  //click the all jobs tab
  await expect(page.getByRole('tab', { name: 'All Jobs' })).toHaveAttribute('aria-selected', 'true')

  
  console.log(`Tab shows: ${tab3Count} jobs, Page displays: ${displayCount3} jobs`);
})