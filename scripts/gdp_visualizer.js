document.addEventListener('DOMContentLoaded', () => {
  const aliasMap = {
    'usa': 'USA',
    'united states': 'USA',
    'united states of america': 'USA',
    'us': 'USA',
    'india': 'IND',
    'ind': 'IND',
    'china': 'CHN',
    'united kingdom': 'GBR',
    'uk': 'GBR',
    'japan': 'JPN',
    'canada': 'CAN',
    'germany': 'DEU',
    'france': 'FRA'
  };

  const input = document.getElementById('countryInput');
  const loadBtn = document.getElementById('loadButton');
  const infoToggle = document.getElementById('infoToggle');
  const infoPanel = document.getElementById('infoPanel');
  const nameEl = document.getElementById('countryName');
  const ctx = document.getElementById('gdpChart').getContext('2d');
  let chart;

  function canonical(name) {
    const key = name.toLowerCase().trim();
    return aliasMap[key] || null;
  }

  function formatTick(value) {
    if (value >= 1e12) return '$' + (value/1e12).toFixed(0) + 'T';
    if (value >= 1e9) return '$' + (value/1e9).toFixed(0) + 'B';
    if (value >= 1e6) return '$' + (value/1e6).toFixed(0) + 'M';
    if (value >= 1e3) return '$' + (value/1e3).toFixed(0) + 'K';
    return '$' + value;
  }

  async function loadData(query) {
    const code = canonical(query);
    if (!code) {
      alert('Country not recognized');
      return;
    }
    const res = await fetch(`https://api.worldbank.org/v2/country/${code}/indicator/NY.GDP.MKTP.CD?format=json`);
    const json = await res.json();
    const data = json[1];
    if (!data) {
      alert('No data found');
      return;
    }
    const years = [];
    const values = [];
    data.forEach(d => {
      if (d.value !== null) {
        years.push(d.date);
        values.push(d.value);
      }
    });
    years.reverse();
    values.reverse();
    nameEl.textContent = data[0].country.value;

    const barData = {
      type: 'bar',
      label: 'GDP',
      data: values,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderColor: 'rgba(255,255,255,0.5)',
      borderWidth: 1,
    };
    const lineData = {
      type: 'line',
      label: 'GDP',
      data: values,
      borderColor: '#ffffff',
      backgroundColor: 'transparent',
      borderWidth: 2,
      tension: 0.2,
    };

    if (chart) {
      chart.data.labels = years;
      chart.data.datasets = [barData, lineData];
      chart.update();
    } else {
      chart = new Chart(ctx, {
        data: {
          labels: years,
          datasets: [barData, lineData]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: { color: '#ffffff' },
              grid: { color: 'rgba(255,255,255,0.2)' }
            },
            y: {
              ticks: {
                color: '#ffffff',
                callback: formatTick
              },
              grid: { color: 'rgba(255,255,255,0.2)' }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }

  loadBtn.addEventListener('click', () => loadData(input.value));
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') loadData(input.value);
  });
  infoToggle.addEventListener('click', () => {
    infoPanel.style.display = infoPanel.style.display === 'block' ? 'none' : 'block';
  });

  loadData('United States');
});
