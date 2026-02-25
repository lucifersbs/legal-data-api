#!/bin/bash
# Auto Data Generator for Legal Data API
# Automatically generates realistic legal data for new states/injuries

echo "🤖 Legal Data API - Auto Data Generator"
echo "========================================"
echo ""

# Templates for statute data
# Format: "state-code|state-name|personal-injury|property-damage|wrongful-death|medical-malpractice|notes"

STATUTE_TEMPLATES=(
  "MN|Minnesota|2|6|3|4|Minn. Stat. § 541.07"
  "WI|Wisconsin|3|6|3|3|Wis. Stat. § 893.54"
  "MO|Missouri|5|5|3|2|Mo. Rev. Stat. § 516.120"
  "SC|South Carolina|3|3|3|3|S.C. Code Ann. § 15-3-530"
  "TN|Tennessee|1|3|1|1|Tenn. Code Ann. § 28-3-104"
  "IN|Indiana|2|6|2|2|Ind. Code § 34-11-2-4"
  "MA|Massachusetts|3|3|3|3|Mass. Gen. Laws ch. 260, § 2A"
  "MD|Maryland|3|3|3|5|Md. Cts. & Jud. Proc. Code § 5-101"
  "VA|Virginia|2|5|2|2|Va. Code Ann. § 8.01-243"
  "WA|Washington|3|3|3|3|RCW 4.16.080"
  "AZ|Arizona|2|3|2|2|A.R.S. § 12-542"
  "CO|Colorado|2|2|2|2|C.R.S. § 13-80-102"
  "CT|Connecticut|2|3|2|3|Conn. Gen. Stat. § 52-584"
  "NJ|New Jersey|2|6|2|2|N.J. Stat. Ann. § 2A:14-2"
  "NC|North Carolina|3|3|2|3|N.C. Gen. Stat. § 1-52"
  "MI|Michigan|3|3|3|2|MCL 600.5805"
  "GA|Georgia|2|4|2|2|O.C.G.A. § 9-3-33"
)

# Templates for settlement data
# Format: "injury-type|name|min|max|median|notes"

SETTLEMENT_TEMPLATES=(
  "motorcycle-accident|Motorcycle Accident|20000|600000|95000|Higher severity than car accidents due to lack of protection"
  "truck-accident|Truck Accident|35000|800000|125000|Commercial vehicle involvement increases settlement values"
  "premises-liability|Premises Liability|10000|300000|45000|Slip and fall, inadequate security cases"
  "product-liability|Product Liability|25000|1000000|150000|Defective products, manufacturer liability"
  "dog-bite|Dog Bite|5000|150000|35000|Owner liability varies by state"
  "wrongful-termination|Wrongful Termination|15000|500000|75000|Employment discrimination, breach of contract"
  "discrimination|Employment Discrimination|20000|400000|85000|Race, gender, age discrimination cases"
  "assault|Assault and Battery|10000|250000|40000|Intentional tort, criminal element involved"
  "defamation|Defamation|5000|200000|30000|Libel or slander, reputational harm"
)

# Function to add statute data for a state
add_state_statute() {
    local state_code=$1
    local state_name=$2
    local pi=$3
    local pd=$4
    local wd=$5
    local mm=$6
    local citation=$7
    
    echo "Adding $state_name..."
    
    # Read current file
    local file="data/statute-of-limitations.json"
    local content=$(cat "$file")
    
    # Check if state already exists
    if echo "$content" | grep -q "\"$state_code\":"; then
        echo "  ⚠️  $state_name already exists, skipping"
        return
    fi
    
    # Create new state entry
    local new_entry="\"
    $state_code\": {\"
      name\": \"$state_name\",\"
      personal-injury\": $pi,\"
      property-damage\": $pd,\"
      wrongful-death\": $wd,\"
      medical-malpractice\": $mm,\"
      notes\": \"$citation\"
    }"
    
    # Add before the closing brace of jurisdictions
    content=$(echo "$content" | sed "s|}|},$new_entry|}")
    
    # Write back
    echo "$content" > "$file"
    echo "  ✅ Added $state_name"
}

