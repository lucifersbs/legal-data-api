# Mac Mini Subagent - Setup Instructions

## What This Does
Runs on your Mac Mini, controls Chrome browser, automates X and YouTube without detection.

## Setup Steps

### 1. Install Node.js
Open Terminal on your Mac and run:
```bash
# Check if Node.js is installed
node --version

# If not installed, download from:
# https://nodejs.org (download LTS version)
# Then install it
```

### 2. Create Project Folder
```bash
mkdir ~/mac-subagent
cd ~/mac-subagent
```

### 3. Install Dependencies
```bash
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
```

### 4. Download Subagent Files
You'll need these 3 files in your `~/mac-subagent` folder:
- `mac-subagent.js` (the main script)
- `commands.json` (what to do)
- `results.json` (will be created automatically)

### 5. Run the Subagent
```bash
cd ~/mac-subagent
node mac-subagent.js
```

You should see Chrome open and the subagent start.

### 6. How to Use

**To post on X:**
Edit `commands.json` and add:
```json
{
  "id": "cmd-003",
  "type": "x_post",
  "content": "Your tweet text here",
  "executed": false
}
```

**To follow someone:**
```json
{
  "id": "cmd-004",
  "type": "x_follow",
  "username": "elonmusk",
  "executed": false
}
```

**To comment on YouTube:**
```json
{
  "id": "cmd-005",
  "type": "youtube_comment",
  "videoUrl": "https://youtube.com/watch?v=...",
  "comment": "Great video!",
  "executed": false
}
```

### 7. Check Results
After commands run, check `results.json` for output.

## Communication with Main Agent

**How I send you commands:**
- I update `commands.json` with new tasks
- Subagent checks every minute
- Executes automatically

**How you report back:**
- Subagent saves screenshots to `screenshots/` folder
- Saves results to `results.json`
- You can share screenshots with me

## Safety
- Runs on YOUR machine (your IP, undetectable)
- You can see Chrome doing the work
- Press Ctrl+C to stop anytime
- Chrome profile isolated (won't mess with your main Chrome)

## First Test

1. Start subagent: `node mac-subagent.js`
2. Wait for Chrome to open
3. It will automatically login to X
4. Update your profile
5. Take screenshot
6. Report back to me

**Ready to try it?**
