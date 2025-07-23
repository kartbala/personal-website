document.addEventListener('DOMContentLoaded', function() {
  const text = "Public Transit trips take 2.5 times longer than driving in DC—the city's mathematical proof you're worth less than half a person if you're too poor, too disabled, too young, or too old to drive";
  const target = document.getElementById('typed-message');
  let index = 0;
  const speed = 50; // ms per character

  function typeNext() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(typeNext, speed);
    }
  }

  typeNext();
});