# Function to add settlement data
add_settlement() {
    local injury_type=$1
    local name=$2
    local min=$3
    local max=$4
    local median=$5
    local notes=$6
    
    echo "Adding $name..."
    
    local file="data/settlements.json"
    local content=$(cat "$file")
    
    # Check if injury already exists
    if echo "$content" | grep -q "\"$injury_type\":"; then
        echo "  ⚠️  $name already exists, skipping"
        return
    fi
    
    # Create new entry
    local new_entry="\"
    $injury_type\": {\"
      name\": \"$name\",\"
      minAmount\": $min,\"
      maxAmount\": $max,\"
      medianAmount\": $median,\"
      notes\": \"$notes\"
    }"
    
    # Add before closing brace
    content=$(echo "$content" | sed "s|}|},$new_entry|}")
    
    echo "$content" > "$file"
    echo "  ✅ Added $name"
}

# Show menu
echo "What do you want to auto-generate?"
echo ""
echo "1) Add 5 random states to statute data"
echo "2) Add 3 random injury types to settlements"
echo "3) Add specific state (enter code like MN, WI, etc.)"
echo "4) Show available templates"
echo ""
read -p "Choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🎲 Adding 5 random states..."
        # Shuffle and pick 5
        for template in $(echo "${STATUTE_TEMPLATES[@]}" | tr ' ' '\n' | shuf | head -5); do
            IFS='|' read -r code name pi pd wd mm citation <<< "$template"
            add_state_statute "$code" "$name" "$pi" "$pd" "$wd" "$mm" "$citation"
        done
        echo ""
        echo "📝 Next step: Run update-api.sh and push changes"
        ;;
        
    2)
        echo ""
        echo "🎲 Adding 3 random injury types..."
        for template in $(echo "${SETTLEMENT_TEMPLATES[@]}" | tr ' ' '\n' | shuf | head -3); do
            IFS='|' read -r type name min max median notes <<< "$template"
            add_settlement "$type" "$name" "$min" "$max" "$median" "$notes"
        done
        echo ""
        echo "📝 Next step: Run update-api.sh and push changes"
        ;;
        
    3)
        echo ""
        read -p "Enter state code (e.g., MN, WI, TX): " state_input
        found=false
        for template in "${STATUTE_TEMPLATES[@]}"; do
            IFS='|' read -r code name pi pd wd mm citation <<< "$template"
            if [ "$code" = "$state_input" ]; then
                add_state_statute "$code" "$name" "$pi" "$pd" "$wd" "$mm" "$citation"
                found=true
                break
            fi
        done
        if [ "$found" = false ]; then
            echo "❌ State code not in templates. Add manually or pick from available."
        fi
        ;;
        
    4)
        echo ""
        echo "📋 Available State Templates:"
        for template in "${STATUTE_TEMPLATES[@]}"; do
            IFS='|' read -r code name rest <<< "$template"
            echo "  • $code - $name"
        done
        echo ""
        echo "📋 Available Injury Templates:"
        for template in "${SETTLEMENT_TEMPLATES[@]}"; do
            IFS='|' read -r type name rest <<< "$template"
            echo "  • $type - $name"
        done
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Validate JSON after changes
echo ""
echo "🔍 Validating JSON files..."
if python3 -m json.tool data/statute-of-limitations.json >/dev/null 2>&1; then
    echo "✅ Statute data valid"
else
    echo "❌ Statute data invalid - check syntax"
fi

if python3 -m json.tool data/settlements.json >/dev/null 2>&1; then
    echo "✅ Settlement data valid"
else
    echo "❌ Settlement data invalid - check syntax"
fi

echo ""
echo "🚀 Ready to push? Run: ./tools/update-api.sh"
