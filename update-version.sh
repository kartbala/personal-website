#!/bin/bash

# This is a manual version update script for when the pre-commit hook isn't run
# You can run this manually before committing by running ./update-version.sh

# Get the current commit hash
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null)
if [ $? -ne 0 ]; then
  # Not a git repository or git not available
  COMMIT_HASH="manual-$(date +%s)"
fi

# Update the version.js file
cat > scripts/version.js << EOF
// This file is automatically updated by the pre-commit hook
window.APP_VERSION = {
  commit: "${COMMIT_HASH}",
  date: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  timestamp: $(date +%s000)
};
EOF

echo "Updated version.js with commit ${COMMIT_HASH}"
