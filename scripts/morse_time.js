// Morse Code Time Display
document.addEventListener('DOMContentLoaded', function() {
    // Morse code mappings for digits
    const morseCode = {
        '0': '−−−−−',
        '1': '•−−−−',
        '2': '••−−−',
        '3': '•••−−',
        '4': '••••−',
        '5': '•••••',
        '6': '−••••',
        '7': '−−•••',
        '8': '−−−••',
        '9': '−−−−•'
    };

    // Elements
    const currentTimeEl = document.getElementById('current-time');
    const morseTimeEl = document.getElementById('morse-time');
    const soundToggleEl = document.getElementById('sound-toggle');
    const vibrationToggleEl = document.getElementById('vibration-toggle');
    const playMorseEl = document.getElementById('play-morse');
    const statusEl = document.getElementById('status');

    // Settings
    let soundEnabled = true;
    let vibrationEnabled = true;
    let isPlaying = false;

    // Audio context for generating morse code sounds
    let audioContext;
    let gainNode;

    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Initialize audio context
    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            return true;
        } catch (e) {
            console.warn('Audio not supported:', e);
            return false;
        }
    }

    // Play a beep sound
    function playBeep(frequency = 600, duration = 100) {
        if (!soundEnabled || !audioContext) return Promise.resolve();

        return new Promise((resolve) => {
            const oscillator = audioContext.createOscillator();
            const tempGain = audioContext.createGain();
            
            oscillator.connect(tempGain);
            tempGain.connect(gainNode);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            tempGain.gain.setValueAtTime(0, audioContext.currentTime);
            tempGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            tempGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000 - 0.01);
            tempGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
            
            setTimeout(resolve, duration);
        });
    }

    // Vibrate device (mobile only)
    function vibrate(pattern) {
        if (!vibrationEnabled || !isMobile || !navigator.vibrate) return;
        navigator.vibrate(pattern);
    }

    // Convert time string to morse code
    function timeToMorse(timeStr) {
        return timeStr.split('').map(char => {
            if (char === ':') return ':';
            return morseCode[char] || '?';
        });
    }

    // Update time display
    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit', 
            second: '2-digit'
        });
        
        currentTimeEl.textContent = timeStr;
        
        const morseArray = timeToMorse(timeStr);
        morseTimeEl.innerHTML = morseArray.map(morse => 
            `<span class="morse-char">${morse}</span>`
        ).join('');
    }

    // Play morse code for entire time string
    async function playMorseTime() {
        if (isPlaying) return;
        
        isPlaying = true;
        playMorseEl.textContent = '⏸️ Playing...';
        statusEl.textContent = 'Playing morse code...';
        
        const timeStr = currentTimeEl.textContent;
        const dotDuration = 100;  // milliseconds
        const dashDuration = 300; // milliseconds
        const gapDuration = 100;  // gap between dots/dashes
        const charGapDuration = 300; // gap between characters
        const colonGapDuration = 500; // gap for colon separator
        
        try {
            for (let i = 0; i < timeStr.length; i++) {
                const char = timeStr[i];
                
                if (char === ':') {
                    // Special handling for colon - just a pause
                    await new Promise(resolve => setTimeout(resolve, colonGapDuration));
                    continue;
                }
                
                const morse = morseCode[char];
                if (!morse) continue;
                
                // Prepare vibration pattern for this character
                let vibrationPattern = [];
                
                // Play each dot or dash in the character
                for (let j = 0; j < morse.length; j++) {
                    const symbol = morse[j];
                    
                    if (symbol === '•') {
                        // Dot
                        vibrationPattern.push(dotDuration);
                        await playBeep(600, dotDuration);
                        if (j < morse.length - 1) {
                            vibrationPattern.push(gapDuration);
                            await new Promise(resolve => setTimeout(resolve, gapDuration));
                        }
                    } else if (symbol === '−') {
                        // Dash
                        vibrationPattern.push(dashDuration);
                        await playBeep(600, dashDuration);
                        if (j < morse.length - 1) {
                            vibrationPattern.push(gapDuration);
                            await new Promise(resolve => setTimeout(resolve, gapDuration));
                        }
                    }
                }
                
                // Vibrate the pattern for this character
                if (vibrationPattern.length > 0) {
                    vibrate(vibrationPattern);
                }
                
                // Gap between characters (except last one)
                if (i < timeStr.length - 1 && timeStr[i + 1] !== ':') {
                    await new Promise(resolve => setTimeout(resolve, charGapDuration));
                }
            }
        } catch (error) {
            console.error('Error playing morse code:', error);
        }
        
        isPlaying = false;
        playMorseEl.textContent = '▶️ Play Current Time';
        statusEl.textContent = 'Ready';
    }

    // Event listeners
    soundToggleEl.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        this.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
        this.classList.toggle('active', soundEnabled);
        
        if (soundEnabled && !audioContext) {
            initAudio();
        }
    });

    vibrationToggleEl.addEventListener('click', function() {
        vibrationEnabled = !vibrationEnabled;
        this.textContent = vibrationEnabled ? '📳 Vibration ON' : '📳 Vibration OFF';
        this.classList.toggle('active', vibrationEnabled);
    });

    playMorseEl.addEventListener('click', function() {
        if (!isPlaying) {
            playMorseTime();
        }
    });

    // Initialize
    initAudio();
    updateTime();
    
    // Update time every second
    setInterval(updateTime, 1000);

    // Auto-play morse code every minute (optional)
    let lastMinute = new Date().getMinutes();
    setInterval(() => {
        const currentMinute = new Date().getMinutes();
        if (currentMinute !== lastMinute && soundEnabled && !isPlaying) {
            // Uncomment the next line if you want auto-play every minute
            // playMorseTime();
        }
        lastMinute = currentMinute;
    }, 1000);

    // Set initial status
    statusEl.textContent = `Ready ${isMobile ? '(Mobile detected - vibration available)' : '(Desktop)'}`;
    
    // Hide vibration control if not supported
    if (!isMobile || !navigator.vibrate) {
        vibrationToggleEl.style.display = 'none';
    }
});
