(async function() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    document.getElementById('btc-price').textContent = 'BTC: $' + data.bitcoin.usd.toLocaleString();
    document.getElementById('eth-price').textContent = 'ETH: $' + data.ethereum.usd.toLocaleString();
  } catch (err) {
    document.getElementById('btc-price').textContent = 'Failed to load prices';
    document.getElementById('eth-price').textContent = '';
    console.error(err);
  }
})();
