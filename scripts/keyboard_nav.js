document.addEventListener('DOMContentLoaded', () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const links = Array.from(document.querySelectorAll('a')).filter(a => {
    return !a.getAttribute('href')?.startsWith('#') && !a.dataset.ignoreHotkey;
  });

  links.forEach((link, idx) => {
    if (idx < letters.length) {
      const key = letters[idx];
      const span = document.createElement('span');
      span.className = 'hotkey';
      span.textContent = `[${key}] `;
      link.prepend(span);
      link.dataset.hotkey = key;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
      return; // ignore if typing in an input or textarea
    }
    const key = e.key.toLowerCase();
    const target = document.querySelector(`a[data-hotkey="${key}"]`);
    if (target) {
      window.location.href = target.href;
    }
  });
});
