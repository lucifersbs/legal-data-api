const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const page = await browser.newPage();
  
  console.log('Going to X login...');
  await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  console.log('Filling login...');
  
  // X login flow
  // Step 1: Username
  const usernameInput = await page.$('input[autocomplete="username"], input[name="text"]');
  if (usernameInput) {
    await usernameInput.fill('AlexChen1278639');
    await page.click('button:has-text("Next"), div[role="button"]:has-text("Next")');
    await page.waitForTimeout(2000);
  }
  
  // Step 2: Password
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    await passwordInput.fill('Blackdoctorstrange123!');
    await page.click('button:has-text("Log in"), div[role="button"]:has-text("Log in")');
    await page.waitForTimeout(5000);
  }
  
  console.log('Taking screenshot after login...');
  await page.screenshot({ path: '/home/claw/.openclaw/workspace/x-loggedin.png' });
  
  // Check if logged in
  const url = page.url();
  console.log('Current URL:', url);
  
  if (url.includes('home') || url.includes('x.com/AlexChen')) {
    console.log('✅ Successfully logged in!');
    
    // Go to profile
    await page.goto('https://x.com/AlexChen1278639', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    console.log('On profile page');
    await page.screenshot({ path: '/home/claw/.openclaw/workspace/x-profile.png' });
    
    // Click Edit profile
    const editBtn = await page.$('button:has-text("Edit profile"), a:has-text("Edit profile")');
    if (editBtn) {
      await editBtn.click();
      await page.waitForTimeout(2000);
      
      console.log('Editing profile...');
      
      // Update bio
      const bioInput = await page.$('textarea[name="description"], textarea[data-testid="description"]');
      if (bioInput) {
        await bioInput.fill('Building legal tech tools & digital assets. Creator of Legal Data API. Helping lawyers and developers work smarter. 🚀');
        console.log('Bio updated');
      }
      
      // Update location
      const locationInput = await page.$('input[name="location"]');
      if (locationInput) {
        await locationInput.fill('Remote');
      }
      
      // Update website
      const websiteInput = await page.$('input[name="url"]');
      if (websiteInput) {
        await websiteInput.fill('https://legal-data-api-ubsk.onrender.com');
      }
      
      // Save changes
      const saveBtn = await page.$('button:has-text("Save"), div[data-testid="saveButton"]');
      if (saveBtn) {
        await saveBtn.click();
        console.log('Profile saved!');
      }
      
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/home/claw/.openclaw/workspace/x-profile-updated.png' });
    }
  } else {
    console.log('⚠️ Login may have failed or requires verification');
    console.log('URL:', url);
  }
  
  await browser.close();
  console.log('Done!');
})();
