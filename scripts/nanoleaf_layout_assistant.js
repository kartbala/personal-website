document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const scale = 8; // pixels per centimeter
  const dims = {
    triangle: {width: 23, height: 20}, // cm
    hexagon: {width: 23, height: 20},  // point-to-point and side-to-side
    mini: {width: 10, height: 11.5}
  };
  const rotationInput = document.getElementById('rotation');
  let rotation = 0; // degrees
  const shapes = [];
  let currentShape = 'triangle';
  let dragging = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function drawShape(s) {
    const d = dims[s.type];
    const w = d.width * scale;
    const h = d.height * scale;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.beginPath();
    if (s.type === 'triangle' || s.type === 'mini') {
      ctx.moveTo(0, -h/2);
      ctx.lineTo(-w/2, h/2);
      ctx.lineTo(w/2, h/2);
    } else if (s.type === 'hexagon') {
      const r = w/2;
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI/3 * i - Math.PI/6;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function transformToLayout(pos) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const angle = -rotation * Math.PI / 180;
    const dx = pos.x - cx;
    const dy = pos.y - cy;
    return {
      x: dx * Math.cos(angle) - dy * Math.sin(angle) + cx,
      y: dx * Math.sin(angle) + dy * Math.cos(angle) + cy
    };
  }

  function redraw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    shapes.forEach(drawShape);
    ctx.restore();
  }

  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function shapeAt(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      const d = dims[s.type];
      const w = d.width * scale;
      const h = d.height * scale;
      if (x >= s.x - w/2 && x <= s.x + w/2 && y >= s.y - h/2 && y <= s.y + h/2) {
        return s;
      }
    }
    return null;
  }

  canvas.addEventListener('mousedown', e => {
    const pos = transformToLayout(getMousePos(e));
    const hit = shapeAt(pos.x, pos.y);
    if (hit) {
      dragging = hit;
      dragOffsetX = pos.x - hit.x;
      dragOffsetY = pos.y - hit.y;
    } else {
      shapes.push({type: currentShape, x: pos.x, y: pos.y});
      redraw();
    }
  });

  canvas.addEventListener('mousemove', e => {
    if (dragging) {
      const pos = transformToLayout(getMousePos(e));
      dragging.x = pos.x - dragOffsetX;
      dragging.y = pos.y - dragOffsetY;
      redraw();
    }
  });

  canvas.addEventListener('mouseup', () => { dragging = null; });
  canvas.addEventListener('mouseleave', () => { dragging = null; });

  canvas.addEventListener('dblclick', e => {
    const pos = transformToLayout(getMousePos(e));
    const hit = shapeAt(pos.x, pos.y);
    if (hit) {
      shapes.splice(shapes.indexOf(hit), 1);
      redraw();
    }
  });

  document.querySelectorAll('#toolbar button[data-shape]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#toolbar button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentShape = btn.dataset.shape;
    });
  });

  document.getElementById('clear').addEventListener('click', () => {
    shapes.length = 0;
    redraw();
  });

  rotationInput.addEventListener('input', () => {
    rotation = parseInt(rotationInput.value, 10) || 0;
    redraw();
  });

  redraw();
});
