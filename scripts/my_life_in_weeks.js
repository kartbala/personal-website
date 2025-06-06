document.addEventListener('DOMContentLoaded', () => {
  const birthInput = document.getElementById('birthdate');
  const grid = document.getElementById('weeksGrid');
  const btn = document.getElementById('generateBtn');

  function weekDate(start, weekIndex) {
    return new Date(start.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000);
  }

  function generate() {
    const birthDate = new Date(birthInput.value);
    if (!birthDate.getTime()) {
      grid.innerHTML = '';
      return;
    }
    localStorage.setItem('weeksDOB', birthInput.value);
    const totalWeeks = 80 * 52;
    const now = new Date();
    const diffMs = now - birthDate;
    const weeksElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    grid.innerHTML = '';
    for (let i = 0; i < totalWeeks; i++) {
      const cell = document.createElement('div');
      cell.className = 'week';
      cell.title = weekDate(birthDate, i).toDateString();
      if (i < weeksElapsed) {
        cell.classList.add('past');
      } else if (i === weeksElapsed) {
        cell.classList.add('current');
      }
      grid.appendChild(cell);
    }
  }

  btn.addEventListener('click', generate);
  birthInput.addEventListener('change', generate);

  const stored = localStorage.getItem('weeksDOB');
  if (stored) {
    birthInput.value = stored;
    generate();
  }
});
