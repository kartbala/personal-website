document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.dice-container');
  const sumEl = document.getElementById('sum');
  const button = document.getElementById('roll');
  const diceCount = document.getElementById('dice-count');
  const faces = ['\u2680','\u2681','\u2682','\u2683','\u2684','\u2685'];
  const dice = [];
  for (let i = 1; i <= 6; i++) {
    dice.push(document.getElementById('die' + i));
  }

  function roll() {
    const count = parseInt(diceCount.value, 10);
    container.dataset.count = count;
    let sum = 0;
    const values = [];
    for (let i = 0; i < dice.length; i++) {
      if (i < count) {
        const v = Math.floor(Math.random() * 6);
        dice[i].textContent = faces[v];
        dice[i].style.display = 'flex';
        sum += v + 1;
        values.push(v);
      } else {
        dice[i].style.display = 'none';
      }
    }
    sumEl.textContent = sum;
    const allSame = values.every(v => v === values[0]);
    for (let i = 0; i < count; i++) {
      dice[i].style.color = allSame ? 'red' : '#f9fafb';
    }
  }

  button.addEventListener('click', roll);
  diceCount.addEventListener('change', roll);
  roll();
});
