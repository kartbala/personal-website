(async function() {
  const btcEl = document.getElementById('btc-price');
  const ethEl = document.getElementById('eth-price');
  const goldEl = document.getElementById('gold-price');
  const silverEl = document.getElementById('silver-price');

  try {
    const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    if (!cryptoResponse.ok) throw new Error('Crypto price request failed');
    const cryptoData = await cryptoResponse.json();
    btcEl.textContent = 'BTC: $' + cryptoData.bitcoin.usd.toLocaleString();
    ethEl.textContent = 'ETH: $' + cryptoData.ethereum.usd.toLocaleString();
  } catch (err) {
    console.error(err);
    btcEl.textContent = 'BTC: $30,000 (offline data)';
    ethEl.textContent = 'ETH: $2,000 (offline data)';
  }

  if (goldEl) goldEl.textContent = 'Gold (per oz): retrieving…';
  if (silverEl) silverEl.textContent = 'Silver (per oz): retrieving…';

  try {
    if (!goldEl || !silverEl) return;
    const commoditiesResponse = await fetch('https://api.coingecko.com/api/v3/commodities');
    if (!commoditiesResponse.ok) throw new Error('Commodities price request failed');
    const commoditiesData = await commoditiesResponse.json();

    const goldEntry = Array.isArray(commoditiesData)
      ? commoditiesData.find(item => item && item.name && item.name.toLowerCase() === 'gold')
      : null;
    const silverEntry = Array.isArray(commoditiesData)
      ? commoditiesData.find(item => item && item.name && item.name.toLowerCase() === 'silver')
      : null;

    if (goldEntry && goldEntry.last) {
      goldEl.textContent = 'Gold (per oz): $' + Number(goldEntry.last).toLocaleString();
    } else {
      goldEl.textContent = 'Gold (per oz): data unavailable';
    }

    if (silverEntry && silverEntry.last) {
      silverEl.textContent = 'Silver (per oz): $' + Number(silverEntry.last).toLocaleString();
    } else {
      silverEl.textContent = 'Silver (per oz): data unavailable';
    }
  } catch (err) {
    console.error(err);
    if (goldEl) goldEl.textContent = 'Gold (per oz): $1,900 (offline data)';
    if (silverEl) silverEl.textContent = 'Silver (per oz): $24 (offline data)';
  }
})();
