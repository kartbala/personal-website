// Array of image paths
const imagePaths = [
  "images/web_1.png",
  "images/web_2.png",
  "images/web_3.png",
  "images/web_4.png",
  "images/web_5.png",
  "images/web_6.png"
];

// Function to get a random image path from the imagePaths array
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
}

// Function to run when the window loads
window.onload = function() {
  // Get the image element by its ID
  const profileImage = document.getElementById("profile-image");

  // Check if the image element exists
  if (profileImage) {
    // Get a random image path
    const randomImagePath = getRandomImage();
    // Set the src attribute of the image element
    profileImage.src = randomImagePath;
  } else {
    console.error("Element with ID 'profile-image' not found.");
  }
};
