#!/usr/bin/env node
/**
 * Legal Data API Updater - Mac Tool
 * Run locally to add endpoints and data to your API
 * 
 * Usage: node api-updater.js [command] [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  repoPath: process.cwd(), // Assumes run from repo directory
  dataDir: path.join(process.cwd(), 'data'),
  githubToken: process.env.GITHUB_TOKEN || 'YOUR_TOKEN_HERE'
};

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

class APIUpdater {
  constructor() {
    this.checkRepo();
  }

  checkRepo() {
    if (!fs.existsSync(path.join(CONFIG.repoPath, 'server.js'))) {
      log('Error: Not in legal-data-api repository!', 'red');
      log('Please run this from your repo directory', 'yellow');
      process.exit(1);
    }
  }

  // Add new endpoint to server.js
  addEndpoint(endpointPath, handlerCode) {
    log(`Adding endpoint: ${endpointPath}`, 'blue');
    
    const serverPath = path.join(CONFIG.repoPath, 'server.js');
    let serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Find the last endpoint and add after it
    const insertMarker = '// 404 handler';
    const newEndpoint = `
// ${endpointPath}
app.get('${endpointPath}', (req, res) => {
  ${handlerCode}
});

`;
    
    serverContent = serverContent.replace(insertMarker, newEndpoint + insertMarker);
    fs.writeFileSync(serverPath, serverContent);
    
    log(`✅ Endpoint ${endpointPath} added to server.js`, 'green');
  }

  // Add new data file
  addDataFile(filename, data) {
    const filePath = path.join(CONFIG.dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    log(`✅ Data file created: ${filename}`, 'green');
  }

  // Update server.js to load new data file
  addDataLoader(filename, variableName) {
    const serverPath = path.join(CONFIG.repoPath, 'server.js');
    let content = fs.readFileSync(serverPath, 'utf8');
    
    // Find data loading section and add new loader
    const loaderCode = `const ${variableName} = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', '${filename}'), 'utf8'));\n`;
    
    // Insert after settlementData line
    const insertAfter = "const settlementData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'settlements.json'), 'utf8'));";
    content = content.replace(insertAfter, insertAfter + '\n' + loaderCode);
    
    fs.writeFileSync(serverPath, content);
    log(`✅ Data loader added for ${variableName}`, 'green');
  }

  // Commit and push to GitHub
  async commitAndPush(message) {
    log('Pushing to GitHub...', 'blue');
    
    try {
      execSync('git add .', { cwd: CONFIG.repoPath });
      execSync(`git commit -m "${message}"`, { cwd: CONFIG.repoPath });
      execSync('git push origin main', { cwd: CONFIG.repoPath });
      log('✅ Changes pushed to GitHub', 'green');
      log('Render will auto-deploy in 2-3 minutes', 'yellow');
    } catch (error) {
      log('❌ Git error: ' + error.message, 'red');
    }
  }

  // Interactive menu
  showMenu() {
    console.log(`
${colors.blue}=== Legal Data API Updater ===${colors.reset}

Commands:
  ${colors.green}add-endpoint${colors.reset}    - Add new API endpoint
  ${colors.green}add-data${colors.reset}        - Add new data file  
  ${colors.green}update-data${colors.reset}     - Update existing data
  ${colors.green}push${colors.reset}            - Commit and push to GitHub
  ${colors.green}status${colors.reset}          - Check repo status
  ${colors.green}help${colors.reset}            - Show this menu

Examples:
  node api-updater.js add-endpoint
  node api-updater.js add-data
  node api-updater.js push "Add new endpoint for court holidays"
    `);
  }
}

// Main execution
const updater = new APIUpdater();
const command = process.argv[2];

switch(command) {
  case 'add-endpoint':
    // Interactive endpoint creation
    console.log('Endpoint creation wizard...');
    // TODO: Add interactive prompts
    break;
    
  case 'add-data':
    // Interactive data file creation
    console.log('Data file creation wizard...');
    // TODO: Add interactive prompts
    break;
    
  case 'push':
    const message = process.argv[3] || 'Update API data';
    updater.commitAndPush(message);
    break;
    
  case 'status':
    console.log('Repository status:');
    console.log('Location:', CONFIG.repoPath);
    console.log('Data files:', fs.readdirSync(CONFIG.dataDir).length);
    break;
    
  case 'help':
  default:
    updater.showMenu();
}

module.exports = APIUpdater;
