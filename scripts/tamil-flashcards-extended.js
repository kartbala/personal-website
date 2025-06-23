const { useState, useEffect } = React;

const vowels = new Set(['அ','ஆ','இ','ஈ','உ','ஊ','எ','ஏ','ஐ','ஒ','ஓ','ஔ','ஃ']);
const hindiExtras = new Set(['ஜ','ஶ','ஷ','ஸ','ஹ','க்ஷ','ஸ்ரீ']);

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getGroup = (letter) => {
  if (hindiExtras.has(letter)) return 'hindi';
  if (vowels.has(letter)) return 'uyir';
  if (letter.endsWith('\u0BCD')) return 'mei';
  return 'uyirmei';
};

const speak = (text) => {
  if (!window.speechSynthesis) return;
  const ut = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(ut);
};

function FlashcardsApp() {
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [useSecond, setUseSecond] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('tamil_letters_extended.json')
      .then((res) => res.json())
      .then((data) => {
        const withGroup = data.map((c) => ({ ...c, group: getGroup(c.letter) }));
        setAllCards(withGroup);
        setCards(shuffle(withGroup));
      });
  }, []);

  useEffect(() => {
    if (!allCards.length) return;
    let filtered = allCards;
    if (filter !== 'all') {
      filtered = allCards.filter((c) => c.group === filter);
    }
    setCards(shuffle(filtered));
    setIndex(0);
    setShowAnswer(false);
    setUseSecond(false);
  }, [filter, allCards]);

  const current = cards[index];

  const nextCard = () => {
    setIndex((i) => (i + 1) % cards.length);
    setShowAnswer(false);
    setUseSecond(false);
  };

  const recordAnswer = (isCorrect) => {
    if (isCorrect) setCorrect((c) => c + 1);
    setTotal((t) => t + 1);
    nextCard();
  };

  const progress = total ? (correct / total) * 100 : 0;

  if (!current) {
    return React.createElement('div', { className: 'text-center' }, 'Loading...');
  }

  const word = useSecond ? current.word2 : current.word1;
  const english = useSecond ? current.english2 : current.english1;

  return (
    React.createElement('div', { className: 'flex flex-col items-center p-4', style: { fontSize: '3rem' } },
      React.createElement('div', { className: 'mb-4' },
        React.createElement('select', {
          value: filter,
          onChange: (e) => setFilter(e.target.value),
          className: 'text-black p-1 text-xl'
        },
          React.createElement('option', { value: 'all' }, 'All'),
          React.createElement('option', { value: 'uyir' }, 'Uyir'),
          React.createElement('option', { value: 'mei' }, 'Mei'),
          React.createElement('option', { value: 'uyirmei' }, 'Uyirmei'),
          React.createElement('option', { value: 'hindi' }, 'Hindi extras')
        )
      ),
      React.createElement('div', {
        className: 'bg-gray-800 rounded-xl p-6 text-center cursor-pointer',
        onClick: () => setShowAnswer((b) => !b)
      },
        !showAnswer ? (
          React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'text-9xl' }, current.letter),
            React.createElement('div', { className: 'text-2xl text-yellow-300' }, current.roman)
          )
        ) : (
          React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'text-9xl' }, current.letter),
            React.createElement('div', { className: 'text-2xl mt-2' }, word),
            english && english !== '—' && React.createElement('div', { className: 'text-xl text-green-300' }, english),
            React.createElement('div', { className: 'mt-2 flex justify-center gap-3 text-2xl' },
              React.createElement('button', {
                onClick: (e) => { e.stopPropagation(); speak(current.tts); },
                className: 'px-2 bg-blue-500 rounded'
              }, '🔊'),
              current.word2 && current.word2 !== '—' && React.createElement('button', {
                onClick: (e) => { e.stopPropagation(); setUseSecond((b) => !b); },
                className: 'underline text-sm'
              }, 'See another example')
            )
          )
        )
      ),
      React.createElement('div', { className: 'flex gap-4 mt-4 text-4xl' },
        React.createElement('button', { onClick: () => recordAnswer(true) }, '✅'),
        React.createElement('button', { onClick: () => recordAnswer(false) }, '❌')
      ),
      React.createElement('div', { className: 'mt-4 w-full max-w-md' },
        React.createElement('div', { className: 'h-4 bg-gray-600 w-full' },
          React.createElement('div', { style: { width: progress + '%' }, className: 'h-full bg-green-500' })
        ),
        React.createElement('div', { className: 'text-xl mt-1 text-center' }, `${correct} / ${total}`)
      )
    )
  );
}

ReactDOM.render(React.createElement(FlashcardsApp), document.getElementById('tamil-app'));
