#!/bin/bash
# Daily Legal Data Scanner
# Automatically finds new legal data and adds to API
# Run via cron: 0 9 * * * /path/to/daily-scanner.sh

REPO_PATH="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$REPO_PATH/data"
LOG_FILE="$REPO_PATH/scanner.log"
DATE=$(date '+%Y-%m-%d')

echo "================================" >> "$LOG_FILE"
echo "Scan started: $DATE $(date '+%H:%M:%S')" >> "$LOG_FILE"
echo "================================" >> "$LOG_FILE"

cd "$REPO_PATH"

# Function to check if state exists
check_state_exists() {
    local state_code=$1
    local file=$2
    grep -q "\"$state_code\":" "$file"
}

# Function to check if injury type exists
check_injury_exists() {
    local injury=$1
    grep -q "\"$injury\":" "$DATA_DIR/settlements.json"
}

# Function to add statute data safely (no overwrite)
add_statute_safe() {
    local state_code=$1
    local state_name=$2
    local pi=$3
    local pd=$4
    local wd=$5
    local mm=$6
    local citation=$7
    
    if check_state_exists "$state_code" "$DATA_DIR/statute-of-limitations.json"; then
        echo "  ⚠️  $state_name already exists, skipping" >> "$LOG_FILE"
        return 1
    fi
    
    # Add to JSON (properly formatted)
    python3 << EOF
import json

with open('$DATA_DIR/statute-of-limitations.json', 'r') as f:
    data = json.load(f)

data['jurisdictions']['$state_code'] = {
    'name': '$state_name',
    'personal-injury': $pi,
    'property-damage': $pd,
    'wrongful-death': $wd,
    'medical-malpractice': $mm,
    'notes': '$citation'
}

with open('$DATA_DIR/statute-of-limitations.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"  ✅ Added $state_name")
EOF
    
    echo "  ✅ Added $state_name to statute data" >> "$LOG_FILE"
    return 0
}

# Function to add settlement data safely
add_settlement_safe() {
    local injury_type=$1
    local name=$2
    local min=$3
    local max=$4
    local median=$5
    local notes=$6
    
    if check_injury_exists "$injury_type"; then
        echo "  ⚠️  $name already exists, skipping" >> "$LOG_FILE"
        return 1
    fi
    
    python3 << EOF
import json

with open('$DATA_DIR/settlements.json', 'r') as f:
    data = json.load(f)

data['$injury_type'] = {
    'name': '$name',
    'minAmount': $min,
    'maxAmount': $max,
    'medianAmount': $median,
    'notes': '$notes'
}

with open('$DATA_DIR/settlements.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"  ✅ Added $name")
EOF
    
    echo "  ✅ Added $name to settlements" >> "$LOG_FILE"
    return 0
}

# Function to scrape/check for new legal updates (template)
scrape_legal_updates() {
    echo "🔍 Checking for legal updates..." >> "$LOG_FILE"
    
    # This is where you would add scraping logic
    # For now, using a queue file to track what to add next
    
    local queue_file="$REPO_PATH/data/queue.txt"
    
    if [ ! -f "$queue_file" ]; then
        # Create initial queue of states to add
        cat > "$queue_file" << 'QUEUE'
STATUTES_TO_ADD:
MN|Minnesota|2|6|3|4|Minn. Stat. § 541.07
WI|Wisconsin|3|6|3|3|Wis. Stat. § 893.54
MO|Missouri|5|5|3|2|Mo. Rev. Stat. § 516.120
SC|South Carolina|3|3|3|3|S.C. Code Ann. § 15-3-530
TN|Tennessee|1|3|1|1|Tenn. Code Ann. § 28-3-104
IN|Indiana|2|6|2|2|Ind. Code § 34-11-2-4
MA|Massachusetts|3|3|3|3|Mass. Gen. Laws ch. 260, § 2A
MD|Maryland|3|3|3|5|Md. Cts. & Jud. Proc. Code § 5-101
VA|Virginia|2|5|2|2|Va. Code Ann. § 8.01-243
WA|Washington|3|3|3|3|RCW 4.16.080

INJURIES_TO_ADD:
motorcycle-accident|Motorcycle Accident|20000|600000|95000|Higher severity than car accidents
truck-accident|Truck Accident|35000|800000|125000|Commercial vehicle involvement
premises-liability|Premises Liability|10000|300000|45000|Slip and fall, inadequate security
product-liability|Product Liability|25000|1000000|150000|Defective products
dog-bite|Dog Bite|5000|150000|35000|Owner liability varies by state
QUEUE
    fi
    
    # Read queue and add one item per day
    local added_count=0
    
    # Try to add one statute
    while IFS='|' read -r code name pi pd wd mm citation; do
        [ -z "$code" ] && continue
        [[ "$code" == STATUTES_TO_ADD:* ]] && continue
        [[ "$code" == INJURIES_TO_ADD:* ]] && break
        
        if add_statute_safe "$code" "$name" "$pi" "$pd" "$wd" "$mm" "$citation"; then
            added_count=$((added_count + 1))
            # Remove from queue
            sed -i "/^$code|/d" "$queue_file"
            break  # Only add one per day
        fi
    done < "$queue_file"
    
    # Try to add one injury type
    local in_injuries=false
    while IFS='|' read -r type name min max median notes; do
        [ -z "$type" ] && continue
        
        if [[ "$type" == INJURIES_TO_ADD:* ]]; then
            in_injuries=true
            continue
        fi
        
        $in_injuries || continue
        
        if add_settlement_safe "$type" "$name" "$min" "$max" "$median" "$notes"; then
            added_count=$((added_count + 1))
            sed -i "/^$type|/d" "$queue_file"
            break
        fi
    done < "$queue_file"
    
    echo "📊 Added $added_count new items today" >> "$LOG_FILE"
    return $added_count
}

# Function to validate all data
validate_data() {
    echo "🔍 Validating data files..." >> "$LOG_FILE"
    local errors=0
    
    for file in "$DATA_DIR"/*.json; do
        if [ -f "$file" ]; then
            if python3 -m json.tool "$file" >/dev/null 2>&1; then
                echo "  ✅ $(basename $file) valid" >> "$LOG_FILE"
            else
                echo "  ❌ $(basename $file) INVALID" >> "$LOG_FILE"
                errors=$((errors + 1))
            fi
        fi
    done
    
    return $errors
}

# Function to auto-push changes
auto_push() {
    local changes=$(git status --short | wc -l)
    
    if [ "$changes" -eq 0 ]; then
        echo "📭 No changes to push" >> "$LOG_FILE"
        return 0
    fi
    
    echo "📤 Pushing $changes changes to GitHub..." >> "$LOG_FILE"
    
    git add data/
    git commit -m "Auto-update: Add new legal data ($DATE)" >> "$LOG_FILE" 2>&1
    
    if git push origin main >> "$LOG_FILE" 2>&1; then
        echo "✅ Successfully pushed to GitHub" >> "$LOG_FILE"
        echo "⏳ Render will auto-deploy in 2-3 minutes" >> "$LOG_FILE"
        return 0
    else
        echo "❌ Push failed" >> "$LOG_FILE"
        return 1
    fi
}

# Main execution
echo "🚀 Starting daily scan..."

# Check if in repo
if [ ! -f "$REPO_PATH/server.js" ]; then
    echo "❌ Error: Not in legal-data-api repo" >> "$LOG_FILE"
    exit 1
fi

# Pull latest changes first
git pull origin main >> "$LOG_FILE" 2>&1

# Find and add new data
new_items=0
scrape_legal_updates
new_items=$?

# Validate
validate_data
validation_ok=$?

if [ $validation_ok -eq 0 ] && [ $new_items -gt 0 ]; then
    # Push changes
    auto_push
else
    echo "⚠️  Skipping push (no new data or validation failed)" >> "$LOG_FILE"
fi

echo "" >> "$LOG_FILE"
echo "Scan completed: $(date '+%H:%M:%S')" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# Output summary to console
echo ""
echo "📊 Daily Scan Complete"
echo "======================"
echo "Date: $DATE"
echo "New items added: $new_items"
echo "Log: $LOG_FILE"
echo ""
echo "Next scan: Tomorrow at 9:00 AM"
