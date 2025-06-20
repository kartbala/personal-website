const { useState, useEffect } = React;

// Example words, transliteration, and English meaning for each base letter
const sampleWords = {
  'அ': { tamil: 'அரசு', translit: 'arasu', english: 'king' },
  'ஆ': { tamil: 'ஆடு', translit: 'aadu', english: 'goat' },
  'இ': { tamil: 'இலை', translit: 'ilai', english: 'leaf' },
  'ஈ': { tamil: 'ஈரம்', translit: 'eeram', english: 'moisture' },
  'உ': { tamil: 'உரி', translit: 'uri', english: 'hide' },
  'ஊ': { tamil: 'ஊர்', translit: 'oor', english: 'village' },
  'எ': { tamil: 'எலி', translit: 'eli', english: 'mouse' },
  'ஏ': { tamil: 'ஏணி', translit: 'eni', english: 'ladder' },
  'ஐ': { tamil: 'ஐந்து', translit: 'aindhu', english: 'five' },
  'ஒ': { tamil: 'ஒட்டகம்', translit: 'ottagam', english: 'camel' },
  'ஓ': { tamil: 'ஓடு', translit: 'oodu', english: 'run' },
  'ஔ': { tamil: 'ஔவியம்', translit: 'ouviyam', english: 'painting' },
  'ஃ': { tamil: 'ஃஅக்கு', translit: 'akku', english: 'akku' },
  'க': { tamil: 'குடம்', translit: 'kudam', english: 'pot' },
  'ங': { tamil: 'ஙா', translit: 'ngaa', english: 'nga' },
  'ச': { tamil: 'சரி', translit: 'sari', english: 'correct' },
  'ஞ': { tamil: 'ஞானம்', translit: 'gnanam', english: 'wisdom' },
  'ட': { tamil: 'டமாரம்', translit: 'tamaaram', english: 'drum' },
  'ண': { tamil: 'ணை', translit: 'nai', english: 'pillow' },
  'த': { tamil: 'தலை', translit: 'thalai', english: 'head' },
  'ந': { tamil: 'நரி', translit: 'nari', english: 'fox' },
  'ப': { tamil: 'பல்', translit: 'pal', english: 'tooth' },
  'ம': { tamil: 'மரம்', translit: 'maram', english: 'tree' },
  'ய': { tamil: 'யானை', translit: 'yaanai', english: 'elephant' },
  'ர': { tamil: 'ரதம்', translit: 'ratham', english: 'chariot' },
  'ல': { tamil: 'லட்டு', translit: 'lattu', english: 'laddu' },
  'வ': { tamil: 'வீடு', translit: 'veedu', english: 'house' },
  'ழ': { tamil: 'ழகு', translit: 'azhagu', english: 'beauty' },
  'ள': { tamil: 'ளவு', translit: 'lavu', english: 'amount' },
  'ற': { tamil: 'றை', translit: 'rai', english: 'room' },
  'ன': { tamil: 'நன்றி', translit: 'nanri', english: 'thanks' }
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

  const restMap = {};
  consonants.forEach((c) => {
    const w = sampleWords[c.base];
    if (w) {
      restMap[c.base] = {
        tamil: w.tamil.slice(1),
        translit: w.translit.slice(c.translit.length),
        english: w.english,
      };
    }
  });

  // Independent vowels
  vowels.forEach((v) =>
    letters.push({
      letter: v.letter,
      translit: v.translit,
      word: sampleWords[v.letter].tamil,
      wordTranslit: sampleWords[v.letter].translit,
      english: sampleWords[v.letter].english,
    })
  );

  // Aytham
  letters.push({
    letter: 'ஃ',
    translit: 'ah',
    word: sampleWords['ஃ'].tamil,
    wordTranslit: sampleWords['ஃ'].translit,
    english: sampleWords['ஃ'].english,
  });

  // Pure consonants
  consonants.forEach((c) =>
    letters.push({
      letter: c.base + '்',
      translit: c.translit,
      word: sampleWords[c.base].tamil,
      wordTranslit: sampleWords[c.base].translit,
      english: sampleWords[c.base].english,
    })
  );

  // Uyirmei letters (consonant + vowel combinations)
  consonants.forEach((c) => {
    const rest = restMap[c.base];
    vowels.forEach((v) => {
      letters.push({
        letter: c.base + v.sign,
        translit: c.translit + v.translit,
        word: (c.base + v.sign) + (rest ? rest.tamil : ''),
        wordTranslit: (c.translit + v.translit) + (rest ? rest.translit : ''),
        english: rest ? rest.english : '',
      });
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
  const [voice, setVoice] = useState(null);

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

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const ta = voices.find((v) => v.lang && v.lang.startsWith('ta'));
      const en = voices.find((v) => v.lang && v.lang.startsWith('en'));
      setVoice(ta || en || null);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const current = letters[index];

  const handleShuffle = () => {
    setLetters(shuffleArray(letters));
    setIndex(0);
    setShowTranslit(false);
    setShowWord(false);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'ta-IN';
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const speakLetter = () => speak(current.letter);
  const speakWord = () => speak(current.word);

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
        <button
          className="bg-green-600 hover:bg-green-500 text-white text-xl py-2 px-4 rounded-lg border border-green-400"
          onClick={speakLetter}
        >
          🔊
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-400">
        {index + 1} / {letters.length}
      </div>
    </div>
  );
}

ReactDOM.render(<TamilFlashcards />, document.getElementById('tamil-app'));
