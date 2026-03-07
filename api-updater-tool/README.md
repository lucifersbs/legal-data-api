# Legal Data API Updater Tool

## Installation on Your Mac

### Step 1: Download the tool
```bash
cd ~/legal-data-api
mkdir -p tools
curl -o tools/api-updater.js [URL I'll provide]
```

### Step 2: Make it executable
```bash
chmod +x tools/api-updater.js
```

### Step 3: Set up GitHub token
```bash
export GITHUB_TOKEN="your_github_token_here"
```
(Add this to your `~/.zshrc` or `~/.bash_profile` to make it permanent)

## Usage

### Add New Data to Existing Endpoint

Example: Add more states to statute-of-limitations.json

1. Edit the data file directly:
```bash
nano data/statute-of-limitations.json
```

2. Add your new data following the existing format

3. Push changes:
```bash
./tools/api-updater.js push "Add statute data for 5 more states"
```

### Add New Endpoint (Advanced)

1. Create new data file:
```bash
./tools/api-updater.js add-data court-holidays
```

2. Edit the generated file:
```bash
nano data/court-holidays.json
```

3. Add endpoint to server.js:
```bash
./tools/api-updater.js add-endpoint /court-holidays/:state
```

4. Push:
```bash
./tools/api-updater.js push "Add court holidays endpoint"
```

## Quick Templates

### Template 1: Add More States to Existing Data

Edit `data/statute-of-limitations.json` and add:
```json
"NM": {
  "name": "New Mexico",
  "personal-injury": 3,
  "property-damage": 4,
  "wrongful-death": 3,
  "medical-malpractice": 3
}
```

Then push.

### Template 2: Add More Injury Types

Edit `data/settlements.json` and add:
```json
"motorcycle-accident": {
  "name": "Motorcycle Accident",
  "minAmount": 25000,
  "maxAmount": 500000,
  "medianAmount": 85000,
  "notes": "Higher severity than car accidents"
}
```

Then push.

### Template 3: Add New Data Category

Create `data/court-holidays.json`:
```json
{
  "metadata": {
    "title": "Court Holidays by State",
    "lastUpdated": "2026-02-25"
  },
  "jurisdictions": {
    "CA": {
      "name": "California",
      "holidays": ["New Year's Day", "Martin Luther King Jr. Day", ...]
    }
  }
}
```

Then update server.js to add endpoint and push.

## Commands Reference

| Command | Description |
|---------|-------------|
| `add-data <name>` | Create new data file template |
| `add-endpoint <path>` | Add endpoint to server.js |
| `push "message"` | Commit and push to GitHub |
| `status` | Check repository status |

## Render Auto-Deploy

After pushing:
- Render detects GitHub changes automatically
- Deploys in 2-3 minutes
- Check: https://legal-data-api-ubsk.onrender.com

## Need Help?

Run: `./tools/api-updater.js help`
