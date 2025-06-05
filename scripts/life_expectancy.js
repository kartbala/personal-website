// Life Expectancy Calculator Script
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  const calcBtn = document.getElementById('calculateLifeBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', calculateLifeExpectancy);
  } else {
    console.error("Button with ID 'calculateLifeBtn' not found.");
  }
});

function formatHumanReadable(number) {
  if (number < 1000) {
    return Number.isInteger(number) ? number.toString() : number.toFixed(1);
  }
  const suffixes = ['', 'K', 'M', 'B'];
  const i = Math.floor(Math.log10(Math.abs(number)) / 3);
  if (i >= suffixes.length) {
    return number.toExponential(1);
  }
  const scaledNumber = number / Math.pow(1000, i);
  const formattedNumber = (scaledNumber % 1 === 0) ? scaledNumber.toFixed(0) : scaledNumber.toFixed(1);
  return formattedNumber + suffixes[i];
}

function calculateLifeExpectancy() {
  const birthdateInput = document.getElementById('lifeBirthdate');
  const expectancyInput = document.getElementById('expectedYears');

  const birthdateValue = birthdateInput.value;
  const expectancyYears = parseFloat(expectancyInput.value);

  const secondsSpan = document.getElementById('lifeSeconds');
  const minutesSpan = document.getElementById('lifeMinutes');
  const hoursSpan = document.getElementById('lifeHours');
  const daysSpan = document.getElementById('lifeDays');
  const weeksSpan = document.getElementById('lifeWeeks');
  const monthsSpan = document.getElementById('lifeMonths');
  const yearsSpan = document.getElementById('lifeYears');

  secondsSpan.textContent = '';
  minutesSpan.textContent = '';
  hoursSpan.textContent = '';
  daysSpan.textContent = '';
  weeksSpan.textContent = '';
  monthsSpan.textContent = '';
  yearsSpan.textContent = '';

  if (!birthdateValue) {
    alert('Please enter your birthdate.');
    return;
  }
  if (isNaN(expectancyYears) || expectancyYears <= 0) {
    alert('Please enter a valid life expectancy in years.');
    return;
  }

  const birthDate = new Date(birthdateValue);
  if (isNaN(birthDate.getTime())) {
    alert('Invalid date format. Please use a valid date.');
    return;
  }
  const expectedEndDate = new Date(birthDate);
  expectedEndDate.setFullYear(expectedEndDate.getFullYear() + expectancyYears);
  const currentDate = new Date();

  const diffMilliseconds = expectedEndDate.getTime() - currentDate.getTime();
  if (diffMilliseconds <= 0) {
    alert('According to this life expectancy, you have surpassed the expected lifespan.');
    return;
  }

  const totalSeconds = diffMilliseconds / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;
  const totalWeeks = totalDays / 7;
  const averageDaysInMonth = 30.4375; // Average days in a month
  const totalMonths = totalDays / averageDaysInMonth;
  const totalYears = totalMonths / 12;

  secondsSpan.textContent = formatHumanReadable(totalSeconds);
  minutesSpan.textContent = formatHumanReadable(totalMinutes);
  hoursSpan.textContent = formatHumanReadable(totalHours);
  daysSpan.textContent = formatHumanReadable(totalDays);
  weeksSpan.textContent = formatHumanReadable(totalWeeks);
  monthsSpan.textContent = formatHumanReadable(totalMonths);
  yearsSpan.textContent = formatHumanReadable(totalYears);
}
