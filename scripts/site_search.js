// Site-wide spotlight search
// Fetch search index and enable overlay with keyboard shortcut

let searchData = [];

function highlightText(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!escaped) return text;
  return text.replace(new RegExp(escaped, 'gi'), m => `<mark>${m}</mark>`);
}

function createSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'search-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.background = 'rgba(0,0,0,0.75)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'flex-start';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '5vh 1em';
  overlay.style.zIndex = '1000';
  overlay.style.fontFamily = 'Georgia, "Times New Roman", serif';

  const box = document.createElement('div');
  box.style.background = '#fff';
  box.style.color = '#000';
  box.style.borderRadius = '12px';
  box.style.padding = '30px';
  box.style.boxSizing = 'border-box';
  box.style.width = '100%';
  box.style.maxWidth = '600px';
  box.style.maxHeight = '80vh';
  box.style.overflow = 'auto';
  box.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search...';
  input.style.width = '100%';
  input.style.padding = '12px 16px';
  input.style.fontSize = '1.2em';
  input.style.border = 'none';
  input.style.borderBottom = '2px solid #ccc';
  input.style.borderRadius = '4px 4px 0 0';
  input.style.marginBottom = '15px';

  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.margin = '0';
  list.style.padding = '0';
  list.style.maxHeight = '60vh';
  list.style.overflowY = 'auto';
  list.style.borderTop = '1px solid #eee';

  let selectedIndex = -1;

  function updateSelection() {
    const items = list.querySelectorAll('li');
    items.forEach((li, idx) => {
      if (idx === selectedIndex) {
        li.classList.add('active');
        li.scrollIntoView({ block: 'nearest' });
      } else {
        li.classList.remove('active');
      }
    });
  }

  box.appendChild(input);
  box.appendChild(list);
  overlay.appendChild(box);

  const styleTag = document.createElement('style');
  styleTag.textContent = `
    #search-overlay li.active {background:#C41E3A;color:#fff;}
    #search-overlay li.active a {color:#fff;text-decoration:none;}
    #search-overlay mark {background:#FFEB3B;color:inherit;padding:0;}
  `;
  overlay.appendChild(styleTag);
  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
  }

  function renderResults(q) {
    list.innerHTML = '';
    selectedIndex = -1;
    if (!q) return;
    const lcq = q.toLowerCase();
    const results = searchData.filter(item =>
      item.title.toLowerCase().includes(lcq) ||
      item.text.toLowerCase().includes(lcq)
    ).slice(0, 10);
    results.forEach(item => {
      const li = document.createElement('li');
      li.style.margin = '0';
      li.style.padding = '8px 4px';
      li.style.cursor = 'pointer';
      const a = document.createElement('a');
      a.href = item.url;
      a.innerHTML = highlightText(item.title, q);
      a.style.color = '#00246B';
      li.appendChild(a);
      list.appendChild(li);
    });
    updateSelection();
  }

  input.addEventListener('input', () => {
    renderResults(input.value.trim().toLowerCase());
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIndex < list.children.length - 1) selectedIndex++; else selectedIndex = 0;
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIndex > 0) selectedIndex--; else selectedIndex = list.children.length - 1;
      updateSelection();
    } else if (e.key === 'Enter') {
      const item = list.children[selectedIndex];
      if (item) {
        const link = item.querySelector('a');
        if (link) window.location.href = link.href;
      }
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
  if (e.key === '/') {
    e.preventDefault();
    openSearch();
  }
});
