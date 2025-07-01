// Basic GEDCOM parser and visualizations using D3

function checkPassword() {
  const input = document.getElementById('passwordInput').value;
  if (input === 'fam2025') {
    document.getElementById('passwordOverlay').style.display = 'none';
  } else {
    document.getElementById('passwordError').textContent = 'Incorrect password';
  }
}

document.getElementById('passwordButton').addEventListener('click', checkPassword);
document.getElementById('passwordInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') checkPassword();
});

document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('gedcomInput').value = ev.target.result;
    document.getElementById('parseButton').click();
  };
  reader.readAsText(file);
});

document.getElementById('parseButton').addEventListener('click', () => {
  const text = document.getElementById('gedcomInput').value;
  const data = parseGedcom(text);
  createForceGraph(data);
  createDescendantTree(data, 'I6000000196041121844');
  createAncestorTree(data, 'I6000000196041121844');
});

function parseGedcom(text) {
  const lines = text.split(/\r?\n/);
  const individuals = {};
  const families = {};
  let current = null;
  let currentTag = null;
  lines.forEach(line => {
    const m = line.match(/^(\d+) (?:@([^@]+)@ )?([A-Z0-9_]+)(?: (.*))?$/);
    if (!m) return;
    const level = +m[1];
    const xref = m[2];
    const tag = m[3];
    const data = m[4];
    if (level === 0) {
      currentTag = tag;
      if (tag === 'INDI') {
        current = { id: xref, name: '', famc: null, fams: null, sex: '', birthYear: null };
        individuals[xref] = current;
      } else if (tag === 'FAM') {
        current = { id: xref, husb: null, wife: null, chil: [] };
        families[xref] = current;
      } else {
        current = null;
      }
    } else if (current) {
      if (individuals[current.id]) {
        if (tag === 'NAME') current.name = data;
        else if (tag === 'FAMC') current.famc = data;
        else if (tag === 'FAMS') current.fams = data;
        else if (tag === 'SEX') current.sex = data;
        else if (tag === 'BIRT') {
          currentTag = 'BIRT';
        } else if (currentTag === 'BIRT' && tag === 'DATE') {
          const m = data.match(/(\d{4})$/);
          if (m) current.birthYear = +m[1];
        }
      } else if (families[current.id]) {
        if (tag === 'HUSB') families[current.id].husb = data;
        else if (tag === 'WIFE') families[current.id].wife = data;
        else if (tag === 'CHIL') families[current.id].chil.push(data);
      }
    }
  });
  return { individuals, families };
}

function getName(ind) {
  return ind && ind.name ? ind.name.replace(/\//g, '') : ind.id;
}

function createForceGraph(data) {
  const nodes = Object.values(data.individuals).map(ind => ({
    id: ind.id,
    name: getName(ind),
    sex: ind.sex
  }));
  const links = [];
  Object.values(data.families).forEach(fam => {
    if (fam.husb && fam.wife) {
      links.push({ source: fam.husb, target: fam.wife, spouse: true });
    }
    fam.chil.forEach(c => {
      if (fam.husb) links.push({ source: fam.husb, target: c });
      if (fam.wife) links.push({ source: fam.wife, target: c });
    });
  });
  const svg = d3.select('#forceViz');
  svg.selectAll('*').remove();
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const g = svg.append('g');
  const zoom = d3.zoom().on('zoom', (event) => g.attr('transform', event.transform));
  svg.call(zoom);

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.spouse ? 40 : 80))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(20));

  const link = g.append('g').attr('stroke', '#555').selectAll('line')
    .data(links).enter().append('line')
    .attr('stroke-width', d => d.spouse ? 2 : 1.5);

  const node = g.append('g').attr('stroke', '#fff').selectAll('circle')
    .data(nodes).enter().append('circle')
    .attr('r', 8)
    .attr('fill', d => d.sex === 'M' ? '#79b' : d.sex === 'F' ? '#b79' : '#888')
    .call(drag(simulation));

  node.append('title').text(d => d.name);

  const text = g.append('g').selectAll('text')
    .data(nodes).enter().append('text')
    .attr('x', 12).attr('y', '0.31em')
    .text(d => d.name).attr('fill', 'white').style('font-size', '12px');

  simulation.on('tick', () => {
    link.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node.attr('cx', d => d.x).attr('cy', d => d.y);
    text.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}

function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
}

