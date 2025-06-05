// Calculate remaining life based on birthdate and expected lifespan

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

function calculateLife() {
  const birthdateValue = document.getElementById('birthdate').value;
  const expectancyValue = parseFloat(document.getElementById('expectancy').value);

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

  if (!birthdateValue || isNaN(expectancyValue) || expectancyValue <= 0) {
    alert('Please enter a valid birthdate and expected lifespan.');
    return;
  }

  const birthDate = new Date(birthdateValue);
  const currentDate = new Date();

  if (isNaN(birthDate.getTime())) {
    alert('Invalid birthdate format.');
    return;
  }
  if (birthDate > currentDate) {
    alert('Birthdate cannot be in the future.');
    return;
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

  secSpan.textContent = formatHumanReadable(totalSeconds);
  minSpan.textContent = formatHumanReadable(totalMinutes);
  hourSpan.textContent = formatHumanReadable(totalHours);
  daySpan.textContent = formatHumanReadable(totalDays);
  weekSpan.textContent = formatHumanReadable(totalWeeks);
  monthSpan.textContent = formatHumanReadable(totalMonths);
  yearSpan.textContent = formatHumanReadable(totalYears);
}
