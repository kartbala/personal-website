# Dr. Karthik Balasubramanian's Academic Website

This repository contains the source code for a classic oldschool yet elegant academic website for Dr. Karthik Balasubramanian, Assistant Professor of Information Systems and Supply Chain Management at Howard University School of Business.

## Design Philosophy

This website intentionally embraces a classic, early-web aesthetic while maintaining elegance and accessibility:

- Table-based layout reminiscent of academic websites from the early 2000s
- Serif typography for readability and classic appeal
- Minimal JavaScript
- Decorative ornaments and double borders for visual interest
- High contrast text with a light background
- Side navigation with contact information
- Fully responsive design that works on modern devices

## Accessibility Features

Despite the vintage aesthetic, the site includes several modern accessibility features:

- Skip to content link
- Text resizing controls
- High contrast mode
- Semantic HTML structure
- Responsive design that works on mobile devices
- Large default font size (18px)
- Preserved preferences using localStorage

## Content Sections

- About
- Education
- Research Expertise
- Teaching
- Publications
- Contact

## Setup Instructions

1. Clone the repository
2. Deploy to GitHub Pages or your preferred hosting service

## Local Development

To work on this website locally:

1. Clone the repository:
```
git clone https://github.com/kartbala/personal-website.git
```

2. Open the project in your preferred editor

3. Modify the files as needed

4. Test locally by opening index.html in a browser

5. Commit and push changes:
```
git add .
git commit -m "Your changes description"
git push origin main
```

## Homepage Image Carousel

The homepage features an image carousel that displays images from the `images/` folder.

Whenever images are added or removed, a GitHub Actions workflow automatically updates `scripts/image_list.json` with the current contents of the folder. You can also update the file manually by running:
```bash
python scripts/generate_image_list.py
```
The JSON file is used by the homepage to choose a random image.

## Contact

For more information, please contact me at karthik.b@howard.edu

## License

Copyright © 2025 Dr. Karthik Balasubramanian. All Rights Reserved.
