const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to RapidAPI...');
  await page.goto('https://rapidapi.com/auth/signin');
  
  console.log('Waiting for login form...');
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  
  console.log('Please login manually and then press Enter in the terminal...');
  console.log('Browser is running. Login with: luciferbloglife@gmail.com');
  
  // Wait for navigation to hub after login
  await page.waitForNavigation({ url: /rapidapi.com\/hub/, timeout: 120000 });
  
  console.log('Logged in! Navigating to API...');
  await page.goto('https://rapidapi.com/lucifersbs-xxx-xxx/api/legal-data-api/pricing');
  
  console.log('On pricing page. Looking for deprecated plan...');
  
  // Look for and delete deprecated plan
  const deprecatedCard = await page.$('text=Deprecated');
  if (deprecatedCard) {
    console.log('Found deprecated plan. Deleting...');
    const deleteButton = await deprecatedCard.$('button:has-text("Cancel")');
    if (deleteButton) {
      await deleteButton.click();
      await page.waitForTimeout(1000);
      const confirmButton = await page.$('button:has-text("Confirm")');
      if (confirmButton) await confirmButton.click();
    }
  }
  
  console.log('Going to Hub Listing to add description...');
  await page.goto('https://rapidapi.com/lucifersbs-xxx-xxx/api/legal-data-api/hub');
  
  console.log('Automation complete!');
  await browser.close();
})();
