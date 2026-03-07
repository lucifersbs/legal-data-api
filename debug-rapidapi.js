const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const page = await browser.newPage();
  
  console.log('Going to RapidAPI...');
  await page.goto('https://rapidapi.com/auth/signin');
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: '/home/claw/.openclaw/workspace/rapidapi-login.png', fullPage: true });
  
  console.log('Screenshot saved! Check rapidapi-login.png');
  
  // Print page title and URL
  console.log('Title:', await page.title());
  console.log('URL:', page.url());
  
  // List all input fields
  const inputs = await page.$$('input');
  console.log('Found', inputs.length, 'input fields');
  
  for (let i = 0; i < inputs.length; i++) {
    const type = await inputs[i].getAttribute('type');
    const name = await inputs[i].getAttribute('name');
    const placeholder = await inputs[i].getAttribute('placeholder');
    console.log(`Input ${i}: type=${type}, name=${name}, placeholder=${placeholder}`);
  }
  
  await browser.close();
})();
