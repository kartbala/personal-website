document.addEventListener('DOMContentLoaded', function() {
  const die1 = document.getElementById('die1');
  const die2 = document.getElementById('die2');
  const die3 = document.getElementById('die3');
  const useThird = document.getElementById('third-die');
  const sumEl = document.getElementById('sum');
  const button = document.getElementById('roll');
  const faces = ['\u2680','\u2681','\u2682','\u2683','\u2684','\u2685'];

  function roll() {
    const d1 = Math.floor(Math.random() * 6);
    const d2 = Math.floor(Math.random() * 6);
    const d3 = Math.floor(Math.random() * 6);
    die1.textContent = faces[d1];
    die2.textContent = faces[d2];
    if (useThird.checked) {
      die3.textContent = faces[d3];
      die3.style.display = 'flex';
    } else {
      die3.style.display = 'none';
    }
    let sum = d1 + d2 + 2;
    if (useThird.checked) sum += d3 + 1;
    sumEl.textContent = sum;
    if (useThird.checked) {
      if (d1 === d2 && d2 === d3) {
        die1.style.color = 'red';
        die2.style.color = 'red';
        die3.style.color = 'red';
      } else {
        die1.style.color = '#f9fafb';
        die2.style.color = '#f9fafb';
        die3.style.color = '#f9fafb';
      }
    } else {
      if (d1 === d2) {
        die1.style.color = 'red';
        die2.style.color = 'red';
      } else {
        die1.style.color = '#f9fafb';
        die2.style.color = '#f9fafb';
      }
    }
  }

  button.addEventListener('click', roll);
  useThird.addEventListener('change', roll);
  roll();
});
