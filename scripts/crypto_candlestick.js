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
    render(data);
  } catch (err) {
    console.error(err);
    // use synthetic data if fetch fails
    render(generateData());
  }

  function generateData(){
    const out = [];
    let base = Date.now() - 29*86400000;
    let price = 100;
    for(let i=0;i<30;i++){
      const open = price;
      const close = open + (Math.random()-0.5)*10;
      const high = Math.max(open, close) + Math.random()*5;
      const low = Math.min(open, close) - Math.random()*5;
      out.push({x: base + i*86400000, o: open, h: high, l: low, c: close});
      price = close;
    }
    return out;
  }

  function render(data){
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
  }
}
