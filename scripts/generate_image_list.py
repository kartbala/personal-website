import os
import json

def generate_image_list():
    """
    Scans the images/ directory for image files and creates a JSON file
    named image_list.json in the scripts/ directory containing a list of their paths.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    images_dir = os.path.join(repo_root, "images")
    output_json_path = os.path.join(script_dir, "image_list.json")

    image_extensions = [".png", ".jpg", ".jpeg", ".gif"]
    image_paths = []

    if not os.path.exists(images_dir):
        print(f"Error: Directory '{images_dir}' not found.")
        # Create an empty JSON file if the images directory doesn't exist
        with open(output_json_path, "w") as f:
            json.dump([], f)
        print("Created an empty 'image_list.json'.")
        return

    for filename in os.listdir(images_dir):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            image_paths.append(f"images/{filename}")

    with open(output_json_path, "w") as f:
        json.dump(image_paths, f, indent=2)

    print(f"Found {len(image_paths)} images. List saved to '{output_json_path}'.")

if __name__ == "__main__":
    generate_image_list()
