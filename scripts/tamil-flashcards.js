const { useState, useEffect } = React;


// Fisher-Yates shuffle
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Build the full set of Tamil characters (247 standard letters)
const TAMIL_JSON_PATH = 'scripts/tamil_letters.json';

function speakTamil(glyph) {
  const u = new SpeechSynthesisUtterance(glyph);
  u.lang = 'ta-IN';
  const v = speechSynthesis.getVoices().find((x) => x.lang && x.lang.startsWith('ta'));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

function TamilFlashcards() {
  const [index, setIndex] = useState(0);
  const [showTranslit, setShowTranslit] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    fetch(TAMIL_JSON_PATH)
      .then((r) => r.json())
      .then((data) => {
        data.forEach(({ letter, word }) => {
          if (!word.startsWith(letter)) {
            console.error(`Mismatch: ${letter} → ${word}`);
          }
        });
        setLetters(shuffleArray(data));
      })
      .catch((e) => console.error('Failed to load tamil_letters.json', e));
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') {
        setIndex((i) => (i + 1) % letters.length);
        setShowTranslit(false);
        setShowWord(false);
      } else if (e.key === 'ArrowLeft') {
        setIndex((i) => (i - 1 + letters.length) % letters.length);
        setShowTranslit(false);
        setShowWord(false);
      } else if (e.key === '?') {
        setShowTranslit((b) => !b);
      } else if (e.key.toLowerCase() === 'i') {
        setShowWord((b) => !b);
        speakWord();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [letters]);


  const current = letters[index] || {};

  const handleShuffle = () => {
    setLetters(shuffleArray(letters));
    setIndex(0);
    setShowTranslit(false);
    setShowWord(false);
  };

  const speakLetter = () => speakTamil(current.letter);
  const speakWord = () => speakTamil(current.word);

  if (letters.length === 0) {
    return <div className="p-4 text-gray-300">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen">
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md flex items-center justify-center mb-4 cursor-pointer select-none border border-gray-600"
        onClick={() => {
          setShowTranslit((b) => !b);
          speakLetter();
        }}
      >
        <div className="text-center">
          <div className="text-8xl font-bold mb-2">{current.letter}</div>
          {showTranslit && (
            <div className="text-2xl text-yellow-300">{current.translit}</div>
          )}
          {showWord && (
            <React.Fragment>
              <div className="text-xl text-green-300 mt-1">{current.word}</div>
              <div className="text-sm text-blue-300">{current.wordTranslit}</div>
              <div className="text-sm text-blue-300">{current.english}</div>
            </React.Fragment>
          )}
        </div>
      </div>
      <div className="flex gap-4 scale-75">
        <button
          className="bg-gray-600 hover:bg-gray-500 text-white text-xl py-2 px-4 rounded-lg border border-gray-400"
          onClick={() => {
            setIndex((i) => (i - 1 + letters.length) % letters.length);
            setShowTranslit(false);
            setShowWord(false);
          }}
        >
          ←
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-500 text-white text-xl py-2 px-4 rounded-lg border border-gray-400"
          onClick={() => {
            setIndex((i) => (i + 1) % letters.length);
            setShowTranslit(false);
            setShowWord(false);
          }}
        >
          →
        </button>
        <button
          className="bg-yellow-600 hover:bg-yellow-500 text-black text-xl py-2 px-4 rounded-lg border border-yellow-400"
          onClick={handleShuffle}
        >
          ↻
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-400">
        {index + 1} / {letters.length}
      </div>
    </div>
  );
}

ReactDOM.render(<TamilFlashcards />, document.getElementById('tamil-app'));
