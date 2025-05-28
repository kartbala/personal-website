import os
import json

try:
    from PIL import Image, UnidentifiedImageError
except ImportError:
    print("Error: Pillow library not found. Please install it using: pip install Pillow")
    exit(1)

def generate_image_list():
    """
    Scans the images/ directory for valid image files and creates a JSON file
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
        with open(output_json_path, "w") as f:
            json.dump([], f)
        print("Created an empty 'image_list.json'.")
        return

    for filename in os.listdir(images_dir):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            filepath = os.path.join(images_dir, filename)
            img = None  # Initialize img to None
            try:
                img = Image.open(filepath)
                img.verify()  # Verifies if the image data is corrupt
                # If verify() succeeds, the image is considered valid for the list
                image_paths.append(f"images/{filename}")
            except UnidentifiedImageError:
                print(f"WARNING: Unidentified image format: {filepath}. Skipping.")
            except Exception as e:
                print(f"WARNING: Could not validate image: {filepath} due to {type(e).__name__}: {e}. Skipping.")
            finally:
                # verify() is supposed to close the file, but it's good practice
                # to ensure it's closed if it was opened by Image.open()
                if img is not None and hasattr(img, 'fp') and img.fp is not None:
                    try:
                        img.fp.close()
                    except Exception:
                        pass # Ignore errors on close
                # For newer Pillow versions, 'img.close()' is the preferred method
                if img is not None and hasattr(img, 'close'):
                    try:
                        img.close()
                    except Exception:
                        pass # Ignore errors on close


    with open(output_json_path, "w") as f:
        json.dump(image_paths, f, indent=2)

    print(f"Found {len(image_paths)} valid images. List saved to '{output_json_path}'.")

if __name__ == "__main__":
    generate_image_list()
