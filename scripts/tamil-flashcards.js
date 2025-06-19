const { useState, useEffect } = React;

// Example words for each base letter
const sampleWords = {
  'அ': 'அரசு',
  'ஆ': 'ஆடு',
  'இ': 'இலை',
  'ஈ': 'ஈரம்',
  'உ': 'உரி',
  'ஊ': 'ஊர்',
  'எ': 'எலி',
  'ஏ': 'ஏணி',
  'ஐ': 'ஐந்து',
  'ஒ': 'ஒட்டகம்',
  'ஓ': 'ஓடு',
  'ஔ': 'ஔவியம்',
  'ஃ': 'ஃஅக்கு',
  'க': 'குடம்',
  'ங': 'ஙா',
  'ச': 'சரி',
  'ஞ': 'ஞானம்',
  'ட': 'டமாரம்',
  'ண': 'ணை',
  'த': 'தலை',
  'ந': 'நரி',
  'ப': 'பல்',
  'ம': 'மரம்',
  'ய': 'யானை',
  'ர': 'ரதம்',
  'ல': 'லட்டு',
  'வ': 'வீடு',
  'ழ': 'ழகு',
  'ள': 'ளவு',
  'ற': 'றை',
  'ன': 'நன்றி'
};

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
const buildTamilLetters = () => {
  const vowels = [
    { letter: 'அ', sign: '', translit: 'a' },
    { letter: 'ஆ', sign: 'ா', translit: 'aa' },
    { letter: 'இ', sign: 'ி', translit: 'i' },
    { letter: 'ஈ', sign: 'ீ', translit: 'ii' },
    { letter: 'உ', sign: 'ு', translit: 'u' },
    { letter: 'ஊ', sign: 'ூ', translit: 'uu' },
    { letter: 'எ', sign: 'ெ', translit: 'e' },
    { letter: 'ஏ', sign: 'ே', translit: 'ee' },
    { letter: 'ஐ', sign: 'ை', translit: 'ai' },
    { letter: 'ஒ', sign: 'ொ', translit: 'o' },
    { letter: 'ஓ', sign: 'ோ', translit: 'oo' },
    { letter: 'ஔ', sign: 'ௌ', translit: 'au' }
  ];

  const consonants = [
    { base: 'க', translit: 'k' },
    { base: 'ங', translit: 'ng' },
    { base: 'ச', translit: 'c' },
    { base: 'ஞ', translit: 'ny' },
    { base: 'ட', translit: 't' },
    { base: 'ண', translit: 'n' },
    { base: 'த', translit: 'th' },
    { base: 'ந', translit: 'n' },
    { base: 'ப', translit: 'p' },
    { base: 'ம', translit: 'm' },
    { base: 'ய', translit: 'y' },
    { base: 'ர', translit: 'r' },
    { base: 'ல', translit: 'l' },
    { base: 'வ', translit: 'v' },
    { base: 'ழ', translit: 'zh' },
    { base: 'ள', translit: 'L' },
    { base: 'ற', translit: 'R' },
    { base: 'ன', translit: 'n' }
  ];

  const letters = [];

  // Independent vowels
  vowels.forEach((v) => letters.push({ letter: v.letter, translit: v.translit, word: sampleWords[v.letter] }));

  // Aytham
  letters.push({ letter: 'ஃ', translit: 'ah', word: sampleWords['ஃ'] });

  // Pure consonants
  consonants.forEach((c) => letters.push({ letter: c.base + '்', translit: c.translit, word: sampleWords[c.base] }));

  // Uyirmei letters (consonant + vowel combinations)
  consonants.forEach((c) => {
    vowels.forEach((v) => {
      letters.push({ letter: c.base + v.sign, translit: c.translit + v.translit, word: sampleWords[c.base] });
    });
  });

  return letters;
};

const tamilLetters = buildTamilLetters();

function TamilFlashcards() {
  const [index, setIndex] = useState(0);
  const [showTranslit, setShowTranslit] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [letters, setLetters] = useState(shuffleArray(tamilLetters));

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
        speakLetter();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [letters]);

  const current = letters[index];

  const handleShuffle = () => {
    setLetters(shuffleArray(letters));
    setIndex(0);
    setShowTranslit(false);
    setShowWord(false);
  };

  const speakLetter = () => {
    const utterance = new SpeechSynthesisUtterance(`${current.letter} ${current.word}`);
    utterance.lang = 'ta-IN';
    window.speechSynthesis.speak(utterance);
  };

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
            <div className="text-xl text-green-300 mt-1">{current.word}</div>
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
