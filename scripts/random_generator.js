document.addEventListener('DOMContentLoaded', function() {
  const coinEl = document.getElementById('coin-result');
  const diceEl = document.getElementById('dice-result');
  const cardEl = document.getElementById('card-result');
  const button = document.getElementById('generate');

  const suits = [
    { symbol: '♠', color: '#f9fafb' },
    { symbol: '♥', color: '#f87171' },
    { symbol: '♦', color: '#f87171' },
    { symbol: '♣', color: '#f9fafb' }
  ];
  const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const diceFaces = ['⚀','⚁','⚂','⚃','⚄','⚅'];

  function generate() {
    const coin = Math.random() < 0.5 ? 'Heads' : 'Tails';
    coinEl.textContent = coin;

    const diceRoll = Math.floor(Math.random() * 6);
    diceEl.textContent = diceFaces[diceRoll] + ' (' + (diceRoll + 1) + ')';

    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    cardEl.textContent = value + suit.symbol;
    cardEl.style.color = suit.color;
  }

  button.addEventListener('click', generate);
  generate();
});
