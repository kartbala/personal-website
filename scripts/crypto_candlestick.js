// Fetch OHLC data for BTC and ETH and render candlestick charts using Chart.js
// Requires chartjs-chart-financial plugin.

document.addEventListener('DOMContentLoaded', function() {
  const configs = [
    {id: 'bitcoin', label: 'BTC', canvas: 'btc-chart'},
    {id: 'ethereum', label: 'ETH', canvas: 'eth-chart'}
  ];

  configs.forEach(cfg => loadChart(cfg));
});

async function loadChart({id, label, canvas}) {
  try {
    const resp = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=30`);
    if (!resp.ok) throw new Error('Network response was not ok');
    const json = await resp.json();
    const data = json.map(d => ({x: d[0], o: d[1], h: d[2], l: d[3], c: d[4]}));
    const ctx = document.getElementById(canvas).getContext('2d');
    new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [{ label, data }]
      },
      options: {
        responsive: true,
        scales: {
          x: { type: 'time' }
        }
      }
    });
  } catch (err) {
    console.error(err);
    const container = document.getElementById(canvas).parentNode;
    container.textContent = 'Failed to load chart';
  }
}
