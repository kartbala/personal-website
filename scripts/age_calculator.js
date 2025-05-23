// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  const calculateBtn = document.getElementById('calculateBtn');
  
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateAndDisplayAge);
  } else {
    console.error("Button with ID 'calculateBtn' not found.");
  }
});

function formatHumanReadable(number) {
  if (number < 1000) {
    // For numbers less than 1000, return as is, or with one decimal if not whole
    return Number.isInteger(number) ? number.toString() : number.toFixed(1);
  }

  const suffixes = ['', 'K', 'M', 'B']; // K for thousands, M for millions, B for billions
  const i = Math.floor(Math.log10(Math.abs(number)) / 3); // Determine the suffix index

  if (i >= suffixes.length) { // Handle numbers larger than supported suffixes (e.g., trillions)
    // Fallback: return in scientific notation or handle as per requirements for very large numbers
    return number.toExponential(1); 
  }

  const scaledNumber = number / Math.pow(1000, i);
  
  // Check if the scaled number is an integer or needs a decimal place
  // Aim for one decimal place if not an exact multiple
  const formattedNumber = (scaledNumber % 1 === 0) ? scaledNumber.toFixed(0) : scaledNumber.toFixed(1);

  return formattedNumber + suffixes[i];
}

function calculateAndDisplayAge() {
  const birthdateInput = document.getElementById('birthdate');
  const birthdateValue = birthdateInput.value;

  // Output elements
  const ageSecondsSpan = document.getElementById('ageSeconds');
  const ageMinutesSpan = document.getElementById('ageMinutes');
  const ageHoursSpan = document.getElementById('ageHours');
  const ageDaysSpan = document.getElementById('ageDays');
  const ageWeeksSpan = document.getElementById('ageWeeks');
  const ageMonthsSpan = document.getElementById('ageMonths');

  // Clear previous results or error messages
  ageSecondsSpan.textContent = '';
  ageMinutesSpan.textContent = '';
  ageHoursSpan.textContent = '';
  ageDaysSpan.textContent = '';
  ageWeeksSpan.textContent = '';
  ageMonthsSpan.textContent = '';

  if (!birthdateValue) {
    // Basic error handling: if birthdate is empty
    // In a real application, you'd show a user-friendly message
    alert("Please enter your birthdate."); 
    return;
  }

  const birthDate = new Date(birthdateValue);
  const currentDate = new Date();

  if (isNaN(birthDate.getTime())) {
    // Basic error handling: if date is invalid
    alert("Invalid date format. Please use a valid date.");
    return;
  }

  if (birthDate > currentDate) {
    alert("Birthdate cannot be in the future.");
    return;
  }

  // Calculate the difference in milliseconds
  const diffMilliseconds = currentDate.getTime() - birthDate.getTime();

  // Convert to various units
  const totalSeconds = diffMilliseconds / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;
  const totalWeeks = totalDays / 7;
  const averageDaysInMonth = 30.4375; // Average days in a month
  const totalMonths = totalDays / averageDaysInMonth;

  // Update the span elements with the calculated values
  ageSecondsSpan.textContent = formatHumanReadable(totalSeconds);
  ageMinutesSpan.textContent = formatHumanReadable(totalMinutes);
  ageHoursSpan.textContent = formatHumanReadable(totalHours);
  ageDaysSpan.textContent = formatHumanReadable(totalDays);
  ageWeeksSpan.textContent = formatHumanReadable(totalWeeks);
  ageMonthsSpan.textContent = formatHumanReadable(totalMonths);
}
