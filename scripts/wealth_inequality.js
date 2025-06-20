document.addEventListener('DOMContentLoaded', function() {
  const data = [
    { label: 'Top 0.1%', value: 20 },
    { label: 'Next 0.9%', value: 12 },
    { label: 'Next 9%', value: 40 },
    { label: 'Bottom 90%', value: 28 }
  ];

  const chart = document.getElementById('chart');
  data.forEach(d => {
    const container = document.createElement('div');
    container.className = 'bar-container';

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.dataset.value = d.value;

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
    height: el => el.dataset.value + '%',
    easing: 'easeOutExpo',
    duration: 2000,
    delay: anime.stagger(300),
    update: function() {
      document.querySelectorAll('.bar').forEach(bar => {
        const v = Math.round(parseFloat(bar.style.height));
        const span = bar.querySelector('.value');
        if (span) span.textContent = v + '%';
      });
    }
  });
});
