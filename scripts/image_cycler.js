// Cycle through an array of image paths, updating the image element every few
// seconds. The list of images comes from scripts/image_list.json so new images
// in the "headshot images" folder are automatically included without needing to
// modify this script.
function startImageCycle(imagePaths, imgElement, delayMs = 5000) {
  if (!imgElement || !Array.isArray(imagePaths) || imagePaths.length === 0) {
    return;
  }
  let index = 0;

  function showNext() {
    imgElement.src = imagePaths[index];
    index = (index + 1) % imagePaths.length;
  }

  // Show the first image immediately and then continue cycling.
  showNext();
  setInterval(showNext, delayMs);
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

      // Begin cycling through all available images.
      startImageCycle(imagePaths, profileImage);
    })
    .catch(error => {
      console.error("Failed to load or parse image list:", error);
    });
};
