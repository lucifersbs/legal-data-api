const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const page = await browser.newPage();
  
  console.log('Going to RapidAPI...');
  await page.goto('https://rapidapi.com/auth/signin', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  console.log('Clicking Sign In button...');
  await page.click('button:has-text("Sign In"), a:has-text("Sign In")');
  await page.waitForTimeout(3000);
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: '/home/claw/.openclaw/workspace/rapidapi-login2.png', fullPage: true });
  console.log('Screenshot saved!');
  
  // Now look for inputs
  const inputs = await page.$$('input');
  console.log('Found', inputs.length, 'input fields');
  
  for (let i = 0; i < inputs.length; i++) {
    const type = await inputs[i].getAttribute('type');
    const name = await inputs[i].getAttribute('name');
    const placeholder = await inputs[i].getAttribute('placeholder');
    console.log(`Input ${i}: type=${type}, name=${name}, placeholder=${placeholder}`);
  }
  
  // If we have email field, fill it
  const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
  if (emailInput) {
    console.log('Found email field, filling...');
    await emailInput.fill('luciferbloglife@gmail.com');
    
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      await passwordInput.fill('Usf2uQKiEp!sf6S');
      console.log('Filled password');
      
      // Click submit
      const submitBtn = await page.$('button[type="submit"], button:has-text("Sign In")');
      if (submitBtn) {
        await submitBtn.click();
        console.log('Clicked submit, waiting...');
        await page.waitForTimeout(5000);
        
        // Screenshot after login
        await page.screenshot({ path: '/home/claw/.openclaw/workspace/rapidapi-loggedin.png', fullPage: true });
        console.log('Post-login screenshot saved!');
      }
    }
  }
  
  await browser.close();
})();
