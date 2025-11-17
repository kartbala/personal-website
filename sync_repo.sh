#!/bin/bash

# Navigate to the repository directory
cd "/Users/karthikbalasubramanian/Google Drive/Scripts/personal-website"

# Print current branch
echo "Current branch:"
git branch --show-current

# Fetch latest changes from remote
echo -e "\nFetching latest changes from remote..."
git fetch origin

# Check status
echo -e "\nCurrent status:"
git status

# Pull latest changes
echo -e "\nPulling latest changes from main branch..."
git pull origin main

# List any campaign-related files
echo -e "\nLooking for campaign-related files:"
ls -la | grep -i campaign || echo "No campaign files found locally yet"
ls -la | grep -i petition || echo "No petition files found locally yet"

echo -e "\nSync complete!"
