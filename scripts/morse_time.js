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
    const secondsToggleEl = document.getElementById('seconds-toggle');
    const playMorseEl = document.getElementById('play-morse');
    const testVibrationEl = document.getElementById('test-vibration');
    const statusEl = document.getElementById('status');

    // Settings
    let soundEnabled = true;
    let vibrationEnabled = true;
    let showSeconds = false; // Default: don't show seconds
    let isPlaying = false;

    // Audio context for generating morse code sounds
    let audioContext;
    let gainNode;

    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const hasVibration = isMobile && navigator.vibrate && !isIOS; // iOS Safari doesn't support vibration

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
        if (!vibrationEnabled || !hasVibration) return;
        
        try {
            // Ensure pattern is valid
            if (Array.isArray(pattern) && pattern.length > 0) {
                console.log('Vibrating with pattern:', pattern);
                navigator.vibrate(pattern);
            } else if (typeof pattern === 'number') {
                console.log('Vibrating for:', pattern + 'ms');
                navigator.vibrate(pattern);
            }
        } catch (e) {
            console.error('Vibration error:', e);
        }
    }

    // Test vibration function
    function testVibration() {
        if (!hasVibration) {
            if (isIOS) {
                statusEl.textContent = 'Vibration not supported on iOS Safari';
            } else {
                statusEl.textContent = 'Vibration not supported on this device';
            }
            return;
        }
        
        statusEl.textContent = 'Testing vibration...';
        vibrate([200, 100, 200]); // Short test pattern
        
        setTimeout(() => {
            statusEl.textContent = 'Vibration test complete';
        }, 1000);
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
        
        let timeStr;
        if (showSeconds) {
            timeStr = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit', 
                second: '2-digit'
            });
        } else {
            timeStr = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
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
                
                // Play each dot or dash in the character
                for (let j = 0; j < morse.length; j++) {
                    const symbol = morse[j];
                    
                    if (symbol === '•') {
                        // Dot
                        await playBeep(600, dotDuration);
                        // Simple vibration for each character instead of complex patterns
                        if (vibrationEnabled && hasVibration) {
                            vibrate(100); // Short vibration for dot
                        }
                        if (j < morse.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, gapDuration));
                        }
                    } else if (symbol === '−') {
                        // Dash
                        await playBeep(600, dashDuration);
                        if (vibrationEnabled && hasVibration) {
                            vibrate(300); // Long vibration for dash
                        }
                        if (j < morse.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, gapDuration));
                        }
                    }
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
        
        // Test vibration when enabled
        if (vibrationEnabled) {
            testVibration();
        }
    });

    secondsToggleEl.addEventListener('click', function() {
        showSeconds = !showSeconds;
        this.textContent = showSeconds ? '⏱️ Hide Seconds' : '⏱️ Show Seconds';
        this.classList.toggle('active', showSeconds);
        
        // Immediately update the time display
        updateTime();
    });

    playMorseEl.addEventListener('click', function() {
        if (!isPlaying) {
            playMorseTime();
        }
    });

    testVibrationEl.addEventListener('click', function() {
        testVibration();
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
        if (currentMinute !== lastMinute && soundEnabled && !isPlaying && !showSeconds) {
            // Auto-play only when seconds are hidden (less intrusive)
            // Uncomment the next line if you want auto-play every minute
            // playMorseTime();
        }
        lastMinute = currentMinute;
    }, 1000);

    // Set initial status
    let deviceInfo = 'Desktop';
    if (isMobile) {
        if (hasVibration) {
            deviceInfo = 'Mobile (Vibration supported)';
        } else if (isIOS) {
            deviceInfo = 'iOS (Vibration not supported by Safari)';
        } else {
            deviceInfo = 'Mobile (Vibration not available)';
        }
    }
    statusEl.textContent = `Ready (${deviceInfo})`;
    
    // Hide vibration control if not supported
    if (!hasVibration) {
        vibrationToggleEl.style.display = 'none';
        testVibrationEl.style.display = 'none';
    } else {
        testVibrationEl.style.display = 'inline-block';
    }
});
