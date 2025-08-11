# Balasubramanian.us Development Setup

Local development environment for personal website connected to GitHub Pages.

## 🌐 Site URLs
- **Local Development:** http://localhost:8080
- **GitHub Pages:** https://kartbala.github.io/personal-website  
- **Custom Domain:** https://balasubramanian.us

## 🚀 Quick Start

### Start Local Development Server
```bash
# From anywhere - full development tool
cd "/Users/karthikbalasubramanian/Google Drive/Scripts"
python3 balasubramanian_dev.py serve

# From this directory - quick commands
./dev.sh serve
# or just:
./dev.sh s
```

### Deploy Changes  
```bash
# With custom commit message
./dev.sh deploy "Add new feature"

# Interactive (will prompt for message)
./dev.sh deploy
```

### Development Status
```bash
./dev.sh status
```

## 🛠️ Development Tools

### Main Development Script
`../balasubramanian_dev.py` - Full-featured development tool with:
- Local server with hot reload
- Deployment to GitHub Pages
- Status checking
- Sync with remote repository
- New page creation from template

### Quick Commands Script  
`./dev.sh` - Fast access to common commands:
- `serve` (s) - Start local server
- `deploy` (d) - Deploy changes
- `status` (st) - Show status  
- `sync` - Sync with remote
- `open` (o) - Open all URLs
- `edit` (e) - Open in VS Code

## 📁 Site Structure

```
balasubramanian.org/
├── index.html              # Minimal homepage with typed name effect
├── links.html              # Main navigation page
├── about_me.html           # About page
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript
├── scripts/                # JavaScript modules
│   ├── image_cycler.js
│   ├── keyboard_nav.js  
│   ├── typed_name.js
│   └── site_search.js
├── headshot images/        # Profile photos
├── publications.json       # Academic publications data
└── [50+ other pages]       # Various tools, visualizations, content
```

## 💻 Development Workflow

### 1. Make Changes Locally
```bash
# Start local server
./dev.sh serve

# Edit files in your favorite editor
./dev.sh edit  # Opens VS Code

# View changes at http://localhost:8080
```

### 2. Test Changes
- Server auto-refreshes when files change
- Check different pages and functionality
- Test on different screen sizes

### 3. Deploy to Production
```bash
# Deploy with descriptive message
./dev.sh deploy "Add new calculator tool"

# Check deployment status
./dev.sh status
```

### 4. Verify Live Site
```bash
# Open all site URLs
./dev.sh open
```

## 🔧 Advanced Features

### Create New Page
```bash
python3 ../balasubramanian_dev.py create "new_tool" "Cool New Tool"
```

### Sync with Remote Changes
```bash
./dev.sh sync
```

### Health Check
```bash
# Use the general website health checker
cd ..
python3 website_health_check.py personal-website --domain balasubramanian.us
```

## 🎨 Site Features

### Homepage (index.html)
- Minimal design with profile photo
- Typed name animation effect
- Click to navigate to links page

### Navigation (links.html)  
- Card-based navigation layout
- Links to all major sections
- Last updated timestamp

### Content Pages
- **About Me** - Personal information
- **Helpful Tools** - Interactive utilities
- **Cool Visualizations** - Data visualizations  
- **Cool Stuff** - External links
- **Inspiration** - Motivational content
- **Many more...** - 50+ specialized pages

### Interactive Features
- Keyboard navigation
- Site-wide search
- Responsive design
- Dark theme
- Tamil language support

## 🔄 Git Workflow

### Check Status
```bash
git status
git log --oneline -5
```

### Manual Git Operations
```bash
# Pull latest changes
git pull origin main

# Add and commit
git add .
git commit -m "Your message"
git push origin main
```

## 🐛 Troubleshooting

### Local Server Issues
- **Port 8080 busy:** Change port in balasubramanian_dev.py
- **Permission denied:** Check script permissions with `ls -la dev.sh`

### Deployment Issues
- **Git errors:** Check `git status` and resolve conflicts
- **GitHub Pages delay:** Wait 1-3 minutes after deployment
- **DNS issues:** Use health checker to diagnose

### Browser Caching
```bash
# Open fresh version with cache-busting
python3 ../open_fresh_site.py
```

## 📚 Related Documentation

- **Comprehensive deployment guide:** `~/Google Drive/roam/dangerousdc-deployment.org`
- **Website toolkit:** `../toolkit.py help`
- **Health checker:** `../website_health_check.py`

---

*This development setup uses the battle-tested workflow from DangerousDC.org deployment*
