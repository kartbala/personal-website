#!/bin/bash

# Navigate to the repository directory
cd "/Users/karthikbalasubramanian/Google Drive/Scripts/personal-website"

# Add all the new campaign files
echo "Adding new campaign pages..."
git add damjan_campaign.html
git add field_tracker.html
git add volunteer_hub.html
git add momentum_dashboard.html
git add index.html

# Check status
echo -e "\nFiles to be committed:"
git status --short

# Commit the changes
echo -e "\nCommitting changes..."
git commit -m "Add comprehensive campaign tracking pages for Damjan CT-03

- Added main campaign hub (damjan_campaign.html)
- Created field operations tracker for door-knocking progress
- Built volunteer coordination hub with role signups
- Implemented momentum dashboard with social media and fundraising metrics
- Updated homepage with campaign link
- All pages feature harmonized dark theme and responsive design
- Includes localStorage for persistent data tracking"

# Push to GitHub
echo -e "\nPushing to GitHub..."
git push origin main

echo -e "\nDeployment complete! Pages should be live at:"
echo "https://balasubramanian.us/damjan_campaign.html"
echo "https://balasubramanian.us/field_tracker.html"
echo "https://balasubramanian.us/volunteer_hub.html"
echo "https://balasubramanian.us/momentum_dashboard.html"
