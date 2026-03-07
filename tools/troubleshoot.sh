#!/bin/bash
# Troubleshooting script for API Updater Tool

echo "🔧 Legal Data API Updater - Troubleshooting"
echo "==========================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "Checking your setup..."
echo ""

# Check 1: Git installed
if command_exists git; then
    echo "✅ Git installed: $(git --version)"
else
    echo "❌ Git not installed"
    echo "   Fix: Install Git - https://git-scm.com/download/mac"
    exit 1
fi

# Check 2: In correct directory
if [ -f "server.js" ]; then
    echo "✅ In legal-data-api directory"
else
    echo "❌ Not in legal-data-api directory"
    echo "   Fix: cd ~/legal-data-api"
    exit 1
fi

# Check 3: Git remote configured
if git remote -v >/dev/null 2>&1; then
    echo "✅ Git remote configured"
    echo "   Remote: $(git remote get-url origin)"
else
    echo "❌ No Git remote configured"
    echo "   Fix: git remote add origin https://github.com/lucifersbs/legal-data-api.git"
fi

# Check 4: Can connect to GitHub
echo ""
echo "Testing GitHub connection..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH connection to GitHub works"
elif git ls-remote origin >/dev/null 2>&1; then
    echo "✅ HTTPS connection to GitHub works"
else
    echo "❌ Cannot connect to GitHub"
    echo ""
    echo "   Common fixes:"
    echo "   1. Check internet connection"
    echo "   2. If using HTTPS, make sure you're logged in:"
    echo "      git config --global user.name 'Your Name'"
    echo "      git config --global user.email 'your@email.com'"
    echo "   3. If using SSH, add your key to GitHub:"
    echo "      cat ~/.ssh/id_rsa.pub | pbcopy"
    echo "      Then paste in GitHub Settings > SSH Keys"
fi

# Check 5: JSON files valid
echo ""
echo "Checking JSON files..."
for file in data/*.json; do
    if [ -f "$file" ]; then
        if python3 -m json.tool "$file" >/dev/null 2>&1; then
            echo "✅ $(basename $file) - Valid JSON"
        else
            echo "❌ $(basename $file) - INVALID JSON"
            echo "   Fix: Check for syntax errors (missing commas, brackets)"
        fi
    fi
done

echo ""
echo "🔍 Common Issues & Solutions:"
echo "============================"
echo ""
echo "1. 'Permission denied' when running script"
echo "   Fix: chmod +x tools/update-api.sh"
echo ""
echo "2. 'Merge conflict' when pushing"
echo "   Fix: git pull origin main first, then push"
echo ""
echo "3. 'Render deploy failed'"
echo "   Check: Look for syntax errors in server.js"
echo "   Check: Verify all JSON files are valid"
echo "   Fix: Check Render dashboard for error logs"
echo ""
echo "4. 'Changes not showing on API'"
echo "   Wait: Render takes 2-3 minutes to deploy"
echo "   Check: Clear browser cache"
echo "   Check: URL is https://legal-data-api-ubsk.onrender.com"
echo ""
echo "5. 'Cannot find module' error"
echo "   Check: Did you delete any files?"
echo "   Fix: git checkout . (restores all files)"
echo ""

# Offer to fix common issues
echo ""
read -p "Do you want to run auto-fix for common issues? (y/n): " fixit

if [ "$fixit" = "y" ]; then
    echo ""
    echo "Running auto-fix..."
    
    # Fix permissions
    chmod +x tools/*.sh 2>/dev/null
    
    # Pull latest changes
    git pull origin main
    
    # Check JSON files
    for file in data/*.json; do
        if [ -f "$file" ]; then
            if ! python3 -m json.tool "$file" >/dev/null 2>&1; then
                echo "⚠️  Found invalid JSON: $file"
                echo "   Run: python3 -m json.tool $file"
                echo "   To see the error"
            fi
        fi
    done
    
    echo ""
    echo "✅ Auto-fix complete"
fi

echo ""
echo "Need more help? Check the README or contact Dave."
