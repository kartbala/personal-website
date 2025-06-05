// Elementary Cellular Automaton Renderer

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('caCanvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const ruleInput = document.getElementById('ruleInput');

  const cellSize = 4;
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);

  function applyRule(rule, left, center, right) {
    const index = (left << 2) | (center << 1) | right;
    return (rule >> index) & 1;
  }

  function run(rule) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let current = new Array(cols).fill(0);
    current[Math.floor(cols / 2)] = 1; // start with a single active cell

    for (let y = 0; y < rows; y++) {
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
    }
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
