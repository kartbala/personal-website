document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('calculateLifeBtn');
  const canvas = document.getElementById('lifeCircle');
  const ctx = canvas.getContext('2d');

  function drawCircle(remaining, total) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const startAngle = -0.5 * Math.PI;

    // background circle
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    const fraction = total > 0 ? remaining / total : 0;
    ctx.strokeStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + 2 * Math.PI * fraction);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = `${remaining.toFixed(1)} yrs left`;
    ctx.fillText(text, centerX, centerY);
  }

  function handle() {
    const birth = document.getElementById('birthdate').value;
    const expectancy = parseFloat(document.getElementById('expectancy').value);
    if (!birth || isNaN(expectancy) || expectancy <= 0) {
      alert('Please enter a valid birthdate and expected lifespan.');
      return;
    }
    const stats = computeLifeStats(birth, expectancy);
    if (!stats) return;
    drawCircle(stats.yearsRemaining, expectancy);
  }

  if (btn && canvas) {
    btn.addEventListener('click', handle);
  }
});
