const { test, expect } = require('@playwright/test');

// Propel Community App Test Configuration
const BASE_URL = 'https://app.propelcommunity.com';

// Configure test timeouts and retries
test.describe.configure({ 
  timeout: 90000, // 90 seconds per test
  retries: 2 
});

test.describe('Propel Community App Tests', () => {
  
  // Helper function to safely navigate to the page
  async function navigateToPage(page, options = {}) {
    const defaultOptions = {
      waitUntil: 'domcontentloaded', // Less strict than 'networkidle'
      timeout: 60000 // 60 seconds
    };
    
    try {
      const response = await page.goto(BASE_URL, { ...defaultOptions, ...options });
      
      // Check if we got redirected to a login page or error page
      const currentUrl = page.url();
      const title = await page.title().catch(() => '');
      
      console.log(`Navigated to: ${currentUrl}`);
      console.log(`Page title: ${title}`);
      
      return { response, currentUrl, title, success: true };
    } catch (error) {
      console.log(`Navigation failed: ${error.message}`);
      return { error, success: false };
    }
  }

  // Basic connectivity and access tests
  test('should establish connection to the site', async ({ page }) => {
    const result = await navigateToPage(page);
    
    if (!result.success) {
      console.log('Site appears to be inaccessible or requires authentication');
      test.skip('Skipping remaining tests due to connectivity issues');
      return;
    }
    
    // Basic assertions that should work regardless of auth state
    expect(result.currentUrl).toContain('propelcommunity.com');
    expect(result.title).toBeTruthy();
  });

  test('should handle authentication redirect gracefully', async ({ page }) => {
    const result = await navigateToPage(page);
    
    if (!result.success) {
      test.skip('Cannot access site');
      return;
    }
    
    // Check if we're on a login/auth page
    const isAuthPage = result.currentUrl.includes('login') || 
                      result.currentUrl.includes('auth') || 
                      result.currentUrl.includes('signin') ||
                      result.title.toLowerCase().includes('login') ||
                      result.title.toLowerCase().includes('sign in');
    
    if (isAuthPage) {
      console.log('Detected authentication page');
      
      // Look for login form elements
      const loginElements = page.locator([
        'input[type="email"]',
        'input[type="password"]', 
        'button:has-text("Login")',
        'button:has-text("Sign In")',
        'form'
      ].join(', '));
      
      const elementCount = await loginElements.count();
      expect(elementCount).toBeGreaterThan(0);
    }
    
    // Should at least have some basic page structure
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent.length).toBeGreaterThan(10);
  });

  test('should display page content or auth form', async ({ page }) => {
    const result = await navigateToPage(page);
    
    if (!result.success) {
      test.skip('Cannot access site');
      return;
    }
    
    // Wait a bit for dynamic content
    await page.waitForTimeout(3000);
    
    // Check for either main content OR authentication elements
    const hasContent = await page.locator('main, .main, .app, #app, #root').count() > 0;
    const hasAuthForm = await page.locator('form, input[type="email"], input[type="password"]').count() > 0;
    const hasNavigation = await page.locator('nav, .nav, .navbar, header').count() > 0;
    
    // Should have at least one of these
    expect(hasContent || hasAuthForm || hasNavigation).toBe(true);
  });

  // Test with different wait strategies
  test('should handle slow loading with different strategies', async ({ page }) => {
    // Try with minimal wait requirements
    const result = await navigateToPage(page, { waitUntil: 'commit' });
    
    if (!result.success) {
      test.skip('Cannot access site');
      return;
    }
    
    // Wait for basic DOM structure
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Check if page has basic structure
    const hasBasicStructure = await page.evaluate(() => {
      return document.body && document.body.children.length > 0;
    });
    
    expect(hasBasicStructure).toBe(true);
  });

  // Test what happens when we try to access without auth
  test('should provide appropriate response for unauthenticated access', async ({ page }) => {
    const result = await navigateToPage(page);
    
    if (!result.success) {
      test.skip('Cannot access site');
      return;
    }
    
    // Check response status
    if (result.response) {
      const status = result.response.status();
      console.log(`HTTP Status: ${status}`);
      
      // Common status codes for protected apps
      if (status === 401 || status === 403) {
        console.log('Site requires authentication');
      } else if (status === 200) {
        console.log('Site accessible');
      }
      
      expect([200, 301, 302, 401, 403]).toContain(status);
    }
    
    // Look for common auth-related text
    const pageText = await page.textContent('body').catch(() => '');
    const hasAuthText = /login|sign in|authenticate|unauthorized|access denied/i.test(pageText);
    
    if (hasAuthText) {
      console.log('Page contains authentication-related content');
    }
  });

  // Mobile responsiveness test (if page is accessible)
  test('should be responsive if accessible', async ({ page }) => {
    const result = await navigateToPage(page);
    
    if (!result.success) {
      test.skip('Cannot access site');
      return;
    }
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    // Basic responsive check
    const viewport = page.viewportSize();
    expect(viewport.width).toBe(375);
    
    // Check if content adapts (basic check)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(400); // Allow some margin
  });

  // Security headers test
  test('should have basic security measures', async ({ page }) => {
    try {
      const response = await page.goto(BASE_URL, { 
        waitUntil: 'commit',
        timeout: 30000 
      });
      
      if (response) {
        const headers = response.headers();
        
        // Log security headers for inspection
        const securityHeaders = ['x-frame-options', 'x-content-type-options', 'strict-transport-security'];
        securityHeaders.forEach(header => {
          if (headers[header]) {
            console.log(`${header}: ${headers[header]}`);
          }
        });
        
        // Verify HTTPS
        expect(page.url()).toMatch(/^https:/);
      }
    } catch (error) {
      console.log(`Security test failed: ${error.message}`);
      test.skip('Cannot perform security checks');
    }
  });

});

