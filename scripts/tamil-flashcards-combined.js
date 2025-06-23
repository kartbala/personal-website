const { useState, useEffect } = React;

const vowels = new Set(['அ','ஆ','இ','ஈ','உ','ஊ','எ','ஏ','ஐ','ஒ','ஓ','ஔ','ஃ']);
const hindiExtras = new Set(['ஜ','ஶ','ஷ','ஸ','ஹ','க்ஷ','ஸ்ரீ']);

const getGroup = (letter) => {
  if (hindiExtras.has(letter)) return 'hindi';
  if (vowels.has(letter)) return 'uyir';
  if (letter.endsWith('\u0BCD')) return 'mei';
  return 'uyirmei';
};

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function TamilFlashcards() {
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showTranslit, setShowTranslit] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [useSecond, setUseSecond] = useState(false);
  const [filter, setFilter] = useState('all');
  const [voice, setVoice] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('tamil_letters_extended.json')
      .then(res => res.json())
      .then(data => {
        const withGroup = data.map(c => ({...c, group: getGroup(c.letter)}));
        setAllCards(withGroup);
        setCards(shuffleArray(withGroup));
      });
  }, []);

  useEffect(() => {
    const populateVoiceList = () => {
      if (!window.speechSynthesis) return;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      const taVoice = voices.find(v => v.lang && v.lang.startsWith('ta'));
      const enVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
      setVoice(taVoice || enVoice || voices[0] || null);
    };
    populateVoiceList();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') {
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        prevCard();
      } else if (e.key === '?') {
        setShowTranslit(b => !b);
      } else if (e.key.toLowerCase() === 'i') {
        setShowWord(b => !b);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cards]);

  useEffect(() => {
    if (!allCards.length) return;
    let filtered = allCards;
    if (filter !== 'all') filtered = allCards.filter(c => c.group === filter);
    setCards(shuffleArray(filtered));
    setIndex(0);
    setShowTranslit(false);
    setShowWord(false);
    setUseSecond(false);
  }, [filter, allCards]);

  const current = cards[index];

  const speak = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const ut = new SpeechSynthesisUtterance(text);
    if (voice) {
      ut.voice = voice;
      ut.lang = voice.lang || 'ta-IN';
    }
    window.speechSynthesis.speak(ut);
  };

  const speakLetter = () => current && speak(current.letter);
  const speakWord = () => current && speak(useSecond ? current.word2 : current.word1);

  const prevCard = () => {
    setIndex(i => (i - 1 + cards.length) % cards.length);
    setShowTranslit(false);
    setShowWord(false);
    setUseSecond(false);
  };

  const nextCard = () => {
    setIndex(i => (i + 1) % cards.length);
    setShowTranslit(false);
    setShowWord(false);
    setUseSecond(false);
  };

  const shuffleCards = () => {
    setCards(shuffleArray(cards));
    setIndex(0);
    setShowTranslit(false);
    setShowWord(false);
    setUseSecond(false);
  };

  const recordAnswer = (isCorrect) => {
    if (isCorrect) setCorrect(c => c + 1);
    setTotal(t => t + 1);
    nextCard();
  };

  const progress = total ? (correct / total) * 100 : 0;

  if (!current) {
    return React.createElement('div', { className: 'text-center p-4' }, 'Loading...');
  }

  const word = useSecond ? current.word2 : current.word1;
  const english = useSecond ? current.english2 : current.english1;

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen">
      <div className="mb-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-black p-1 text-xl">
          <option value="all">All</option>
          <option value="uyir">Uyir</option>
          <option value="mei">Mei</option>
          <option value="uyirmei">Uyirmei</option>
          <option value="hindi">Hindi extras</option>
        </select>
      </div>
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md flex items-center justify-center mb-4 cursor-pointer select-none border border-gray-600"
        onClick={() => setShowWord(b => !b)}
      >
        <div className="text-center">
          <div className="text-8xl font-bold mb-2">{current.letter}</div>
          {showTranslit && <div className="text-2xl text-yellow-300">{current.roman}</div>}
          {showWord && (
            <React.Fragment>
              <div className="text-xl text-green-300 mt-1">{word}</div>
              {english && english !== '—' && <div className="text-sm text-blue-300">{english}</div>}
              {current.word2 && current.word2 !== '—' && (
                <button className="underline text-sm" onClick={(e) => { e.stopPropagation(); setUseSecond(b => !b); }}>
                  See another example
                </button>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      <div className="flex gap-4 scale-75">
        <button className="bg-gray-600 hover:bg-gray-500 text-white text-xl py-2 px-4 rounded-lg border border-gray-400" onClick={prevCard}>←</button>
        <button className="bg-gray-600 hover:bg-gray-500 text-white text-xl py-2 px-4 rounded-lg border border-gray-400" onClick={nextCard}>→</button>
        <button className="bg-yellow-600 hover:bg-yellow-500 text-black text-xl py-2 px-4 rounded-lg border border-yellow-400" onClick={shuffleCards}>↻</button>
        <button className="bg-green-600 hover:bg-green-500 text-white text-xl py-2 px-4 rounded-lg border border-green-400" onClick={speakLetter}>🔊</button>
      </div>
      <div className="flex gap-4 mt-4 text-4xl">
        <button onClick={() => recordAnswer(true)}>✅</button>
        <button onClick={() => recordAnswer(false)}>❌</button>
      </div>
      <div className="mt-4 w-full max-w-md">
        <div className="h-4 bg-gray-600 w-full">
          <div style={{ width: progress + '%' }} className="h-full bg-green-500"></div>
        </div>
        <div className="text-xl mt-1 text-center">
          {correct} / {total}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-400">
        {index + 1} / {cards.length}
      </div>
    </div>
  );
}

ReactDOM.render(<TamilFlashcards />, document.getElementById('tamil-app'));
