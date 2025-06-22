document.addEventListener('DOMContentLoaded', function() {
  // Colors progress from dark red (most wealth) to light yellow (least wealth)
  const data = [
    { label: 'Top 0.1%', value: 20, color: '#8b0000' },
    { label: 'Next 0.9%', value: 12, color: '#d7301f' },
    { label: 'Next 9%',   value: 40, color: '#fc8d59' },
    { label: 'Bottom 90%', value: 28, color: '#fee08b' }
  ];

  const chart = document.getElementById('chart');
  data.forEach(d => {
    const container = document.createElement('div');
    container.className = 'bar-container';

    const bar = document.createElement('div');
    bar.className = 'bar';

    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.dataset.value = d.value;
    fill.style.backgroundColor = d.color;
    bar.appendChild(fill);

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
    targets: '.bar-fill',
    scaleY: el => el.dataset.value / 100,
    easing: 'easeOutElastic(1, .8)',
    duration: 2000,
    delay: anime.stagger(300),
    complete: function() {
      document.querySelectorAll('.bar-fill').forEach(fill => {
        const v = Math.round(parseFloat(fill.dataset.value));
        const span = fill.parentNode.querySelector('.value');
        if (span) span.textContent = v + '%';
      });
    }
  });
});
