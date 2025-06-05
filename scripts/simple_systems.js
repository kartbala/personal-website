// Elementary Cellular Automaton Renderer

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('caCanvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const ruleInput = document.getElementById('ruleInput');
  const ruleDesc = document.getElementById('ruleDescription');

  const cellSize = 4;
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);

  function applyRule(rule, left, center, right) {
    const index = (left << 2) | (center << 1) | right;
    return (rule >> index) & 1;
  }

  function describeRule(rule) {
    const patterns = ['111', '110', '101', '100', '011', '010', '001', '000'];
    const values = patterns.map((p, i) => (rule >> (7 - i)) & 1);
    let html = '<table><tr>';
    patterns.forEach(p => { html += `<th>${p}</th>`; });
    html += '</tr><tr>';
    values.forEach(v => { html += `<td>${v}</td>`; });
    html += '</tr></table>';
    ruleDesc.innerHTML = html;
  }

  function run(rule) {
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ruleDesc.innerHTML = '';
    describeRule(rule);
    let current = new Array(cols).fill(0);
    current[Math.floor(cols / 2)] = 1; // start with a single active cell
    let y = 0;

    function step() {
      if (y >= rows) return;
      for (let x = 0; x < cols; x++) {
        if (current[x]) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
      const next = new Array(cols).fill(0);
      for (let x = 0; x < cols; x++) {
        const left = current[(x - 1 + cols) % cols];
        const center = current[x];
        const right = current[(x + 1) % cols];
        next[x] = applyRule(rule, left, center, right);
      }
      current = next;
      y++;
      setTimeout(step, 100);
    }
    step();
  }

  startBtn.addEventListener('click', function() {
    const rule = parseInt(ruleInput.value, 10);
    if (isNaN(rule) || rule < 0 || rule > 255) {
      alert('Please enter a rule number between 0 and 255.');
      return;
    }
    run(rule);
  });
});
