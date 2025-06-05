// Calculate remaining life based on birthdate and estimated lifespan

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

  const ageMilliseconds = currentDate.getTime() - birthDate.getTime();
  const expectancyMilliseconds = expectancyValue * msPerYear;

  let diffMilliseconds = deathDate.getTime() - currentDate.getTime();
  if (diffMilliseconds < 0) diffMilliseconds = 0;

  const totalSeconds = diffMilliseconds / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;
  const totalWeeks = totalDays / 7;
  const totalMonths = totalDays / 30.4375;
  const totalYears = totalMonths / 12;

  const ageSeconds = ageMilliseconds / 1000;
  const ageMinutes = ageSeconds / 60;
  const ageHours = ageMinutes / 60;
  const ageDays = ageHours / 24;
  const ageWeeks = ageDays / 7;
  const ageMonths = ageDays / 30.4375;
  const ageYears = ageMonths / 12;

  const expSeconds = expectancyMilliseconds / 1000;
  const expMinutes = expSeconds / 60;
  const expHours = expMinutes / 60;
  const expDays = expHours / 24;
  const expWeeks = expDays / 7;
  const expMonths = expDays / 30.4375;
  const expYears = expectancyValue;

  return {
    secondsRemaining: totalSeconds,
    minutesRemaining: totalMinutes,
    hoursRemaining: totalHours,
    daysRemaining: totalDays,
    weeksRemaining: totalWeeks,
    monthsRemaining: totalMonths,
    yearsRemaining: totalYears,
    ageSeconds: ageSeconds,
    ageMinutes: ageMinutes,
    ageHours: ageHours,
    ageDays: ageDays,
    ageWeeks: ageWeeks,
    ageMonths: ageMonths,
    ageYears: ageYears,
    expectancySeconds: expSeconds,
    expectancyMinutes: expMinutes,
    expectancyHours: expHours,
    expectancyDays: expDays,
    expectancyWeeks: expWeeks,
    expectancyMonths: expMonths,
    expectancyYears: expYears
  };
}

function calculateLife() {
  const birthdateValue = document.getElementById('birthdate').value;
  const activeBtn = document.querySelector('.gender-btn.active');
  const genderValue = activeBtn ? activeBtn.dataset.gender : (document.getElementById('gender') || { value: 'male' }).value;
  const birthYear = new Date(birthdateValue).getFullYear();
  const expectancyValue = estimateLifeExpectancy(birthYear, genderValue);

  const expectancyDisplay = document.getElementById('estimatedExpectancy');
  if (expectancyDisplay && !isNaN(expectancyValue)) {
    expectancyDisplay.textContent = expectancyValue.toFixed(1);
  }

  // Output spans for remaining time
  const secSpan = document.getElementById('lifeSeconds');
  const minSpan = document.getElementById('lifeMinutes');
  const hourSpan = document.getElementById('lifeHours');
  const daySpan = document.getElementById('lifeDays');
  const weekSpan = document.getElementById('lifeWeeks');
  const monthSpan = document.getElementById('lifeMonths');
  const yearSpan = document.getElementById('lifeYears');

  // Output spans for age
  const ageSec = document.getElementById('ageSeconds');
  const ageMin = document.getElementById('ageMinutes');
  const ageHour = document.getElementById('ageHours');
  const ageDay = document.getElementById('ageDays');
  const ageWeek = document.getElementById('ageWeeks');
  const ageMonth = document.getElementById('ageMonths');
  const ageYear = document.getElementById('ageYears');

  // Output spans for total expectancy
  const expSec = document.getElementById('expectancySeconds');
  const expMin = document.getElementById('expectancyMinutes');
  const expHour = document.getElementById('expectancyHours');
  const expDay = document.getElementById('expectancyDays');
  const expWeek = document.getElementById('expectancyWeeks');
  const expMonth = document.getElementById('expectancyMonths');
  const expYear = document.getElementById('expectancyYears');

  [secSpan, minSpan, hourSpan, daySpan, weekSpan, monthSpan, yearSpan,
   ageSec, ageMin, ageHour, ageDay, ageWeek, ageMonth, ageYear,
   expSec, expMin, expHour, expDay, expWeek, expMonth, expYear]
    .forEach(span => { if (span) span.textContent = ''; });

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

  if (ageSec) ageSec.textContent = formatHumanReadable(stats.ageSeconds);
  if (ageMin) ageMin.textContent = formatHumanReadable(stats.ageMinutes);
  if (ageHour) ageHour.textContent = formatHumanReadable(stats.ageHours);
  if (ageDay) ageDay.textContent = formatHumanReadable(stats.ageDays);
  if (ageWeek) ageWeek.textContent = formatHumanReadable(stats.ageWeeks);
  if (ageMonth) ageMonth.textContent = formatHumanReadable(stats.ageMonths);
  if (ageYear) ageYear.textContent = formatHumanReadable(stats.ageYears);

  if (expSec) expSec.textContent = formatHumanReadable(stats.expectancySeconds);
  if (expMin) expMin.textContent = formatHumanReadable(stats.expectancyMinutes);
  if (expHour) expHour.textContent = formatHumanReadable(stats.expectancyHours);
  if (expDay) expDay.textContent = formatHumanReadable(stats.expectancyDays);
  if (expWeek) expWeek.textContent = formatHumanReadable(stats.expectancyWeeks);
  if (expMonth) expMonth.textContent = formatHumanReadable(stats.expectancyMonths);
  if (expYear) expYear.textContent = formatHumanReadable(stats.expectancyYears);
}
