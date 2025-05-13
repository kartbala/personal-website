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
  const [dotSize, setDotSize] = useState('extra-large'); // 'medium', 'large', 'extra-large'
  const [showSettings, setShowSettings] = useState(false);
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
        case 's':
        case 'S':
          shuffleCards();
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
      }, 3000); // Shortened to 3 seconds
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
  
  // Toggle settings panel visibility
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // Change dot size and close settings panel
  const changeDotSize = (size) => {
    setDotSize(size);
    setShowSettings(false);
  };

  const renderDot = (position, dots) => {
    const isActive = dots.includes(position);
    
    // Define dot and font sizes based on the current setting
    let dotDimensions, fontSize;
    switch(dotSize) {
      case 'medium':
        dotDimensions = 'h-16 w-16';
        fontSize = 'text-2xl';
        break;
      case 'large':
        dotDimensions = 'h-20 w-20';
        fontSize = 'text-3xl';
        break;
      case 'extra-large':
        dotDimensions = 'h-24 w-24';
        fontSize = 'text-4xl';
        break;
      default:
        dotDimensions = 'h-16 w-16';
        fontSize = 'text-2xl';
    }
    
    return (
      <div 
        className={`${dotDimensions} rounded-full border-4 border-gray-800 flex items-center justify-center ${fontSize} font-bold ${isActive ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        {position}
      </div>
    );
  };

  const renderBrailleCell = (dots) => {
    // Adjust spacing based on dot size
    let spacing;
    switch(dotSize) {
      case 'medium':
        spacing = 'gap-6';
        break;
      case 'large':
        spacing = 'gap-8';
        break;
      case 'extra-large':
        spacing = 'gap-10';
        break;
      default:
        spacing = 'gap-6';
    }
    
    return (
      <div className="flex flex-col items-center">
        <div className={`flex ${spacing} mb-6`}>
          {renderDot(1, dots)}
          {renderDot(4, dots)}
        </div>
        <div className={`flex ${spacing} mb-6`}>
          {renderDot(2, dots)}
          {renderDot(5, dots)}
        </div>
        <div className={`flex ${spacing}`}>
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
        <div className="text-9xl font-bold mb-6">{currentChar.letter}-{alphabetPosition}</div>
        <div className="text-6xl mb-4 text-green-600 font-bold">Correct</div>
        <div className="text-4xl text-gray-800">
          Dots: {currentChar.dotString}
        </div>
      </div>
    );
  };

  const renderCardContent = () => {
    const currentChar = cards[currentIndex];
    const isMinimalMode = dotSize === 'extra-large';

    return (
      <div className="flex flex-col items-center relative">
        {/* Main content */}
        {renderBrailleCell(currentChar.dots)}
        
        {/* Only show these UI elements if not in minimal mode */}
        {!isMinimalMode && (
          <>
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
          </>
        )}
        
        {/* Show minimal keyboard shortcut info when switching to minimal mode */}
        {isMinimalMode && !isCelebrating && !showAnswer && (
          <div className="mt-8 opacity-50 text-lg">
            Type letter to guess, ← → to navigate, ? for answer, S to shuffle
          </div>
        )}
        
        {/* Celebration overlay */}
        {isCelebrating && renderCelebration()}
      </div>
    );
  };
  
  // Render the settings panel
  const renderSettings = () => {
    return (
      <div className="absolute top-4 right-4 z-20">
        {showSettings ? (
          <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300">
            <h3 className="text-lg font-bold mb-2">Settings</h3>
            <div className="flex flex-col gap-2">
              <button
                className={`py-2 px-4 rounded-md ${dotSize === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => changeDotSize('medium')}
              >
                Medium Dots
              </button>
              <button
                className={`py-2 px-4 rounded-md ${dotSize === 'large' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => changeDotSize('large')}
              >
                Large Dots
              </button>
              <button
                className={`py-2 px-4 rounded-md ${dotSize === 'extra-large' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => changeDotSize('extra-large')}
              >
                Extra Large Dots
              </button>
              <button
                className="py-2 px-4 mt-2 bg-gray-500 text-white rounded-md"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <button
            className="p-2 bg-gray-300 rounded-full"
            onClick={toggleSettings}
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={appRef}
      className="flex flex-col items-center p-8 bg-blue-50 min-h-screen"
      tabIndex="0"
    >      
      <div className="bg-white rounded-xl shadow-2xl p-12 w-full max-w-5xl min-h-128 flex items-center justify-center mb-8 relative">
        {renderCardContent()}
        {renderSettings()}
      </div>
      
      {/* Only show navigation buttons if not in extra-large mode */}
      {dotSize !== 'extra-large' && (
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
      )}
    </div>
  );
};

// Render the component
ReactDOM.render(<BrailleFlashcards />, document.getElementById('braille-app'));