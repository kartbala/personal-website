document.addEventListener('DOMContentLoaded', function() {
  const die1 = document.getElementById('die1');
  const die2 = document.getElementById('die2');
  const button = document.getElementById('roll');
  const faces = ['\u2680','\u2681','\u2682','\u2683','\u2684','\u2685'];

  function roll() {
    const d1 = Math.floor(Math.random() * 6);
    const d2 = Math.floor(Math.random() * 6);
    die1.textContent = faces[d1];
    die2.textContent = faces[d2];
  }

  button.addEventListener('click', roll);
  roll();
});
