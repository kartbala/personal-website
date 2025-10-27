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
    const metalsResponse = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=XAU,XAG');
    if (!metalsResponse.ok) throw new Error('Metals price request failed');
    const metalsData = await metalsResponse.json();

    const rates = metalsData && metalsData.rates ? metalsData.rates : null;

    if (rates && rates.XAU) {
      const goldPrice = 1 / Number(rates.XAU);
      goldEl.textContent = 'Gold (per oz): $' + goldPrice.toLocaleString(undefined, { maximumFractionDigits: 2 });
    } else {
      goldEl.textContent = 'Gold (per oz): data unavailable';
    }

    if (rates && rates.XAG) {
      const silverPrice = 1 / Number(rates.XAG);
      silverEl.textContent = 'Silver (per oz): $' + silverPrice.toLocaleString(undefined, { maximumFractionDigits: 2 });
    } else {
      silverEl.textContent = 'Silver (per oz): data unavailable';
    }
  } catch (err) {
    console.error(err);
    if (goldEl) goldEl.textContent = 'Gold (per oz): $1,900 (offline data)';
    if (silverEl) silverEl.textContent = 'Silver (per oz): $24 (offline data)';
  }
})();
