// Morse Code Translator Script
// Converts user input text to Morse code and optionally plays it

document.addEventListener('DOMContentLoaded', function () {
    const morseCode = {
        'A': '•−', 'B': '−•••', 'C': '−•−•', 'D': '−••', 'E': '•',
        'F': '••−•', 'G': '−−•', 'H': '••••', 'I': '••', 'J': '•−−−',
        'K': '−•−', 'L': '•−••', 'M': '−−', 'N': '−•', 'O': '−−−',
        'P': '•−−•', 'Q': '−−•−', 'R': '•−•', 'S': '•••', 'T': '−',
        'U': '••−', 'V': '•••−', 'W': '•−−', 'X': '−••−', 'Y': '−•−−',
        'Z': '−−••',
        '0': '−−−−−', '1': '•−−−−', '2': '••−−−', '3': '•••−−', '4': '••••−',
        '5': '•••••', '6': '−••••', '7': '−−•••', '8': '−−−••', '9': '−−−−•'
    };

    const inputEl = document.getElementById('input-text');
    const outputEl = document.getElementById('morse-output');
    const soundToggleEl = document.getElementById('sound-toggle');
    const vibrationToggleEl = document.getElementById('vibration-toggle');
    const playEl = document.getElementById('play-morse');
    const statusEl = document.getElementById('status');

    let soundEnabled = true;
    let vibrationEnabled = true;
    let isPlaying = false;
    let audioContext;
    let gainNode;

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

    function vibrate(pattern) {
        if (!vibrationEnabled || !navigator.vibrate) return;
        if (Array.isArray(pattern)) {
            navigator.vibrate(pattern);
        } else if (typeof pattern === 'number') {
            navigator.vibrate(pattern);
        }
    }

    function textToMorse(text) {
        return text.toUpperCase().split('').map(char => {
            if (char === ' ') return '/';
            return morseCode[char] || '?';
        });
    }

    function updateOutput() {
        const text = inputEl.value;
        const morseArr = textToMorse(text);
        outputEl.innerHTML = morseArr.map(code => `<span class="morse-char">${code}</span>`).join(' ');
    }

    async function playMorse() {
        if (isPlaying) return;
        isPlaying = true;
        statusEl.textContent = 'Playing...';
        const morseArr = textToMorse(inputEl.value);
        const dotDuration = 100;
        const dashDuration = 300;
        const gapDuration = 100;
        const charGapDuration = 300;
        const wordGapDuration = 700;

        for (let i = 0; i < morseArr.length; i++) {
            const code = morseArr[i];
            if (code === '/') {
                await new Promise(r => setTimeout(r, wordGapDuration));
                continue;
            }
            for (let j = 0; j < code.length; j++) {
                const symbol = code[j];
                if (symbol === '•') {
                    await playBeep(600, dotDuration);
                    vibrate(100);
                } else if (symbol === '−') {
                    await playBeep(600, dashDuration);
                    vibrate(300);
                }
                if (j < code.length - 1) {
                    await new Promise(r => setTimeout(r, gapDuration));
                }
            }
            if (i < morseArr.length - 1 && morseArr[i + 1] !== '/') {
                await new Promise(r => setTimeout(r, charGapDuration));
            }
        }
        isPlaying = false;
        statusEl.textContent = 'Ready';
    }

    soundToggleEl.addEventListener('click', function () {
        soundEnabled = !soundEnabled;
        this.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
        this.classList.toggle('active', soundEnabled);
        if (soundEnabled && !audioContext) {
            initAudio();
        }
    });

    vibrationToggleEl.addEventListener('click', function () {
        vibrationEnabled = !vibrationEnabled;
        this.textContent = vibrationEnabled ? '📳 Vibration ON' : '📳 Vibration OFF';
        this.classList.toggle('active', vibrationEnabled);
    });

    playEl.addEventListener('click', function () {
        if (!isPlaying) playMorse();
    });

    inputEl.addEventListener('input', updateOutput);

    initAudio();
    updateOutput();
});
