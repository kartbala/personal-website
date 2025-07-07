(async function() {
  const btcEl = document.getElementById('btc-price');
  const ethEl = document.getElementById('eth-price');
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    btcEl.textContent = 'BTC: $' + data.bitcoin.usd.toLocaleString();
    ethEl.textContent = 'ETH: $' + data.ethereum.usd.toLocaleString();
  } catch (err) {
    console.error(err);
    // fallback to fixed sample values if network fails
    btcEl.textContent = 'BTC: $30,000 (offline data)';
    ethEl.textContent = 'ETH: $2,000 (offline data)';
  }
})();
