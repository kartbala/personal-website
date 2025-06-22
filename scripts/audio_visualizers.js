// Audio Visualizers using microphone input
// Five different visualizations drawn to separate canvases

let audioCtx, analyser, freqData, timeData;
const canvases = [];
const ctxs = [];
let started = false;
const logEl = document.getElementById('debug');

function log(msg) {
  console.log(msg);
  if (logEl) {
    logEl.textContent += msg + '\n';
  }
}

function initAudio() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return Promise.reject(new Error('getUserMedia not supported'));
  }
  if (audioCtx) return Promise.resolve();
  log('Requesting microphone access...');
  return navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    log('Microphone access granted');
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    freqData = new Uint8Array(analyser.frequencyBinCount);
    timeData = new Uint8Array(analyser.fftSize);
  });
}

function setupCanvases() {
  for (let i = 1; i <= 5; i++) {
    const canvas = document.getElementById('v' + i);
    canvases.push(canvas);
    ctxs.push(canvas.getContext('2d'));
  }
}

function start() {
  if (started) return;
  log('Start button clicked');
  started = true;
  const btn = document.getElementById('start');
  if (btn) btn.disabled = true;
  if (!window.isSecureContext) {
    const warn = 'This page is not served over HTTPS. Microphone access will fail.';
    log(warn);
    alert(warn);
    started = false;
    if (btn) btn.disabled = false;
    return;
  }
  initAudio()
    .then(() => {
      log('Audio initialized');
      if (audioCtx.state === 'suspended') {
        return audioCtx.resume().then(() => log('Audio context resumed'));
      }
    })
    .then(() => {
      setupCanvases();
      log('Canvases ready, starting visualization loop');
      requestAnimationFrame(draw);
    })
    .catch(err => {
      started = false;
      if (btn) btn.disabled = false;
      const msg = 'Microphone access denied or unavailable: ' + err.message;
      log('Error: ' + err.message);
      alert(msg);
    });
}

function clearCanvas(ctx, canvas) {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBars(ctx, canvas) {
  const barWidth = canvas.width / freqData.length * 2;
  ctx.fillStyle = '#4ade80';
  for (let i = 0; i < freqData.length; i++) {
    const val = freqData[i];
    const h = val / 255 * canvas.height;
    ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h);
  }
}

function drawRadial(ctx, canvas) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.min(centerX, centerY);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < freqData.length; i++) {
    const angle = i / freqData.length * 2 * Math.PI;
    const radius = (freqData[i] / 255) * maxRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawCircleBars(ctx, canvas) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.min(centerX, centerY) * 0.8;
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 4;
  for (let i = 0; i < freqData.length; i++) {
    const angle = i / freqData.length * 2 * Math.PI;
    const radius = maxRadius + (freqData[i] / 255) * maxRadius * 0.5;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const innerX = centerX + Math.cos(angle) * maxRadius;
    const innerY = centerY + Math.sin(angle) * maxRadius;
    ctx.beginPath();
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function drawMirrorBars(ctx, canvas) {
  const half = canvas.width / 2;
  const barWidth = half / freqData.length * 4;
  ctx.fillStyle = '#facc15';
  for (let i = 0; i < freqData.length; i++) {
    const val = freqData[i];
    const h = val / 255 * canvas.height;
    ctx.fillRect(half + i * barWidth, canvas.height - h, barWidth - 1, h);
    ctx.fillRect(half - i * barWidth - barWidth, canvas.height - h, barWidth - 1, h);
  }
}

function drawWaveform(ctx, canvas) {
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const sliceWidth = canvas.width / timeData.length;
  let x = 0;
  for (let i = 0; i < timeData.length; i++) {
    const v = timeData[i] / 128.0 - 1;
    const y = (v * canvas.height) / 2 + canvas.height / 2;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  ctx.stroke();
}

function draw() {
  analyser.getByteFrequencyData(freqData);
  analyser.getByteTimeDomainData(timeData);

  ctxs.forEach((ctx, idx) => {
    const canvas = canvases[idx];
    clearCanvas(ctx, canvas);
    switch (idx) {
      case 0: drawBars(ctx, canvas); break;
      case 1: drawRadial(ctx, canvas); break;
      case 2: drawCircleBars(ctx, canvas); break;
      case 3: drawMirrorBars(ctx, canvas); break;
      case 4: drawWaveform(ctx, canvas); break;
    }
  });

  requestAnimationFrame(draw);
}

// Attach the click handler immediately since this script is loaded
// after the button element is available in the DOM.
document.getElementById('start').addEventListener('click', start);
