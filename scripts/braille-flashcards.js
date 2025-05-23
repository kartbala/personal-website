// Braille Flashcards Component
const { useState, useEffect, useRef } = React;

// Shuffle the braille characters
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const BrailleFlashcards = () => {
  // Braille characters with their dot patterns
  const brailleChars = [
    { letter: 'A', dots: [1], dotString: '1' },
    { letter: 'B', dots: [1, 2], dotString: '12' },
    { letter: 'C', dots: [1, 4], dotString: '14' },
    { letter: 'D', dots: [1, 4, 5], dotString: '145' },
    { letter: 'E', dots: [1, 5], dotString: '15' },
    { letter: 'F', dots: [1, 2, 4], dotString: '124' },
    { letter: 'G', dots: [1, 2, 4, 5], dotString: '1245' },
    { letter: 'H', dots: [1, 2, 5], dotString: '125' },
    { letter: 'I', dots: [2, 4], dotString: '24' },
    { letter: 'J', dots: [2, 4, 5], dotString: '245' },
    { letter: 'K', dots: [1, 3], dotString: '13' },
    { letter: 'L', dots: [1, 2, 3], dotString: '123' },
    { letter: 'M', dots: [1, 3, 4], dotString: '134' },
    { letter: 'N', dots: [1, 3, 4, 5], dotString: '1345' },
    { letter: 'O', dots: [1, 3, 5], dotString: '135' },
    { letter: 'P', dots: [1, 2, 3, 4], dotString: '1234' },
    { letter: 'Q', dots: [1, 2, 3, 4, 5], dotString: '12345' },
    { letter: 'R', dots: [1, 2, 3, 5], dotString: '1235' },
    { letter: 'S', dots: [2, 3, 4], dotString: '234' },
    { letter: 'T', dots: [2, 3, 4, 5], dotString: '2345' },
    { letter: 'U', dots: [1, 3, 6], dotString: '136' },
    { letter: 'V', dots: [1, 2, 3, 6], dotString: '1236' },
    { letter: 'W', dots: [2, 4, 5, 6], dotString: '2456' },
    { letter: 'X', dots: [1, 3, 4, 6], dotString: '1346' },
    { letter: 'Y', dots: [1, 3, 4, 5, 6], dotString: '13456' },
    { letter: 'Z', dots: [1, 3, 5, 6], dotString: '1356' }
  ];

  // All state variables declared at the top
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  // Initialize with shuffled cards instead of alphabetical order
  const [cards, setCards] = useState(shuffleArray([...brailleChars]));
  const [isCelebrating, setIsCelebrating] = useState(false);
  const appRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return 'st';
    }
    if (j === 2 && k !== 12) {
      return 'nd';
    }
    if (j === 3 && k !== 13) {
      return 'rd';
    }
    return 'th';
  };
  
  // Handle key presses outside the normal flow
  useEffect(() => {
    // Focus the app div for keyboard events
    if (appRef.current) {
      appRef.current.focus();
    }
    
    const handleKeyDown = (e) => {
      if (!isMobileDevice()) {
        // Skip if we're already celebrating
        if (isCelebrating) return;
        
        switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case '?':
          setShowAnswer(true);
          break;
        default:
          // If the key is a single letter, use it as a guess
          if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
            handleLetterGuess(e.key.toUpperCase());
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isCelebrating]);

  // Effect to focus mobile input on mount
  useEffect(() => {
    if (isMobileDevice() && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, []);

  const handleMobileInput = (e) => {
    const value = e.target.value;
    if (value) {
      const char = value.slice(-1).toUpperCase();
      if (char.match(/[A-Z]/)) {
        handleLetterGuess(char);
      }
    }
    e.target.value = '';

    // Re-focus the input field on mobile
    if (isMobileDevice() && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  };

  const handleNext = () => {
    // Only advance if not celebrating
    if (!isCelebrating) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
      setShowAnswer(false);
      setUserGuess('');
      setFeedback('');
      // Re-focus the input field on mobile
      if (isMobileDevice() && mobileInputRef.current) {
        mobileInputRef.current.focus();
      }
    }
  };

  const handlePrevious = () => {
    // Only go back if not celebrating
    if (!isCelebrating) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
      setShowAnswer(false);
      setUserGuess('');
      setFeedback('');
      // Re-focus the input field on mobile
      if (isMobileDevice() && mobileInputRef.current) {
        mobileInputRef.current.focus();
      }
    }
  };

  const handleLetterGuess = (letter) => {
    setUserGuess(letter);
    
    const correctAnswer = cards[currentIndex].letter;
    if (letter.toUpperCase() === correctAnswer) {
      // Immediately show celebration
      setIsCelebrating(true);
      
      // Auto-advance after celebration
      setTimeout(() => {
        setIsCelebrating(false);
        setUserGuess('');
        setFeedback('');
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
      }, 750);
    } else {
      setFeedback('Try again or press ? for answer');
    }
  };

  const shuffleCards = () => {
    setCards(shuffleArray([...brailleChars]));
    setCurrentIndex(0);
    setShowAnswer(false);
    setUserGuess('');
    setFeedback('');
  };

  const renderDot = (position, dots) => {
    const isActive = dots.includes(position);
    return (
      <div 
        className={`h-32 w-32 rounded-full border-4 border-gray-300 flex items-center justify-center text-6xl font-bold ${isActive ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-gray-300'}`}
      >
        {position}
      </div>
    );
  };

  const renderBrailleCell = (dots) => {
    return (
      <div className="flex flex-col items-center">
        <div className="flex gap-10 mb-10">
          {renderDot(1, dots)}
          {renderDot(4, dots)}
        </div>
        <div className="flex gap-10 mb-10">
          {renderDot(2, dots)}
          {renderDot(5, dots)}
        </div>
        <div className="flex gap-10">
          {renderDot(3, dots)}
          {renderDot(6, dots)}
        </div>
      </div>
    );
  };
  
  const renderCelebration = () => {
    const currentChar = cards[currentIndex];
    // Find position in alphabet (1-based index)
    const alphabetPosition = currentChar.letter.charCodeAt(0) - 64;
    
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-95 z-10 py-8">
        <div className="text-9xl font-bold mb-6 text-green-400">{currentChar.letter}-{alphabetPosition}</div>
        <div className="text-9xl font-bold text-yellow-400">
          {currentChar.dotString}
        </div>
      </div>
    );
  };

  const renderCardContent = () => {
    const currentChar = cards[currentIndex];

    return (
      <div className="flex flex-col items-center relative">
        {/* Main content - make braille cell as large as possible */}
        <div className="py-8">
          {renderBrailleCell(currentChar.dots)}
        </div>
        
        {/* Minimized UI elements */}
        <div className="mt-4">
          {showAnswer ? (
            <div className="text-4xl font-bold text-yellow-400">
              {currentChar.letter}
            </div>
          ) : (
            <div className="text-2xl font-bold text-white">
              {userGuess && 
                <span className="text-3xl text-yellow-400">{userGuess}</span>
              }
              {feedback && 
                <span className="text-xl ml-4 text-red-400">{feedback}</span>
              }
            </div>
          )}
        </div>
        
        {/* Celebration overlay */}
        {isCelebrating && renderCelebration()}
      </div>
    );
  };

  return (
    <div 
      ref={appRef}
      className="flex flex-col items-center p-4 bg-gray-900 min-h-screen"
      tabIndex="0"
    >      
      {isMobileDevice() && (
        <input
          type="text"
          ref={mobileInputRef}
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
          onInput={handleMobileInput}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
        />
      )}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-5xl flex items-center justify-center mb-4 relative border border-gray-600">
        {renderCardContent()}
      </div>
      
      <div className="flex gap-4 scale-75">
        <button 
          className="bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold py-2 px-4 rounded-lg border border-gray-400"
          onClick={handlePrevious}
        >
          ←
        </button>
        <button 
          className="bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold py-2 px-4 rounded-lg border border-gray-400"
          onClick={handleNext}
        >
          →
        </button>
        <button 
          className="bg-yellow-600 hover:bg-yellow-500 text-black text-xl font-bold py-2 px-4 rounded-lg border border-yellow-400"
          onClick={shuffleCards}
        >
          ↻
        </button>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<BrailleFlashcards />, document.getElementById('braille-app'));
