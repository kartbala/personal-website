#!/bin/bash

# This is a manual version update script for when the pre-commit hook isn't run
# You can run this manually before committing by running ./update-version.sh

# Get the current date in YYYYMMDD format to use as the version
TODAY=$(date -u +"%Y%m%d")
# Separate human readable date value
HUMAN_DATE=$(date -u +"%Y-%m-%d")

# Update the version.js file
cat > scripts/version.js << EOF
// This file is automatically updated by the pre-commit hook
window.APP_VERSION = {
  commit: "${TODAY}",
  date: "${HUMAN_DATE}"
};
EOF

echo "Updated version.js for ${HUMAN_DATE}"