function buildDescendantTree(id, data) {
  const ind = data.individuals[id];
  const node = { name: getName(ind), children: [] };
  if (ind && ind.fams) {
    const fam = data.families[ind.fams];
    if (fam) fam.chil.forEach(c => node.children.push(buildDescendantTree(c, data)));
  }
  return node;
}

function createDescendantTree(data, rootId) {
  const root = d3.hierarchy(buildDescendantTree(rootId, data));
  const svg = d3.select('#descendantViz');
  svg.selectAll('*').remove();
  const width = +svg.attr('width');
  const dx = 20, dy = width / 4;
  const tree = d3.tree().nodeSize([dx, dy]);
  const rootLayout = tree(root);
  let x0 = Infinity, x1 = -Infinity;
  rootLayout.each(d => { if (d.x > x1) x1 = d.x; if (d.x < x0) x0 = d.x; });
  svg.attr('viewBox', [ -dy / 3, x0 - dx, width, x1 - x0 + dx * 2 ]);

  const g = svg.append('g').attr('font-size', 10).attr('fill', 'white');
  svg.call(d3.zoom().on('zoom', e => g.attr('transform', e.transform)));
  const link = g.append('g').selectAll('path')
    .data(rootLayout.links()).enter().append('path')
    .attr('fill', 'none').attr('stroke', '#555')
    .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x));
  const node = g.append('g').selectAll('g')
    .data(rootLayout.descendants()).enter().append('g')
    .attr('transform', d => `translate(${d.y},${d.x})`);
  node.append('circle').attr('r', 5).attr('fill', '#69b');
  node.append('title').text(d => d.data.name);
  node.append('text').attr('dy', 3).attr('x', d => d.children ? -8 : 8)
    .attr('text-anchor', d => d.children ? 'end' : 'start')
    .text(d => d.data.name);
}

function buildAncestorTree(id, data) {
  const ind = data.individuals[id];
  const node = { name: getName(ind), children: [] };
  if (ind && ind.famc) {
    const fam = data.families[ind.famc];
    if (fam) {
      if (fam.husb) node.children.push(buildAncestorTree(fam.husb, data));
      if (fam.wife) node.children.push(buildAncestorTree(fam.wife, data));
    }
  }
  return node;
}

function createAncestorTree(data, rootId) {
  const root = d3.hierarchy(buildAncestorTree(rootId, data));
  const svg = d3.select('#ancestorViz');
  svg.selectAll('*').remove();
  const width = +svg.attr('width');
  const radius = width / 2;
  const tree = d3.tree().size([2 * Math.PI, radius - 40]);
  const rootLayout = tree(root);
  const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);
  svg.call(d3.zoom().on('zoom', e => g.attr('transform', `translate(${radius},${radius}) scale(${e.transform.k})`)));
  g.append('g').selectAll('path')
    .data(rootLayout.links()).enter().append('path')
    .attr('fill', 'none').attr('stroke', '#555')
    .attr('d', d3.linkRadial().angle(d => d.x).radius(d => d.y));
  const node = g.append('g').selectAll('g')
    .data(rootLayout.descendants()).enter().append('g')
    .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);
  node.append('circle').attr('r', 5).attr('fill', '#69b');
  node.append('title').text(d => d.data.name);
  node.append('text').attr('dy', '0.31em').attr('x', d => d.x < Math.PI ? 8 : -8)
    .attr('text-anchor', d => d.x < Math.PI ? 'start' : 'end')
    .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
    .text(d => d.data.name).attr('fill', 'white');
}

