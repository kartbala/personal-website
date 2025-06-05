// Dynamic life expectancy chart using World Bank data

document.addEventListener('DOMContentLoaded', function () {
  const countries = {
    USA: 'United States',
    IND: 'India',
    CHN: 'China',
    BRA: 'Brazil',
    NGA: 'Nigeria'
  };

  const select = document.getElementById('countrySelect');
  for (const code in countries) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = countries[code];
    select.appendChild(opt);
  }

  const ctx = document.getElementById('lifeChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'Year' } },
        y: { title: { display: true, text: 'Life Expectancy (years)' } }
      }
    }
  });

  function loadData(code) {
    fetch(`https://api.worldbank.org/v2/country/${code}/indicator/SP.DYN.LE00.IN?format=json`)
      .then(res => res.json())
      .then(json => {
        const data = json[1];
        const years = [];
        const values = [];
        data.forEach(item => {
          if (item.value !== null) {
            years.push(item.date);
            values.push(item.value);
          }
        });
        years.reverse();
        values.reverse();
        chart.data.labels = years;
        chart.data.datasets = [{
          label: countries[code],
          data: values,
          borderColor: '#00FF00',
          fill: false,
          tension: 0.1
        }];
        chart.update();
      });
  }

  select.addEventListener('change', () => loadData(select.value));
  loadData(select.value || 'USA');
});
