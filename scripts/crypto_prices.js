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

  try {
    if (!goldEl || !silverEl) return;
    const metalsResponse = await fetch('https://api.metals.live/v1/spot');
    if (!metalsResponse.ok) throw new Error('Metals price request failed');
    const metalsData = await metalsResponse.json();

    const goldEntry = Array.isArray(metalsData) ? metalsData.find(item => Object.prototype.hasOwnProperty.call(item, 'gold')) : null;
    const silverEntry = Array.isArray(metalsData) ? metalsData.find(item => Object.prototype.hasOwnProperty.call(item, 'silver')) : null;

    if (goldEntry && goldEntry.gold) {
      goldEl.textContent = 'Gold (per oz): $' + Number(goldEntry.gold).toLocaleString();
    } else {
      goldEl.textContent = 'Gold (per oz): data unavailable';
    }

    if (silverEntry && silverEntry.silver) {
      silverEl.textContent = 'Silver (per oz): $' + Number(silverEntry.silver).toLocaleString();
    } else {
      silverEl.textContent = 'Silver (per oz): data unavailable';
    }
  } catch (err) {
    console.error(err);
    if (goldEl) goldEl.textContent = 'Gold (per oz): $1,900 (offline data)';
    if (silverEl) silverEl.textContent = 'Silver (per oz): $24 (offline data)';
  }
})();
