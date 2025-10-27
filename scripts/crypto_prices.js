(async function() {
  const btcEl = document.getElementById('btc-price');
  const ethEl = document.getElementById('eth-price');
  const goldEl = document.getElementById('gold-price');
  const silverEl = document.getElementById('silver-price');

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,pax-gold,silver&vs_currencies=usd');
    if (!response.ok) throw new Error('Price request failed');
    const data = await response.json();

    if (data.bitcoin && data.bitcoin.usd) {
      btcEl.textContent = 'BTC: $' + Number(data.bitcoin.usd).toLocaleString();
    } else {
      btcEl.textContent = 'BTC: data unavailable';
    }

    if (data.ethereum && data.ethereum.usd) {
      ethEl.textContent = 'ETH: $' + Number(data.ethereum.usd).toLocaleString();
    } else {
      ethEl.textContent = 'ETH: data unavailable';
    }

    if (goldEl) {
      if (data['pax-gold'] && data['pax-gold'].usd) {
        goldEl.textContent = 'Gold (per oz): $' + Number(data['pax-gold'].usd).toLocaleString();
      } else {
        goldEl.textContent = 'Gold (per oz): data unavailable';
      }
    }

    if (silverEl) {
      if (data.silver && data.silver.usd) {
        silverEl.textContent = 'Silver (per oz): $' + Number(data.silver.usd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        silverEl.textContent = 'Silver (per oz): data unavailable';
      }
    }
  } catch (err) {
    console.error(err);
    btcEl.textContent = 'BTC: $30,000 (offline data)';
    ethEl.textContent = 'ETH: $2,000 (offline data)';
    if (goldEl) goldEl.textContent = 'Gold (per oz): $1,900 (offline data)';
    if (silverEl) silverEl.textContent = 'Silver (per oz): $24 (offline data)';
  }
})();