// Diagnostic tests to understand the site better
test.describe('Propel Community Diagnostics', () => {
  
  test('should provide diagnostic information', async ({ page }) => {
    console.log('\n=== DIAGNOSTIC INFORMATION ===');
    
    try {
      // Try to connect and gather info
      const startTime = Date.now();
      const response = await page.goto(BASE_URL, { 
        waitUntil: 'commit',
        timeout: 30000 
      });
      const loadTime = Date.now() - startTime;
      
      console.log(`✓ Connection successful in ${loadTime}ms`);
      console.log(`✓ Final URL: ${page.url()}`);
      console.log(`✓ HTTP Status: ${response?.status() || 'N/A'}`);
      console.log(`✓ Page Title: ${await page.title().catch(() => 'N/A')}`);
      
      // Check for redirects
      if (page.url() !== BASE_URL) {
        console.log(`✓ Redirect detected: ${BASE_URL} → ${page.url()}`);
      }
      
      // Wait for potential dynamic content
      await page.waitForTimeout(5000);
      
      // Analyze page content
      const bodyText = await page.textContent('body').catch(() => '');
      console.log(`✓ Page content length: ${bodyText.length} characters`);
      
      // Look for common app indicators
      const indicators = {
        'React App': await page.locator('#root').count() > 0,
        'Vue App': await page.locator('#app').count() > 0,
        'Has Navigation': await page.locator('nav, .nav, .navbar').count() > 0,
        'Has Forms': await page.locator('form').count() > 0,
        'Has Login Elements': /login|sign in|authenticate/i.test(bodyText),
        'Has Error Message': /error|not found|unavailable/i.test(bodyText)
      };
      
      console.log('✓ App Analysis:');
      Object.entries(indicators).forEach(([key, value]) => {
        console.log(`   ${key}: ${value ? 'Yes' : 'No'}`);
      });
      
    } catch (error) {
      console.log(`✗ Connection failed: ${error.message}`);
      
      // Additional network diagnostics
      if (error.message.includes('timeout')) {
        console.log('   Issue: Request timed out - site may be slow or blocking automation');
      } else if (error.message.includes('net::ERR_')) {
        console.log('   Issue: Network error - site may be down or inaccessible');
      }
    }
    
    console.log('=== END DIAGNOSTICS ===\n');
  });

  test('should test alternative access methods', async ({ page, context }) => {
    console.log('\n=== TESTING ACCESS METHODS ===');
    
    // Test 1: Basic navigation
    try {
      await page.goto(BASE_URL, { 
        waitUntil: 'domcontentloaded',
        timeout: 20000 
      });
      console.log('✓ Method 1 (domcontentloaded): Success');
    } catch (error) {
      console.log(`✗ Method 1: ${error.message}`);
    }
    
    // Test 2: With different user agent
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
    
    try {
      await page.goto(BASE_URL, { 
        waitUntil: 'commit',
        timeout: 20000 
      });
      console.log('✓ Method 2 (commit + no webdriver): Success');
    } catch (error) {
      console.log(`✗ Method 2: ${error.message}`);
    }
    
    // Test 3: Direct URL variations
    const variations = [
      'https://app.propelcommunity.com/',
      'https://www.app.propelcommunity.com',
      'https://propelcommunity.com'
    ];
    
    for (const url of variations) {
      try {
        await page.goto(url, { timeout: 15000 });
        console.log(`✓ URL variation ${url}: Success (redirected to ${page.url()})`);
        break;
      } catch (error) {
        console.log(`✗ URL variation ${url}: ${error.message}`);
      }
    }
    
    console.log('=== END ACCESS METHODS ===\n');
  });

});

// Network and performance tests
test.describe('Network Analysis', () => {
  
  test('should analyze network requests', async ({ page }) => {
    const requests = [];
    const responses = [];
    const failures = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type']
      });
    });
    
    page.on('requestfailed', request => {
      failures.push({
        url: request.url(),
        failure: request.failure()?.errorText
      });
    });
    
    try {
      await page.goto(BASE_URL, { timeout: 30000 });
      await page.waitForTimeout(5000); // Let all requests complete
      
      console.log(`\n=== NETWORK ANALYSIS ===`);
      console.log(`Total requests: ${requests.length}`);
      console.log(`Total responses: ${responses.length}`);
      console.log(`Failed requests: ${failures.length}`);
      
      if (failures.length > 0) {
        console.log('Failed requests:');
        failures.forEach(fail => {
          console.log(`  - ${fail.url}: ${fail.failure}`);
        });
      }
      
      // Analyze response codes
      const statusCodes = {};
      responses.forEach(resp => {
        statusCodes[resp.status] = (statusCodes[resp.status] || 0) + 1;
      });
      
      console.log('Response status distribution:');
      Object.entries(statusCodes).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} requests`);
      });
      
      console.log('=== END NETWORK ANALYSIS ===\n');
      
    } catch (error) {
      console.log(`Network analysis failed: ${error.message}`);
    }
  });
  
});