// Array of image paths
// BEGIN AUTO-GENERATED IMAGE LIST
const imagePaths = ["images/img1.png", "images/web_4.png", "images/img2.jpg", "images/img3.gif", "images/web_5.png", "images/test_new_image.png", "images/web_9.png", "images/web_8.png", "images/web_6.png"];
// END AUTO-GENERATED IMAGE LIST

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
