#!/bin/bash
# Quick development commands for balasubramanian.us

cd "/Users/karthikbalasubramanian/Google Drive/Scripts/personal-website"

case "$1" in
    "serve"|"s")
        echo "🚀 Starting local development server..."
        python3 ../balasubramanian_dev.py serve
        ;;
    "deploy"|"d")
        echo "📤 Deploying to GitHub Pages..."
        python3 ../balasubramanian_dev.py deploy "$2"
        ;;
    "status"|"st")
        echo "📊 Checking status..."
        python3 ../balasubramanian_dev.py status
        ;;
    "sync")
        echo "🔄 Syncing with remote..."
        python3 ../balasubramanian_dev.py sync
        ;;
    "security"|"sec")
        echo "🔒 Running security scan..."
        python3 ../website_security_scanner.py --path . --email --save
        ;;
    "security-daemon"|"secd")
        echo "🔄 Starting security daemon..."
        python3 ../periodic_security_scanner.py --path . --daemon
        ;;
    "security-status"|"secs")
        echo "📊 Security scan status..."
        python3 ../periodic_security_scanner.py --path . --status
        ;;
    "open"|"o")
        echo "🌐 Opening sites..."
        python3 ../balasubramanian_dev.py open
        ;;
    "edit"|"e")
        echo "📝 Opening in VS Code..."
        code .
        ;;
    *)
        echo "🌐 Balasubramanian.us Quick Commands"
        echo "=================================="
        echo "serve (s)     - Start local server"
        echo "deploy (d)    - Deploy changes"
        echo "status (st)   - Show status"
        echo "sync          - Sync with remote"
        echo "security (sec) - Run security scan"
        echo "security-daemon (secd) - Start security daemon"
        echo "security-status (secs) - Show scan status"
        echo "open (o)      - Open all URLs"
        echo "edit (e)      - Open in VS Code"
        echo ""
        echo "Examples:"
        echo "  ./dev.sh serve"
        echo "  ./dev.sh deploy 'Add new feature'"
        echo "  ./dev.sh security"
        echo "  ./dev.sh status"
        ;;
esac
