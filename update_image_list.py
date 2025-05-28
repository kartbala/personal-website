import os
import re

# 1. Define a list of valid image extensions
VALID_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif']

# 2. Scan the images/ directory for files
IMAGE_DIR = 'images'
image_paths = []

# Check if the image directory exists
if os.path.exists(IMAGE_DIR) and os.path.isdir(IMAGE_DIR):
    for filename in os.listdir(IMAGE_DIR):
        # 3. Collect paths of files that have one of the valid image extensions
        if any(filename.lower().endswith(ext) for ext in VALID_EXTENSIONS):
            image_paths.append(os.path.join(IMAGE_DIR, filename).replace("\\", "/")) # Ensure forward slashes for JS
else:
    print(f"Error: Directory '{IMAGE_DIR}' not found.")
    exit()

# 4. Read the content of scripts/image_cycler.js
JS_FILE_PATH = 'scripts/image_cycler.js'
try:
    with open(JS_FILE_PATH, 'r') as f:
        js_content = f.read()
except FileNotFoundError:
    print(f"Error: File '{JS_FILE_PATH}' not found.")
    exit()

# 5. Locate the imagePaths array assignment in the JavaScript code
# Regex to find "imagePaths = [...] ;" or "const imagePaths = [...] ;"
# It handles single or multi-line arrays.
regex_pattern = r"const\s+imagePaths\s*=\s*\[[^\]]*\];"

# 6. Construct the new JavaScript array string
new_image_paths_str = ", ".join([f'"{path}"' for path in image_paths])
new_js_array_assignment = f"const imagePaths = [{new_image_paths_str}];"

# 7. Replace the old imagePaths array in the JavaScript content with the new one
if re.search(regex_pattern, js_content, re.DOTALL):
    updated_js_content = re.sub(regex_pattern, new_js_array_assignment, js_content, flags=re.DOTALL)
else:
    print(f"Error: 'imagePaths' array not found in '{JS_FILE_PATH}'.")
    # Attempt to add it if not found, assuming it might be missing completely
    # This might need adjustment based on where it should be added.
    # For now, let's assume it should be at the beginning of the script if not found.
    print("Attempting to add the imagePaths array to the script.")
    updated_js_content = new_js_array_assignment + "\n" + js_content


# 8. Write the modified content back to scripts/image_cycler.js
try:
    with open(JS_FILE_PATH, 'w') as f:
        f.write(updated_js_content)
except IOError:
    print(f"Error: Could not write to file '{JS_FILE_PATH}'.")
    exit()

# 9. Print a message to the console indicating success and the number of images found and updated
print(f"Successfully updated '{JS_FILE_PATH}'.")
print(f"Found and updated {len(image_paths)} image(s):")
for path in image_paths:
    print(f" - {path}")

if not image_paths:
    print("No images found in the 'images' directory with valid extensions.")
