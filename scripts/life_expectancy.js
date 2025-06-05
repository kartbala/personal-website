// Calculate remaining life based on birthdate and estimated lifespan

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('calculateLifeBtn');
  if (btn) {
    btn.addEventListener('click', calculateLife);
  } else {
    console.error("Button with ID 'calculateLifeBtn' not found.");
  }
});

function formatHumanReadable(number) {
  if (!isFinite(number)) return '0';
  if (number < 1000) {
    return Number.isInteger(number) ? number.toString() : number.toFixed(1);
  }
  const suffixes = ['', 'K', 'M', 'B'];
  const i = Math.floor(Math.log10(Math.abs(number)) / 3);
  if (i >= suffixes.length) {
    return number.toExponential(1);
  }
  const scaled = number / Math.pow(1000, i);
  const formatted = (scaled % 1 === 0) ? scaled.toFixed(0) : scaled.toFixed(1);
  return formatted + suffixes[i];
}

// Rough life expectancy estimates by decade in the U.S.
const lifeExpectancyData = {
  male: {
    1900: 46.3, 1910: 48.4, 1920: 53.6, 1930: 58.1,
    1940: 60.8, 1950: 65.6, 1960: 66.6, 1970: 67.1,
    1980: 70.0, 1990: 72.7, 2000: 74.3, 2010: 76.2,
    2020: 77.3
  },
  female: {
    1900: 48.3, 1910: 51.5, 1920: 54.6, 1930: 61.1,
    1940: 65.2, 1950: 71.1, 1960: 73.1, 1970: 74.7,
    1980: 77.5, 1990: 79.4, 2000: 79.9, 2010: 81.0,
    2020: 82.1
  }
};

function estimateLifeExpectancy(year, gender) {
  const table = lifeExpectancyData[gender.toLowerCase()] || lifeExpectancyData.male;
  const years = Object.keys(table).map(Number).sort((a, b) => a - b);
  let closest = years[0];
  for (const y of years) {
    if (year >= y) closest = y; else break;
  }
  return table[closest];
}

function computeLifeStats(birthdateValue, expectancyValue) {
  const birthDate = new Date(birthdateValue);
  const currentDate = new Date();

  if (!birthdateValue || isNaN(expectancyValue) || expectancyValue <= 0) {
    return null;
  }
  if (isNaN(birthDate.getTime()) || birthDate > currentDate) {
    return null;
  }

  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const deathDate = new Date(birthDate.getTime() + expectancyValue * msPerYear);

  let diffMilliseconds = deathDate.getTime() - currentDate.getTime();
  if (diffMilliseconds < 0) diffMilliseconds = 0;

  const totalSeconds = diffMilliseconds / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;
  const totalWeeks = totalDays / 7;
  const totalMonths = totalDays / 30.4375;
  const totalYears = totalMonths / 12;

  return {
    secondsRemaining: totalSeconds,
    minutesRemaining: totalMinutes,
    hoursRemaining: totalHours,
    daysRemaining: totalDays,
    weeksRemaining: totalWeeks,
    monthsRemaining: totalMonths,
    yearsRemaining: totalYears
  };
}

function calculateLife() {
  const birthdateValue = document.getElementById('birthdate').value;
  const genderValue = (document.getElementById('gender') || { value: 'male' }).value;
  const birthYear = new Date(birthdateValue).getFullYear();
  const expectancyValue = estimateLifeExpectancy(birthYear, genderValue);

  const expectancyDisplay = document.getElementById('estimatedExpectancy');
  if (expectancyDisplay && !isNaN(expectancyValue)) {
    expectancyDisplay.textContent = expectancyValue.toFixed(1);
  }

  // Output spans
  const secSpan = document.getElementById('lifeSeconds');
  const minSpan = document.getElementById('lifeMinutes');
  const hourSpan = document.getElementById('lifeHours');
  const daySpan = document.getElementById('lifeDays');
  const weekSpan = document.getElementById('lifeWeeks');
  const monthSpan = document.getElementById('lifeMonths');
  const yearSpan = document.getElementById('lifeYears');

  secSpan.textContent = '';
  minSpan.textContent = '';
  hourSpan.textContent = '';
  daySpan.textContent = '';
  weekSpan.textContent = '';
  monthSpan.textContent = '';
  yearSpan.textContent = '';

  const stats = computeLifeStats(birthdateValue, expectancyValue);
  if (!stats) {
    alert('Please enter a valid birthdate and gender.');
    return;
  }

  secSpan.textContent = formatHumanReadable(stats.secondsRemaining);
  minSpan.textContent = formatHumanReadable(stats.minutesRemaining);
  hourSpan.textContent = formatHumanReadable(stats.hoursRemaining);
  daySpan.textContent = formatHumanReadable(stats.daysRemaining);
  weekSpan.textContent = formatHumanReadable(stats.weeksRemaining);
  monthSpan.textContent = formatHumanReadable(stats.monthsRemaining);
  yearSpan.textContent = formatHumanReadable(stats.yearsRemaining);
}
