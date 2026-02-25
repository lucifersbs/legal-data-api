#!/bin/bash
# Setup Daily Auto-Scanner on Mac
# Run this once to schedule automatic daily updates

echo "📅 Setting up Daily Legal Data Scanner"
echo "========================================"
echo ""

REPO_PATH="$(cd "$(dirname "$0")/.." && pwd)"
SCANNER_SCRIPT="$REPO_PATH/tools/daily-scanner.sh"

# Make scanner executable
chmod +x "$SCANNER_SCRIPT"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "daily-scanner.sh"; then
    echo "⚠️  Daily scanner already scheduled"
    echo ""
    read -p "Do you want to reschedule? (y/n): " reschedule
    if [ "$reschedule" != "y" ]; then
        echo "Keeping existing schedule"
        exit 0
    fi
    # Remove old entry
    crontab -l 2>/dev/null | grep -v "daily-scanner.sh" | crontab -
fi

# Ask for time
echo ""
echo "What time should the scanner run daily?"
echo "1) 9:00 AM (default)"
echo "2) 12:00 PM (noon)"
echo "3) 6:00 PM"
echo "4) Custom time"
read -p "Choice (1-4): " time_choice

case $time_choice in
    1) HOUR=9; MINUTE=0 ;;
    2) HOUR=12; MINUTE=0 ;;
    3) HOUR=18; MINUTE=0 ;;
    4) 
        read -p "Enter hour (0-23): " HOUR
        read -p "Enter minute (0-59): " MINUTE
        ;;
    *) HOUR=9; MINUTE=0 ;;
esac

# Add cron job
CRON_JOB="$MINUTE $HOUR * * * cd $REPO_PATH && $SCANNER_SCRIPT >> $REPO_PATH/scanner.log 2>&1"

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo ""
echo "✅ Daily scanner scheduled!"
echo "Time: $HOUR:$(printf '%02d' $MINUTE) daily"
echo "Script: $SCANNER_SCRIPT"
echo "Log: $REPO_PATH/scanner.log"
echo ""

# Test run
echo "Do you want to run a test scan now?"
read -p "Test now? (y/n): " test_run

if [ "$test_run" = "y" ]; then
    echo ""
    echo "🧪 Running test scan..."
    echo "======================="
    "$SCANNER_SCRIPT"
fi

echo ""
echo "📋 To check or modify the schedule:"
echo "   crontab -l    (view schedule)"
echo "   crontab -e    (edit schedule)"
echo ""
echo "📋 To view scan logs:"
echo "   tail -f $REPO_PATH/scanner.log"
echo ""
echo "📋 To stop daily scans:"
echo "   crontab -l | grep -v daily-scanner | crontab -"
