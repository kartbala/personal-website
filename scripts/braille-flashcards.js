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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isCelebrating]); // Add isCelebrating to dependency array

  const handleNext = () => {
    // Only advance if not celebrating
    if (!isCelebrating) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
      setShowAnswer(false);
      setUserGuess('');
      setFeedback('');
    }
  };

  const handlePrevious = () => {
    // Only go back if not celebrating
    if (!isCelebrating) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
      setShowAnswer(false);
      setUserGuess('');
      setFeedback('');
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
      }, 750); // Reduced from 3000ms to 750ms (75% reduction)
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
        className={`h-16 w-16 rounded-full border-4 border-gray-800 flex items-center justify-center text-2xl font-bold ${isActive ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        {position}
      </div>
    );
  };

  const renderBrailleCell = (dots) => {
    return (
      <div className="flex flex-col items-center">
        <div className="flex gap-6 mb-6">
          {renderDot(1, dots)}
          {renderDot(4, dots)}
        </div>
        <div className="flex gap-6 mb-6">
          {renderDot(2, dots)}
          {renderDot(5, dots)}
        </div>
        <div className="flex gap-6">
          {renderDot(3, dots)}
          {renderDot(6, dots)}
        </div>
      </div>
    );
  };
  
  const renderCelebration = () => {
    const currentChar = cards[currentIndex];
    // Find position in alphabet (1-based index)
    const alphabetPosition = currentChar.letter.charCodeAt(0) - 64; // A is 65 in ASCII, so A becomes 1
    
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50 bg-opacity-90 z-10 py-8">
        <div className="text-9xl font-bold mb-6 text-green-600">{currentChar.letter}-{alphabetPosition}</div>
        <div className="text-4xl text-gray-800">
          Dots: {currentChar.dotString}
        </div>
      </div>
    );
  };

  const renderCardContent = () => {
    const currentChar = cards[currentIndex];

    return (
      <div className="flex flex-col items-center relative">
        {/* Main content */}
        {renderBrailleCell(currentChar.dots)}
        
        {showAnswer ? (
          <div className="text-6xl font-bold mt-8">
            Dots {currentChar.dotString} = Letter {currentChar.letter}
          </div>
        ) : (
          <div className="mt-8 w-full">
            <div className="text-4xl mb-4">Enter letter or press ? for answer</div>
            <div className="text-5xl font-bold mb-2">
              Your guess: {userGuess || "_"}
            </div>
            <div className={`text-4xl ${feedback.startsWith('Correct!') ? 'text-green-600' : 'text-red-600'}`}>
              {feedback}
            </div>
          </div>
        )}
        
        {/* Celebration overlay */}
        {isCelebrating && renderCelebration()}
      </div>
    );
  };

  return (
    <div 
      ref={appRef}
      className="flex flex-col items-center p-8 bg-blue-50 min-h-screen"
      tabIndex="0"
    >      
      <div className="bg-white rounded-xl shadow-2xl p-12 w-full max-w-5xl min-h-128 flex items-center justify-center mb-8">
        {renderCardContent()}
      </div>
      
      <div className="flex gap-6">
        <button 
        className="bg-blue-700 hover:bg-blue-800 text-white text-3xl font-bold py-4 px-8 rounded-lg"
        onClick={handlePrevious}
        >
        Previous
        </button>
        <button 
        className="bg-blue-700 hover:bg-blue-800 text-white text-3xl font-bold py-4 px-8 rounded-lg"
        onClick={handleNext}
        >
        Next
        </button>
        <button 
        className="bg-green-700 hover:bg-green-800 text-white text-3xl font-bold py-4 px-8 rounded-lg"
        onClick={shuffleCards}
        >
        Shuffle
        </button>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<BrailleFlashcards />, document.getElementById('braille-app'));
