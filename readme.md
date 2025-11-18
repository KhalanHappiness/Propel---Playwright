performing actions starts with locatng the elements.
locators represent a way to find elements on the page at any moment
Playwright will wait for the element to become actionable prior to performing the action so ther is no need to wait for it to become available

To create a locator

const getStarted = page.getByRole('link', {name: 'Get started'})

await getStarted.click()

### Assertions

Playwright includes test assertions in the form of expect function. To make an assertion, call expect(value) and choose a matcher that reflects the expectation

playwright consists of async matchers that will wait until the expectes condition is met. Using these matchers allows making the tests non flaky and resilient

### Test Isolation
 Pages are isolated between tests due to the Browser Context, which is equivalent to a brand new browser profile, where every test gets a fresh environment, even when multiple tests run in a single Browser.