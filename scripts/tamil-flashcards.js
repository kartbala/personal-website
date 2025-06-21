const { useState, useEffect } = React;

// Example words, transliteration, and English meaning for each base letter
const sampleWords = {
  'அ': { tamil: 'அரசு', translit: 'arasu', english: 'government' },
  'ஆ': { tamil: 'ஆடு', translit: 'aadu', english: 'goat' },
  'இ': { tamil: 'இலை', translit: 'ilai', english: 'leaf' },
  'ஈ': { tamil: 'ஈரம்', translit: 'eeram', english: 'moisture' },
  'உ': { tamil: 'உரி', translit: 'uri', english: 'hide' }, // skin
  'ஊ': { tamil: 'ஊர்', translit: 'oor', english: 'village' },
  'எ': { tamil: 'எலி', translit: 'eli', english: 'rat' },
  'ஏ': { tamil: 'ஏணி', translit: 'eni', english: 'ladder' },
  'ஐ': { tamil: 'ஐந்து', translit: 'aindhu', english: 'five' },
  'ஒ': { tamil: 'ஒட்டகம்', translit: 'ottagam', english: 'camel' },
  'ஓ': { tamil: 'ஓடு', translit: 'oodu', english: 'run' }, // also 'tile'
  'ஔ': { tamil: 'ஔவை', translit: 'auvai', english: 'wise old woman' },
  'ஃ': { tamil: 'அஃது', translit: 'ahthu', english: 'that/it' },
  'க': { tamil: 'கல்', translit: 'kal', english: 'stone' },
  'ங': { tamil: 'ஙனம்', translit: 'nganam', english: 'thus/so' }, // Rare
  'ச': { tamil: 'சனி', translit: 'sani', english: 'Saturn/Saturday' }, // Simpler word, starts with ச
  'ஞ': { tamil: 'ஞானம்', translit: 'gnanam', english: 'wisdom' },
  'ட': { tamil: 'டம்', translit: 'dam', english: 'sound (as in drum beat)' }, // Simplified, starts with ட
  'ண': { tamil: 'நண்பன்', translit: 'nanban', english: 'friend' }, // Word contains ண, but doesn't start. Original 'ணை' was problematic. This is a placeholder, will address 'ண' in word construction logic.
  'த': { tamil: 'தம்', translit: 'tham', english: 'their (reflexive)' },
  'ந': { tamil: 'நகை', translit: 'nagai', english: 'jewel/joke' },
  'ப': { tamil: 'படம்', translit: 'padam', english: 'picture' },
  'ம': { tamil: 'மனம்', translit: 'manam', english: 'mind' },
  'ய': { tamil: 'யமன்', translit: 'yaman', english: 'Yama (god of death)' },
  'ர': { tamil: 'ரவி', translit: 'ravi', english: 'sun' },
  'ல': { tamil: 'லயம்', translit: 'layam', english: 'rhythm' },
  'வ': { tamil: 'வரம்', translit: 'varam', english: 'boon' },
  'ழ': { tamil: 'பழம்', translit: 'pazham', english: 'fruit' }, // Word contains ழ, doesn't start. Original 'ழகு' was problematic. This is a placeholder.
  'ள': { tamil: 'தளம்', translit: 'thalam', english: 'floor/base' }, // Word contains ள, doesn't start. Original 'ளவு' was problematic. This is a placeholder.
  'ற': { tamil: 'பெரிய', translit: 'periya', english: 'big' }, // Word contains ற, doesn't start. Original 'றை' was problematic. This is a placeholder.
  'ன': { tamil: 'கனவு', translit: 'kanavu', english: 'dream' } // Word contains ன, doesn't start.
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
  const firstVowelTranslit = vowels[0].translit; // Should be 'a'

  const anImprovedRestMap = {};
  consonants.forEach((c) => {
    const w = sampleWords[c.base];
    if (!w || !w.tamil || !w.translit) {
      anImprovedRestMap[c.base] = {
        english: (w ? w.english : ''),
        noRealWord: true // Indicates no proper sample word, just use letter
      };
      return;
    }

    const tamilStartsWithBase = w.tamil.startsWith(c.base);
    const translitStartExpected = c.translit + firstVowelTranslit;
    const translitStartsWithExpected = w.translit.startsWith(translitStartExpected);

    if (tamilStartsWithBase && translitStartsWithExpected) {
      anImprovedRestMap[c.base] = {
        tamil_suffix: w.tamil.substring(c.base.length),
        translit_suffix: w.translit.substring(translitStartExpected.length),
        english: w.english,
        isSuffixLogic: true
      };
    } else {
      anImprovedRestMap[c.base] = {
        full_tamil_word: w.tamil,
        full_translit_word: w.translit,
        english: w.english,
        isSuffixLogic: false
      };
    }
  });

  // Independent vowels
  vowels.forEach((v) => {
    const w = sampleWords[v.letter];
    letters.push({
      letter: v.letter,
      translit: v.translit,
      word: w ? w.tamil : v.letter,
      wordTranslit: w ? w.translit : v.translit,
      english: w ? w.english : '',
    });
  });

  // Aytham
  const aythamSample = sampleWords['ஃ'];
  letters.push({
    letter: 'ஃ',
    translit: 'ah', // Standard translit for ஃ
    word: aythamSample ? aythamSample.tamil : 'ஃ',
    wordTranslit: aythamSample ? aythamSample.translit : 'ah',
    english: aythamSample ? aythamSample.english : '',
  });

  // Pure consonants (e.g., க், ங்)
  consonants.forEach((c) => {
    const w = sampleWords[c.base]; // The sample word for the base consonant (e.g., 'கல்' for 'க')
    letters.push({
      letter: c.base + '்', // க்
      translit: c.translit, // k
      word: w ? w.tamil : c.base + '்', // கல் (if available)
      wordTranslit: w ? w.translit : c.translit, // kal (if available)
      english: w ? w.english : '', // stone (if available)
    });
  });

  // Uyirmei letters (consonant + vowel combinations)
  consonants.forEach((c) => {
    const restEntry = anImprovedRestMap[c.base];
    vowels.forEach((v) => {
      const uyirmeiLetter = c.base + v.sign; // e.g., க + ா = கா
      const uyirmeiTranslit = c.translit + v.translit; // e.g., k + aa = kaa

      let finalWord = uyirmeiLetter; // Default to letter itself
      let finalWordTranslit = uyirmeiTranslit;
      let finalEnglish = "";

      if (restEntry) {
        finalEnglish = restEntry.english;
        // Precedence:
        // 1. No real word? -> Just show the letter itself.
        // 2. Suffix logic applicable? -> Construct word (e.g., கால்).
        // 3. Fallback (not suffix logic, and is a real word) -> Show full word (e.g., சனி).
        if (restEntry.noRealWord) {
            // finalWord and finalWordTranslit remain as initialized (uyirmeiLetter, uyirmeiTranslit)
        } else if (restEntry.isSuffixLogic) {
          finalWord = uyirmeiLetter + restEntry.tamil_suffix;
          finalWordTranslit = uyirmeiTranslit + restEntry.translit_suffix;
        } else {
          // Not noRealWord and not isSuffixLogic => use full_tamil_word from restEntry
          finalWord = restEntry.full_tamil_word;
          finalWordTranslit = restEntry.full_translit_word;
        }
      }
      // If restEntry itself was null/undefined (no entry in sampleWords for the base consonant),
      // finalWord and finalWordTranslit will remain as uyirmeiLetter and uyirmeiTranslit,
      // and finalEnglish will be "", which is the desired behavior.

      letters.push({
        letter: uyirmeiLetter,
        translit: uyirmeiTranslit,
        word: finalWord,
        wordTranslit: finalWordTranslit,
        english: finalEnglish,
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
        // speakWord() will be called if showWord becomes true,
        // but we need to ensure current is updated if index changed.
        // This is implicitly handled by React's render cycle.
        // The actual speakWord call is triggered by the UI effect or directly.
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [letters]); // Added letters to dependency array, though it was already there.

  useEffect(() => {
    const populateVoiceList = () => {
      if (!window.speechSynthesis) return;
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) {
        // Voices might not be loaded yet. Rely on onvoiceschanged.
        // Some browsers might need a nudge if onvoiceschanged is not supported.
        if (window.speechSynthesis.onvoiceschanged === undefined) {
            const dummyUtterance = new SpeechSynthesisUtterance('');
            dummyUtterance.volume = 0;
            window.speechSynthesis.speak(dummyUtterance);
        }
        return;
      }
      const taVoice = availableVoices.find((v) => v.lang && v.lang.startsWith('ta'));
      const enVoice = availableVoices.find((v) => v.lang && v.lang.startsWith('en'));
      setVoice(taVoice || enVoice || availableVoices[0] || null);
    };

    populateVoiceList();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, []);

  const current = letters[index];

  // Speak word when showWord becomes true and current word is available
  useEffect(() => {
    if (showWord && current && current.word) {
      speakWord();
    }
  }, [showWord, current]);


  const handleShuffle = () => {
    setLetters(shuffleArray(letters));
    setIndex(0);
    setShowTranslit(false);
    setShowWord(false);
  };

  const speak = (text) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel(); // Cancel any ongoing speech first

    const utterance = new SpeechSynthesisUtterance(text);

    if (voice && voice.lang) { // If we have a selected voice with a lang property
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else if (voice) { // If we have a voice object but it's missing lang (unusual)
      utterance.voice = voice;
      if (voice.name && voice.name.toLowerCase().includes('tamil')) {
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-US';
      }
    } else {
      const availableVoices = window.speechSynthesis.getVoices();
      const taVoice = availableVoices.find(v => v.lang && v.lang.startsWith('ta'));
      const enVoice = availableVoices.find(v => v.lang && v.lang.startsWith('en'));

      if (taVoice) {
        utterance.voice = taVoice;
        utterance.lang = taVoice.lang;
      } else if (enVoice) {
        utterance.voice = enVoice;
        utterance.lang = enVoice.lang;
      } else {
        utterance.lang = 'ta-IN';
      }
    }

    utterance.pitch = 1;
    utterance.rate = 1;

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
