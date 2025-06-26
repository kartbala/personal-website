document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('qr-input');
  const button = document.getElementById('generate-btn');
  let qr;

  function generate() {
    const text = input.value.trim();
    if (!text) return;
    if (qr) {
      document.getElementById('qrcode').innerHTML = '';
    }
    qr = new QRCode(document.getElementById('qrcode'), {
      text: text,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  button.addEventListener('click', generate);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      generate();
    }
  });
});
