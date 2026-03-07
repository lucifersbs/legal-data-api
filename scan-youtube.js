const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  });
  
  const page = await browser.newPage();
  
  console.log('Going to YouTube channel...');
  await page.goto('https://www.youtube.com/@Whispersoffaithgod', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  
  await page.waitForTimeout(5000);
  
  console.log('Taking screenshot...');
  await page.screenshot({ 
    path: '/home/claw/.openclaw/workspace/youtube-channel.png',
    fullPage: true 
  });
  
  // Get page info
  const title = await page.title();
  console.log('Page title:', title);
  
  // Try to get subscriber count
  try {
    const subCount = await page.$eval('#subscriber-count', el => el.textContent);
    console.log('Subscribers:', subCount);
  } catch (e) {
    console.log('Could not find subscriber count');
  }
  
  // Try to get video count
  try {
    const videoCount = await page.$eval('#videos-count', el => el.textContent);
    console.log('Videos:', videoCount);
  } catch (e) {
    console.log('Could not find video count');
  }
  
  // Get video titles
  const videos = await page.$$eval('#video-title', titles => 
    titles.slice(0, 5).map(t => t.textContent.trim())
  );
  console.log('Video titles:', videos);
  
  await browser.close();
  console.log('Done! Screenshot saved.');
})();
