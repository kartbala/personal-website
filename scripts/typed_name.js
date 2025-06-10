document.addEventListener('DOMContentLoaded', function() {
  const text = 'Karthik Balasubramanian';
  const target = document.getElementById('typed-name');
  let index = 0;
  const speed = 80; // milliseconds per character

  function typeNext() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(typeNext, speed);
    }
  }

  typeNext();
});
