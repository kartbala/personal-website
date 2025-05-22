// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  const calculateBtn = document.getElementById('calculateBtn');
  
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateAndDisplayAge);
  } else {
    console.error("Button with ID 'calculateBtn' not found.");
  }
});

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
  ageSecondsSpan.textContent = totalSeconds.toFixed(0);
  ageMinutesSpan.textContent = totalMinutes.toFixed(0);
  ageHoursSpan.textContent = totalHours.toFixed(0);
  ageDaysSpan.textContent = totalDays.toFixed(0);
  ageWeeksSpan.textContent = totalWeeks.toFixed(1); // Show one decimal for weeks
  ageMonthsSpan.textContent = totalMonths.toFixed(1); // Show one decimal for months
}
