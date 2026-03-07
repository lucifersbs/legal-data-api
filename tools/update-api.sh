#!/bin/bash
# Simple API Updater for Mac
# Place this in your legal-data-api repo and run: ./update-api.sh

echo "🚀 Legal Data API Updater"
echo "========================="
echo ""

# Check if in correct directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "Please run this from your legal-data-api directory"
    exit 1
fi

# Menu
echo "What do you want to do?"
echo ""
echo "1) Add more states to existing data"
echo "2) Add more injury types to settlements"
echo "3) Push changes to GitHub"
echo "4) Check status"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📋 Instructions to add more states:"
        echo ""
        echo "1. Open data/statute-of-limitations.json:"
        echo "   nano data/statute-of-limitations.json"
        echo ""
        echo "2. Add new state following this format:"
        echo '   "NM": {'
        echo '     "name": "New Mexico",'
        echo '     "personal-injury": 3,'
        echo '     "property-damage": 4,'
        echo '     "wrongful-death": 3,'
        echo '     "medical-malpractice": 3'
        echo '   }'
        echo ""
        echo "3. Save (Ctrl+O, Enter, Ctrl+X)"
        echo ""
        echo "4. Then run: ./update-api.sh and choose option 3"
        ;;
        
    2)
        echo ""
        echo "📋 Instructions to add injury types:"
        echo ""
        echo "1. Open data/settlements.json:"
        echo "   nano data/settlements.json"
        echo ""
        echo "2. Add new injury type following this format:"
        echo '   "motorcycle-accident": {'
        echo '     "name": "Motorcycle Accident",'
        echo '     "minAmount": 25000,'
        echo '     "maxAmount": 500000,'
        echo '     "medianAmount": 85000,'
        echo '     "notes": "Higher severity than car accidents"'
        echo '   }'
        echo ""
        echo "3. Save (Ctrl+O, Enter, Ctrl+X)"
        echo ""
        echo "4. Then run: ./update-api.sh and choose option 3"
        ;;
        
    3)
        echo ""
        read -p "Enter commit message (e.g., 'Add 5 new states'): " message
        
        echo ""
        echo "📤 Pushing to GitHub..."
        git add .
        git commit -m "$message"
        git push origin main
        
        echo ""
        echo "✅ Changes pushed!"
        echo "⏳ Render will deploy in 2-3 minutes"
        echo "🌐 Check: https://legal-data-api-ubsk.onrender.com"
        ;;
        
    4)
        echo ""
        echo "📊 Repository Status:"
        echo "Location: $(pwd)"
        echo "Data files: $(ls data/*.json 2>/dev/null | wc -l)"
        echo "Git status:"
        git status --short
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
