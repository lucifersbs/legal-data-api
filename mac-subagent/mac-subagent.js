#!/usr/bin/env node
/**
 * Mac Mini Subagent - Social Media Automation
 * Runs locally on Mac Mini, controls Chrome, reports to main agent
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Enable stealth mode
puppeteer.use(StealthPlugin());

// Configuration
const CONFIG = {
  mainAgentUrl: 'https://api.telegram.org/bot8564024249:AAG2PEBAfn5Cn3bdomxlHQLU53MC7NVxmRw', // Will update with proper endpoint
  screenshotDir: path.join(__dirname, 'screenshots'),
  dataDir: path.join(__dirname, 'data'),
  checkInterval: 60000, // Check for new commands every minute
};

// Ensure directories exist
if (!fs.existsSync(CONFIG.screenshotDir)) fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
if (!fs.existsSync(CONFIG.dataDir)) fs.mkdirSync(CONFIG.dataDir, { recursive: true });

class MacSubagent {
  constructor() {
    this.browser = null;
    this.pages = {};
    this.isRunning = false;
  }

  async init() {
    console.log('🚀 Starting Mac Mini Subagent...');
    console.log('Connecting to Chrome...');
    
    // Launch browser with Mac settings
    this.browser = await puppeteer.launch({
      headless: false, // Visible so you can see what's happening
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080',
        '--user-data-dir=/tmp/chrome-profile'
      ]
    });

    console.log('✅ Chrome connected');
    console.log('Subagent ready for commands');
    
    // Start command loop
    this.startCommandLoop();
  }

  // X (Twitter) Operations
  async xLogin(username, password) {
    console.log(`Logging into X as ${username}...`);
    const page = await this.browser.newPage();
    await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle2' });
    
    // Enter username
    await page.waitForSelector('input[autocomplete="username"]', { timeout: 10000 });
    await page.type('input[autocomplete="username"]', username);
    await page.click('button:has-text("Next")');
    
    // Enter password
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await page.type('input[type="password"]', password);
    await page.click('button:has-text("Log in")');
    
    // Wait for home
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    
    this.pages.x = page;
    console.log('✅ Logged into X');
    return { success: true, url: page.url() };
  }

  async xPost(content) {
    if (!this.pages.x) throw new Error('Not logged into X');
    
    console.log('Posting to X:', content.substring(0, 50) + '...');
    const page = this.pages.x;
    
    // Click compose
    await page.click('[data-testid="SideNav_NewTweet_Button"]');
    await page.waitForTimeout(1000);
    
    // Type content
    await page.type('[data-testid="tweetTextarea_0"]', content);
    await page.waitForTimeout(500);
    
    // Click post
    await page.click('[data-testid="tweetButton"]');
    await page.waitForTimeout(2000);
    
    console.log('✅ Posted to X');
    return { success: true };
  }

  async xFollow(username) {
    if (!this.pages.x) throw new Error('Not logged into X');
    
    console.log(`Following ${username}...`);
    const page = this.pages.x;
    
    await page.goto(`https://x.com/${username}`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Click follow button
    const followBtn = await page.$('[data-testid="follow"]');
    if (followBtn) {
      await followBtn.click();
      console.log(`✅ Followed ${username}`);
      return { success: true };
    }
    
    return { success: false, reason: 'Already following or button not found' };
  }

  async xComment(tweetUrl, comment) {
    if (!this.pages.x) throw new Error('Not logged into X');
    
    console.log('Commenting on tweet:', comment.substring(0, 50) + '...');
    const page = this.pages.x;
    
    await page.goto(tweetUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Click reply
    await page.click('[data-testid="reply"]');
    await page.waitForTimeout(1000);
    
    // Type comment
    await page.type('[data-testid="tweetTextarea_0"]', comment);
    await page.waitForTimeout(500);
    
    // Post reply
    await page.click('[data-testid="tweetButton"]');
    await page.waitForTimeout(2000);
    
    console.log('✅ Commented on X');
    return { success: true };
  }

  async xUpdateProfile(name, bio, location, website) {
    if (!this.pages.x) throw new Error('Not logged into X');
    
    console.log('Updating X profile...');
    const page = this.pages.x;
    
    await page.goto('https://x.com/settings/profile', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Update fields
    if (name) {
      await page.click('input[name="displayName"]');
      await page.keyboard.down('Control');
      await page.keyboard.down('a');
      await page.keyboard.up('a');
      await page.keyboard.up('Control');
      await page.type('input[name="displayName"]', name);
    }
    
    if (bio) {
      await page.click('textarea[name="description"]');
      await page.keyboard.down('Control');
      await page.keyboard.down('a');
      await page.keyboard.up('a');
      await page.keyboard.up('Control');
      await page.type('textarea[name="description"]', bio);
    }
    
    if (location) {
      await page.click('input[name="location"]');
      await page.keyboard.down('Control');
      await page.keyboard.down('a');
      await page.keyboard.up('a');
      await page.keyboard.up('Control');
      await page.type('input[name="location"]', location);
    }
    
    if (website) {
      await page.click('input[name="url"]');
      await page.keyboard.down('Control');
      await page.keyboard.down('a');
      await page.keyboard.up('a');
      await page.keyboard.up('Control');
      await page.type('input[name="url"]', website);
    }
    
    // Save
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(3000);
    
    console.log('✅ Profile updated');
    return { success: true };
  }

  // YouTube Operations (Comment/Interact only)
  async youtubeComment(videoUrl, comment) {
    console.log('Commenting on YouTube:', comment.substring(0, 50) + '...');
    
    const page = await this.browser.newPage();
    await page.goto(videoUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Scroll to comments
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(1000);
    
    // Click comment box
    await page.click('#simplebox-placeholder');
    await page.waitForTimeout(1000);
    
    // Type comment
    await page.type('#contenteditable-root', comment);
    await page.waitForTimeout(500);
    
    // Post
    await page.click('#submit-button');
    await page.waitForTimeout(2000);
    
    await page.close();
    console.log('✅ Commented on YouTube');
    return { success: true };
  }

  async youtubeReplyToComment(videoUrl, commentIndex, reply) {
    console.log(`Replying to comment #${commentIndex}...`);
    
    const page = await this.browser.newPage();
    await page.goto(videoUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Find comment and reply
    const replyButtons = await page.$$('button:has-text("Reply")');
    if (replyButtons[commentIndex]) {
      await replyButtons[commentIndex].click();
      await page.waitForTimeout(1000);
      
      await page.type('#contenteditable-root', reply);
      await page.click('#submit-button');
      await page.waitForTimeout(2000);
      
      console.log('✅ Replied to comment');
    }
    
    await page.close();
    return { success: true };
  }

  async youtubeGetAnalytics() {
    console.log('Getting YouTube analytics...');
    
    const page = await this.browser.newPage();
    await page.goto('https://studio.youtube.com/channel/UC/analytics/tab-overview/period-default', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    await page.waitForTimeout(5000);
    
    // Take screenshot
    const screenshotPath = path.join(CONFIG.screenshotDir, 'youtube-analytics.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    await page.close();
    console.log('✅ Screenshot saved:', screenshotPath);
    return { success: true, screenshot: screenshotPath };
  }

  // Screenshot utility
  async takeScreenshot(url, filename) {
    console.log(`Taking screenshot of ${url}...`);
    
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    const screenshotPath = path.join(CONFIG.screenshotDir, filename);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    await page.close();
    console.log('✅ Screenshot saved:', screenshotPath);
    return { success: true, path: screenshotPath };
  }

  // Command loop
  async startCommandLoop() {
    console.log('Starting command loop...');
    this.isRunning = true;
    
    // For now, just listen for commands from files
    // In production, this would poll an API or use WebSocket
    
    const commandFile = path.join(CONFIG.dataDir, 'commands.json');
    
    while (this.isRunning) {
      try {
        if (fs.existsSync(commandFile)) {
          const commands = JSON.parse(fs.readFileSync(commandFile, 'utf8'));
          
          for (const cmd of commands) {
            if (!cmd.executed) {
              console.log('Executing command:', cmd.type);
              await this.executeCommand(cmd);
              cmd.executed = true;
              cmd.executedAt = new Date().toISOString();
            }
          }
          
          fs.writeFileSync(commandFile, JSON.stringify(commands, null, 2));
        }
      } catch (error) {
        console.error('Command loop error:', error.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, CONFIG.checkInterval));
    }
  }

  async executeCommand(cmd) {
    try {
      let result;
      
      switch (cmd.type) {
        case 'x_login':
          result = await this.xLogin(cmd.username, cmd.password);
          break;
        case 'x_post':
          result = await this.xPost(cmd.content);
          break;
        case 'x_follow':
          result = await this.xFollow(cmd.username);
          break;
        case 'x_comment':
          result = await this.xComment(cmd.url, cmd.comment);
          break;
        case 'x_update_profile':
          result = await this.xUpdateProfile(cmd.name, cmd.bio, cmd.location, cmd.website);
          break;
        case 'youtube_comment':
          result = await this.youtubeComment(cmd.videoUrl, cmd.comment);
          break;
        case 'youtube_reply':
          result = await this.youtubeReplyToComment(cmd.videoUrl, cmd.commentIndex, cmd.reply);
          break;
        case 'youtube_analytics':
          result = await this.youtubeGetAnalytics();
          break;
        case 'screenshot':
          result = await this.takeScreenshot(cmd.url, cmd.filename);
          break;
        default:
          result = { success: false, error: 'Unknown command type' };
      }
      
      // Save result
      const resultsFile = path.join(CONFIG.dataDir, 'results.json');
      const results = fs.existsSync(resultsFile) ? JSON.parse(fs.readFileSync(resultsFile, 'utf8')) : [];
      results.push({
        commandId: cmd.id,
        type: cmd.type,
        result: result,
        timestamp: new Date().toISOString()
      });
      fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
      
    } catch (error) {
      console.error('Command execution error:', error.message);
    }
  }

  async stop() {
    this.isRunning = false;
    if (this.browser) {
      await this.browser.close();
    }
    console.log('Subagent stopped');
  }
}

// Run if called directly
if (require.main === module) {
  const subagent = new MacSubagent();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await subagent.stop();
    process.exit(0);
  });
  
  subagent.init().catch(console.error);
}

module.exports = MacSubagent;
