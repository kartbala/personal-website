// Function to get a random image path from an array of image paths
function getRandomImage(imagePaths) {
  if (!imagePaths || imagePaths.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
}

// Function to run when the window loads
window.onload = function() {
  const profileImage = document.getElementById("profile-image");

  if (!profileImage) {
    console.error("Element with ID 'profile-image' not found.");
    return;
  }

  fetch("scripts/image_list.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Failed to fetch scripts/image_list.json`);
      }
      return response.json();
    })
    .then(imagePaths => {
      if (!Array.isArray(imagePaths)) {
        console.error("Error: Fetched data is not a valid JSON array.");
        return;
      }
      if (imagePaths.length === 0) {
        console.log("No images found in scripts/image_list.json.");
        return;
      }

      const randomImagePath = getRandomImage(imagePaths);
      if (randomImagePath) {
        profileImage.src = randomImagePath;
      } else {
        // This case should ideally be covered by the imagePaths.length === 0 check,
        // but as a fallback:
        console.log("Could not select a random image.");
      }
    })
    .catch(error => {
      console.error("Failed to load or parse image list:", error);
    });
};
