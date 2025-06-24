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
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [useSecond, setUseSecond] = useState(false);

  useEffect(() => {
    fetch('tamil_letters_extended.json')
      .then((res) => res.json())
      .then((data) => {
        const all = data.map((c) => ({ ...c, group: getGroup(c.letter) }));
        setCards(shuffle(all));
      });
  }, []);

  const current = cards[index];

  const nextCard = () => {
    setIndex((i) => (i + 1) % cards.length);
    setShowAnswer(false);
    setUseSecond(false);
  };

  useEffect(() => {
    const handleKey = (e) => {
      const k = e.key;
      if (k === 'ArrowRight') {
        nextCard();
      } else if (k === 'ArrowLeft') {
        prevCard();
      } else if (k === '?') {
        setShowAnswer((b) => !b);
      } else if (k.toLowerCase() === 'a') {
        setShowAnswer(true);
      } else if (k.toLowerCase() === 's') {
        setUseSecond((b) => !b);
      } else if (k.toLowerCase() === 'p') {
        const w = useSecond ? current.word2 : current.word1;
        if (showAnswer) {
          speak(w);
        } else {
          speak(current.tts);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, showAnswer, useSecond]);

  const prevCard = () => {
    setIndex((i) => (i - 1 + cards.length) % cards.length);
    setShowAnswer(false);
    setUseSecond(false);
  };



  if (!current) {
    return React.createElement('div', { className: 'text-center' }, 'Loading...');
  }

  const word = useSecond ? current.word2 : current.word1;
  const english = useSecond ? current.english2 : current.english1;

  return (
    React.createElement('div', { className: 'flex flex-col items-center p-4', style: { fontSize: '3rem' } },
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
      
    )
  );
}

ReactDOM.render(React.createElement(FlashcardsApp), document.getElementById('tamil-app'));
