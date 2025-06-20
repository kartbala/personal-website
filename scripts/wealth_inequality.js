document.addEventListener('DOMContentLoaded', function() {
  const data = [
    { label: 'Top 0.1%', value: 20, color: '#ff6384' },
    { label: 'Next 0.9%', value: 12, color: '#ff9f40' },
    { label: 'Next 9%', value: 40, color: '#36a2eb' },
    { label: 'Bottom 90%', value: 28, color: '#4bc0c0' }
  ];

  const chart = document.getElementById('chart');
  data.forEach(d => {
    const container = document.createElement('div');
    container.className = 'bar-container';

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.dataset.value = d.value;
    bar.style.backgroundColor = d.color;

    const val = document.createElement('div');
    val.className = 'value';
    val.textContent = '0%';
    bar.appendChild(val);
    container.appendChild(bar);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = d.label;
    container.appendChild(label);

    chart.appendChild(container);
  });

  anime({
    targets: '.bar',
    scaleY: el => el.dataset.value / 100,
    easing: 'easeOutElastic(1, .8)',
    duration: 2000,
    delay: anime.stagger(300),
    update: function() {
      document.querySelectorAll('.bar').forEach(bar => {
        const v = Math.round(parseFloat(bar.dataset.value));
        const span = bar.querySelector('.value');
        if (span) span.textContent = v + '%';
      });
    }
  });
});
