const { chromium } = require('playwright');

(async () => {
  try {
    // Connect to the running Chrome instance
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0] || await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to RapidAPI login...');
    await page.goto('https://rapidapi.com/auth/signin', { waitUntil: 'networkidle' });
    
    // Fill in email
    await page.fill('input[type="email"], input[name="email"]', 'luciferbloglife@gmail.com');
    
    // Fill in password
    await page.fill('input[type="password"], input[name="password"]', 'Usf2uQKiEp!sf6S');
    
    // Click login
    await page.click('button[type="submit"], button:has-text("Sign In")');
    
    console.log('Logging in...');
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });
    
    console.log('Logged in! Navigating to API pricing...');
    await page.goto('https://rapidapi.com/lucifersbs/api/legal-data-api/pricing', { waitUntil: 'networkidle' });
    
    // Look for deprecated plan and delete it
    console.log('Looking for deprecated plan...');
    const deprecatedButton = await page.$('button:has-text("Cancel Plan"):right-of(:has-text("Deprecated"))');
    
    if (deprecatedButton) {
      console.log('Found deprecated plan, deleting...');
      await deprecatedButton.click();
      await page.waitForTimeout(2000);
      
      // Confirm deletion
      const confirmButton = await page.$('button:has-text("Confirm"), button:has-text("Delete")');
      if (confirmButton) {
        await confirmButton.click();
        console.log('Deprecated plan deleted!');
      }
    } else {
      console.log('No deprecated plan found or already deleted.');
    }
    
    // Navigate to Hub Listing
    console.log('Navigating to Hub Listing...');
    await page.goto('https://rapidapi.com/lucifersbs/api/legal-data-api/hub', { waitUntil: 'networkidle' });
    
    // Click Edit
    const editButton = await page.$('button:has-text("Edit"), a:has-text("Edit")');
    if (editButton) {
      await editButton.click();
      await page.waitForTimeout(2000);
      
      // Fill description
      const descriptionTextarea = await page.$('textarea[name="description"], textarea[placeholder*="description" i]');
      if (descriptionTextarea) {
        await descriptionTextarea.fill(`The most comprehensive US legal data API. Access statute of limitations, settlement ranges, damage caps, comparative negligence rules, and court filing information for all 50 states + DC.

Built for legal tech developers, law firm websites, case management tools, and personal injury platforms.

Features:
• 50 states + DC coverage
• 8 comprehensive endpoints
• Damage caps and punitive limits by state
• Comparative/contributory negligence rules  
• Workers compensation deadlines
• Average settlement ranges
• Court information database

Perfect for: Legal calculators, attorney websites, case management systems, legal research tools, personal injury platforms.`);
        
        console.log('Description added!');
        
        // Save changes
        const saveButton = await page.$('button:has-text("Save"), button[type="submit"]');
        if (saveButton) {
          await saveButton.click();
          console.log('Changes saved!');
        }
      }
    }
    
    console.log('✅ RapidAPI automation complete!');
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
