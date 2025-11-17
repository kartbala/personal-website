#!/usr/bin/env python3
"""
Balasubramanian.us Development Tools
Local development and deployment for personal website
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path
import http.server
import socketserver
import threading

class BalasubramanianDev:
    def __init__(self):
        self.repo_path = Path("/Users/karthikbalasubramanian/Google Drive/Scripts/personal-website")
        self.domain = "balasubramanian.us"
        self.github_url = "https://kartbala.github.io/personal-website"
        self.local_port = 8080
        
    def serve_local(self):
        """Start local development server"""
        print(f"🚀 Starting local development server...")
        print(f"📁 Serving: {self.repo_path}")
        print(f"🌐 Local URL: http://localhost:{self.local_port}")
        print(f"⏹️  Press Ctrl+C to stop\n")
        
        os.chdir(self.repo_path)
        
        # Custom handler to serve files with proper MIME types
        class CustomHandler(http.server.SimpleHTTPRequestHandler):
            def end_headers(self):
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                super().end_headers()
        
        try:
            with socketserver.TCPServer(("", self.local_port), CustomHandler) as httpd:
                # Open browser automatically
                webbrowser.open(f"http://localhost:{self.local_port}")
                print(f"✅ Server started successfully!")
                print(f"📝 Edit files and refresh browser to see changes")
                httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Server stopped")
    
    def deploy(self, message=None):
        """Deploy changes to GitHub Pages"""
        print(f"🚀 Deploying to GitHub Pages...")
        
        os.chdir(self.repo_path)
        
        # Check for changes
        result = subprocess.run(["git", "status", "--porcelain"], 
                              capture_output=True, text=True)
        
        if not result.stdout.strip():
            print(f"📄 No changes to deploy")
            return True
        
        # Show what will be deployed
        print(f"📝 Changes to deploy:")
        subprocess.run(["git", "status", "--short"])
        
        # Commit message
        if not message:
            message = input(f"💬 Commit message (or press Enter for default): ").strip()
            if not message:
                message = f"Update website - {time.strftime('%Y-%m-%d %H:%M')}"
        
        try:
            # Add all changes
            subprocess.run(["git", "add", "."], check=True)
            
            # Commit
            subprocess.run(["git", "commit", "-m", message], check=True)
            
            # Push
            subprocess.run(["git", "push", "origin", "main"], check=True)
            
            print(f"✅ Deployed successfully!")
            print(f"🌐 GitHub Pages: {self.github_url}")
            print(f"🌍 Custom Domain: https://{self.domain}")
            print(f"⏱️  Changes will be live in 1-3 minutes")
            
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Deployment failed: {e}")
            return False
    
    def status(self):
        """Show development status"""
        print(f"📊 Balasubramanian.us Development Status")
        print(f"=" * 50)
        
        os.chdir(self.repo_path)
        
        # Repository info
        print(f"📁 Local Path: {self.repo_path}")
        print(f"🌐 GitHub URL: {self.github_url}")
        print(f"🌍 Domain: https://{self.domain}")
        
        # Git status
        result = subprocess.run(["git", "status", "--porcelain"], 
                              capture_output=True, text=True)
        
        if result.stdout.strip():
            print(f"\n📝 Uncommitted Changes:")
            subprocess.run(["git", "status", "--short"])
        else:
            print(f"\n✅ Working tree clean")
        
        # Recent commits
        print(f"\n📋 Recent Commits:")
        subprocess.run(["git", "log", "--oneline", "-5"])
        
        # Branch info
        result = subprocess.run(["git", "branch", "-v"], 
                              capture_output=True, text=True)
        print(f"\n🌿 Branch: {result.stdout.strip()}")
    
    def sync(self):
        """Sync with remote repository"""
        print(f"🔄 Syncing with remote repository...")
        
        os.chdir(self.repo_path)
        
        try:
            # Fetch latest changes
            subprocess.run(["git", "fetch", "origin"], check=True)
            
            # Pull changes
            subprocess.run(["git", "pull", "origin", "main"], check=True)
            
            print(f"✅ Synced successfully!")
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Sync failed: {e}")
            return False
    
    def open_sites(self):
        """Open all site URLs"""
        print(f"🌐 Opening all site URLs...")
        
        urls = [
            f"http://localhost:{self.local_port}",
            self.github_url,
            f"https://{self.domain}"
        ]
        
        for url in urls:
            print(f"🔗 Opening: {url}")
            webbrowser.open(url)
            time.sleep(0.5)  # Stagger opens
    
    def create_page(self, filename, title=None):
        """Create a new page from template"""
        if not filename.endswith('.html'):
            filename += '.html'
            
        filepath = self.repo_path / filename
        
        if filepath.exists():
            print(f"❌ File already exists: {filename}")
            return False
        
        title = title or filename.replace('.html', '').replace('_', ' ').title()
        
        template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Karthik Balasubramanian</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="about_me.html">About</a>
        <a href="expertise.html">Expertise</a>
        <a href="cool_stuff.html">Cool Stuff</a>
        <a href="contact.html">Contact</a>
    </nav>

    <main>
        <h1>{title}</h1>
        <p>New page content goes here...</p>
    </main>
    
    <script src="script.js"></script>
</body>
</html>"""
        
        with open(filepath, 'w') as f:
            f.write(template)
        
        print(f"✅ Created new page: {filename}")
        print(f"📝 Edit: {filepath}")
        
        return True

def main():
    if len(sys.argv) < 2:
        print("""
🌐 Balasubramanian.us Development Tools
======================================

COMMANDS:
  serve     Start local development server
  deploy    Deploy changes to GitHub Pages  
  status    Show development status
  sync      Sync with remote repository
  open      Open all site URLs
  create    Create new page from template
  
EXAMPLES:
  python3 balasubramanian_dev.py serve
  python3 balasubramanian_dev.py deploy
  python3 balasubramanian_dev.py deploy "Add new feature"
  python3 balasubramanian_dev.py create new_page "Page Title"
""")
        return
    
    dev = BalasubramanianDev()
    command = sys.argv[1].lower()
    
    if command == "serve":
        dev.serve_local()
    elif command == "deploy":
        message = sys.argv[2] if len(sys.argv) > 2 else None
        dev.deploy(message)
    elif command == "status":
        dev.status()
    elif command == "sync":
        dev.sync()
    elif command == "open":
        dev.open_sites()
    elif command == "create":
        filename = sys.argv[2] if len(sys.argv) > 2 else input("📝 Filename: ")
        title = sys.argv[3] if len(sys.argv) > 3 else None
        dev.create_page(filename, title)
    else:
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main()
