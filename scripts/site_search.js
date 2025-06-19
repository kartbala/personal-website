// Site-wide spotlight search
// Fetch search index and enable overlay with keyboard shortcut

let searchData = [];

function createSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'search-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.background = 'rgba(0,0,0,0.8)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'flex-start';
  overlay.style.justifyContent = 'center';
  overlay.style.paddingTop = '10vh';
  overlay.style.zIndex = '1000';
  overlay.style.fontFamily = 'Georgia, "Times New Roman", serif';

  const box = document.createElement('div');
  box.style.background = '#fff';
  box.style.color = '#000';
  box.style.borderRadius = '8px';
  box.style.padding = '20px';
  box.style.minWidth = '60%';
  box.style.maxWidth = '800px';
  box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search...';
  input.style.width = '100%';
  input.style.padding = '10px';
  input.style.fontSize = '1.2em';
  input.style.border = '1px solid #ccc';
  input.style.borderRadius = '4px';
  input.style.marginBottom = '10px';

  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.margin = '0';
  list.style.padding = '0';
  list.style.maxHeight = '60vh';
  list.style.overflowY = 'auto';

  box.appendChild(input);
  box.appendChild(list);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
  }

  function renderResults(q) {
    list.innerHTML = '';
    if (!q) return;
    const results = searchData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.text.toLowerCase().includes(q)
    ).slice(0, 10);
    results.forEach(item => {
      const li = document.createElement('li');
      li.style.margin = '8px 0';
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      a.style.color = '#0077cc';
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  input.addEventListener('input', () => {
    renderResults(input.value.trim().toLowerCase());
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      close();
    }
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      close();
    }
  });

  input.focus();
}

function openSearch() {
  if (document.getElementById('search-overlay')) return;
  if (searchData.length) {
    createSearchOverlay();
  } else {
    fetch('search_index.json')
      .then(r => r.json())
      .then(data => { searchData = data; createSearchOverlay(); });
  }
}

document.addEventListener('keydown', e => {
  if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
  if (e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
    e.preventDefault();
    openSearch();
  }
});
