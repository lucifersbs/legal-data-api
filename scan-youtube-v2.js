const { chromium } = require('playwright');

(async () => {
  try {
    // Connect to the existing Chrome instance
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0] || await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to YouTube channel...');
    await page.goto('https://www.youtube.com/@Whispersoffaithgod', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    await page.waitForTimeout(5000);
    
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: '/home/claw/.openclaw/workspace/youtube-channel.png',
      fullPage: true 
    });
    console.log('Screenshot saved!');
    
    // Get page title
    const title = await page.title();
    console.log('Title:', title);
    
    // Try to find and extract channel info
    const pageContent = await page.content();
    
    // Look for subscriber count in page source
    const subMatch = pageContent.match(/(\d+(?:\.\d+)?[KM]? subscribers?)/i);
    if (subMatch) {
      console.log('Found:', subMatch[1]);
    }
    
    // Look for video count
    const videoMatch = pageContent.match(/(\d+) videos?/i);
    if (videoMatch) {
      console.log('Videos:', videoMatch[1]);
    }
    
    // Extract video titles from page
    const videoTitles = await page.$$eval('a#video-title-link, a#video-title', 
      links => links.slice(0, 10).map(a => a.textContent.trim()).filter(t => t.length > 0)
    );
    console.log('Video titles found:', videoTitles);
    
    await browser.close();
    console.log('Done!');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
