# Mac Mini Subagent - Social Media Automation
# Runs on your local machine, connects to Chrome, communicates with main agent

## INSTALLATION STEPS:

1. Install Node.js on your Mac:
   - Go to: https://nodejs.org
   - Download LTS version
   - Install it

2. Install dependencies:
   ```bash
   npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth axios ws
   ```

3. Run the subagent:
   ```bash
   node mac-subagent.js
   ```

4. Keep it running in background while Mac is on

## WHAT IT DOES:

### X (Twitter) Automation:
- ✅ Post content (from files I send)
- ✅ Update profile (bio, photo, banner)
- ✅ Follow accounts (targeted by niche)
- ✅ Comment on posts (thoughtful replies)
- ✅ Like and retweet relevant content
- ✅ Check notifications and reply

### YouTube Automation:
- ✅ Comment on videos (not post videos)
- ✅ Reply to comments on your videos
- ✅ Analyze your analytics
- ✅ Take screenshots for review

### Reddit Automation:
- ✅ Post in relevant subreddits
- ✅ Comment on trending posts
- ✅ Build karma organically
- ✅ Cross-promote projects subtly

### Communication:
- Sends screenshots to main agent
- Receives commands from main agent
- Reports back analytics and results
- Runs on your schedule

## SECURITY:
- Runs on YOUR machine (your IP, your browser)
- No VPS detection
- Looks like real user activity
- You can pause/stop anytime

## FILES NEEDED:
- mac-subagent.js (main script)
- x-credentials.json (your login)
- youtube-credentials.json
- reddit-credentials.json
- content-queue.json (posts to make)

## NEXT STEPS:
1. I create the subagent script
2. You install on Mac Mini
3. We test connection
4. Start automation
