const { test, expect } = require('@playwright/test');

test.describe('Signup Functionality', () => { // Group related tests
  
  test.setTimeout(120000);
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://prop.propelcommunity.com/sign-up?utm_source=propel+website&utm_medium=browser&utm_campaign=community+landing&utm_term=signup', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  });

  test('Sign up with valid credentials', async ({ page }) => {
    const uniqueEmail = `test_${Date.now()}@yopmail.com`;
    
    // Sign up process
    await page.getByRole('textbox', { name: 'Email address*' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'First name*' }).fill('Sandra');
    await page.getByRole('textbox', { name: 'Last name*' }).fill('Joy');
    
    await page.locator('.checkbox-icon').click();

    await page.pause()
    await page.getByRole('button', { name: 'Sign up', exact: true }).click();
    
    // Magic code verification
    await page.getByPlaceholder('••••••').fill('008151');
    
    // Password set up
    await page.getByPlaceholder('•••••••••••').fill('TestAccount@2025');
    await page.getByRole('button', { name: 'Create Password' }).click();
    
    //Profile set up
    await page.getByRole('combobox').first().selectOption('Female');
    await page.getByRole('combobox').nth(1).selectOption('Nigeria');
    await page.getByRole('combobox').nth(2).selectOption('Frontend Engineer (HTML/CSS)');
    await page.getByRole('combobox').nth(3).selectOption('Other');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    //Skipping the CV upload section with the skip button
    await page.getByRole('button', { name: 'Skip' }).click();
    
    //Community joining - Random Selection
    try {
        // Wait for communities to load
        await page.waitForLoadState('networkidle');
        
        // Add some debugging to see what's on the page
        console.log('Current URL:', page.url());
        
        // Wait a bit more for dynamic content
        await page.waitForTimeout(3000);
        
        // First, let's inspect the actual DOM structure
        console.log('=== DOM INSPECTION ===');
        
        // Get all buttons and their structure
        const allButtons = await page.locator('button').all();
        console.log(`Found ${allButtons.length} total buttons on page`);
        
        for (let i = 0; i < Math.min(allButtons.length, 15); i++) {
            try {
                const buttonText = await allButtons[i].textContent();
                const buttonHTML = await allButtons[i].innerHTML();
                const buttonClass = await allButtons[i].getAttribute('class');
                console.log(`Button ${i}:`);
                console.log(`  Text: "${buttonText}"`);
                console.log(`  HTML: ${buttonHTML}`);
                console.log(`  Class: ${buttonClass}`);
                console.log('---');
            } catch (e) {
                console.log(`Button ${i}: Error getting info - ${e.message}`);
            }
        }
        
        // Try to find buttons that contain "Join" in their text content
        let joinButtons = [];
        
        for (let i = 0; i < allButtons.length; i++) {
            try {
                const buttonText = await allButtons[i].textContent();
                if (buttonText && buttonText.toLowerCase().includes('join')) {
                    // Check if the button is visible and clickable
                    const isVisible = await allButtons[i].isVisible();
                    if (isVisible) {
                        joinButtons.push(allButtons[i]);
                        console.log(`Found potential join button: "${buttonText}" (visible: ${isVisible})`);
                    }
                }
            } catch (e) {
                // Skip this button
                continue;
            }
        }
        
        if (joinButtons.length === 0) {
            // Try alternative approach - look for dropdown menus that might contain join options
            console.log('No visible buttons with "Join" found. Checking for dropdown menus...');
            
            // Look for dropdown toggles first
            const dropdownButtons = await page.locator('.dropdown-toggle, [data-toggle="dropdown"]').all();
            
            for (let dropdown of dropdownButtons) {
                try {
                    const dropdownText = await dropdown.textContent();
                    console.log(`Found dropdown: "${dropdownText}"`);
                    
                    // Click the dropdown to open it
                    await dropdown.click();
                    await page.waitForTimeout(1000); // Wait for dropdown to open
                    
                    // Now look for join options in the opened dropdown
                    const dropdownItems = await page.locator('.dropdown-item, [role="menuitem"]').all();
                    
                    for (let item of dropdownItems) {
                        const itemText = await item.textContent();
                        if (itemText && itemText.toLowerCase().includes('join')) {
                            const isVisible = await item.isVisible();
                            console.log(`Found dropdown join item: "${itemText}" (visible: ${isVisible})`);
                            
                            if (isVisible) {
                                joinButtons.push(item);
                                break; // Found one, use it
                            }
                        }
                    }
                    
                    if (joinButtons.length > 0) {
                        break; // Found join option, stop looking
                    } else {
                        // Close dropdown if no join option found
                        await dropdown.click();
                        await page.waitForTimeout(500);
                    }
                    
                } catch (e) {
                    console.log(`Error with dropdown: ${e.message}`);
                    continue;
                }
            }
        }
        
        if (joinButtons.length === 0) {
            // Final attempt - look for any clickable elements with "Join"
            console.log('Still no join options found. Trying other clickable elements...');
            
            const clickableElements = await page.locator('[role="button"], button, a, div[onclick], span[onclick]').all();
            
            for (let element of clickableElements) {
                try {
                    const elementText = await element.textContent();
                    if (elementText && elementText.toLowerCase().includes('join')) {
                        const isVisible = await element.isVisible();
                        console.log(`Found clickable join element: "${elementText}" (visible: ${isVisible})`);
                        if (isVisible) {
                            joinButtons.push(element);
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        if (joinButtons.length === 0) {
            throw new Error('No join elements found after thorough search');
        }
        
        // Generate random index
        const randomIndex = Math.floor(Math.random() * joinButtons.length);
        const selectedJoinButton = joinButtons[randomIndex];
        
        // Get the text for logging
        const selectedButtonText = await selectedJoinButton.textContent().catch(() => 'Unknown');
        
        console.log(`Randomly selected join element: "${selectedButtonText}"`);
        console.log(`Selected ${randomIndex + 1} out of ${joinButtons.length} available join elements`);
        
        // Click the randomly selected Join button
        console.log('About to click the selected join button...');
        await selectedJoinButton.click();
        console.log('Successfully clicked join button!');
        
        // Optional: Wait for confirmation or page navigation
        await page.waitForTimeout(2000);
        
        console.log('Successfully clicked join button');
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error during community selection:', errorMessage);
        
        // Take a screenshot for debugging
        await page.screenshot({ 
            path: `debug-screenshot-${Date.now()}.png`, 
            fullPage: true 
        }).catch(() => {});
        
        // Since joining a community is required to access dashboard, fail the test
        console.log('CRITICAL ERROR: Unable to join community - this will prevent dashboard access');
        throw new Error(`Community join failed: ${errorMessage}. User cannot proceed to dashboard without joining a community.`);
    }
  });

  test('Sign up with invalid email', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email address*' }).fill('user45@');
    await expect(page.getByText('Email is invalid')).toBeVisible();
  });

});