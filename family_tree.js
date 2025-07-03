"use strict";

// Basic GEDCOM parser and visualizations using D3

function checkPassword() {
  var input = document.getElementById('passwordInput').value;
  if (input === 'fam2025') {
    document.getElementById('passwordOverlay').style.display = 'none';
  } else {
    document.getElementById('passwordError').textContent = 'Incorrect password';
  }
}
document.getElementById('passwordButton').addEventListener('click', checkPassword);
document.getElementById('passwordInput').addEventListener('keyup', function (e) {
  if (e.key === 'Enter') checkPassword();
});
document.getElementById('parseButton').addEventListener('click', function () {
  var text = document.getElementById('gedcomInput').value;
  var data = parseGedcom(text);
  var rootId = Object.keys(data.individuals)[0];
  if (!rootId) return;
  createForceGraph(data);
  createDescendantTree(data, rootId);
  createAncestorTree(data, rootId);
  createBirthYearHistogram(data);
  createGenderPie(data);
  createFamilySizeBar(data);
  createGenerationChart(data, rootId);
  createAgeScatter(data, rootId);
  generateInsights(data, rootId);
});
document.getElementById('textButton').addEventListener('click', function () {
  var text = document.getElementById('gedcomInput').value;
  var data = parseGedcom(text);
  var rootId = Object.keys(data.individuals)[0];
  if (!rootId) return;
  createTextTree(data, rootId);
});
function parseGedcom(text) {
  var lines = text.split(/\r?\n/);
  var individuals = {};
  var families = {};
  var current = null;
  var currentTag = null;
  lines.forEach(function (line) {
    var m = line.match(/^(\d+) (?:@([^@]+)@ )?([A-Z0-9_]+)(?: (.*))?$/);
    if (!m) return;
    var level = +m[1];
    var xref = m[2];
    var tag = m[3];
    var data = m[4];
    if (level === 0) {
      currentTag = tag;
      if (tag === 'INDI') {
        current = {
          id: xref,
          name: '',
          famc: null,
          fams: null,
          sex: '',
          birthYear: null
        };
        individuals[xref] = current;
      } else if (tag === 'FAM') {
        current = {
          id: xref,
          husb: null,
          wife: null,
          chil: []
        };
        families[xref] = current;
      } else {
        current = null;
      }
    } else if (current) {
      if (individuals[current.id]) {
        if (tag === 'NAME') current.name = data;else if (tag === 'FAMC') current.famc = data;else if (tag === 'FAMS') current.fams = data;else if (tag === 'SEX') current.sex = data;else if (tag === 'BIRT') {
          currentTag = 'BIRT';
        } else if (currentTag === 'BIRT' && tag === 'DATE') {
          var _m = data.match(/(\d{4})$/);
          if (_m) current.birthYear = +_m[1];
        }
      } else if (families[current.id]) {
        if (tag === 'HUSB') families[current.id].husb = data;else if (tag === 'WIFE') families[current.id].wife = data;else if (tag === 'CHIL') families[current.id].chil.push(data);
      }
    }
  });
  return {
    individuals: individuals,
    families: families
  };
}
function getName(ind) {
  return ind && ind.name ? ind.name.replace(/\//g, '') : ind.id;
}
function createForceGraph(data) {
  var nodes = Object.values(data.individuals).map(function (ind) {
    return {
      id: ind.id,
      name: getName(ind),
      sex: ind.sex
    };
  });
  var links = [];
  Object.values(data.families).forEach(function (fam) {
    if (fam.husb && fam.wife) {
      links.push({
        source: fam.husb,
        target: fam.wife,
        spouse: true
      });
    }
    fam.chil.forEach(function (c) {
      if (fam.husb) links.push({
        source: fam.husb,
        target: c
      });
      if (fam.wife) links.push({
        source: fam.wife,
        target: c
      });
    });
  });
  var svg = d3.select('#forceViz');
  svg.selectAll('*').remove();
  var width = +svg.attr('width');
  var height = +svg.attr('height');
  var g = svg.append('g');
  var zoom = d3.zoom().on('zoom', function (event) {
    return g.attr('transform', event.transform);
  });
  svg.call(zoom);
  var simulation = d3.forceSimulation(nodes).force('link', d3.forceLink(links).id(function (d) {
    return d.id;
  }).distance(function (d) {
    return d.spouse ? 40 : 80;
  })).force('charge', d3.forceManyBody().strength(-300)).force('center', d3.forceCenter(width / 2, height / 2)).force('collide', d3.forceCollide(20));
  var link = g.append('g').attr('stroke', '#555').selectAll('line').data(links).enter().append('line').attr('stroke-width', function (d) {
    return d.spouse ? 2 : 1.5;
  });
  var node = g.append('g').attr('stroke', '#fff').selectAll('circle').data(nodes).enter().append('circle').attr('r', 8).attr('fill', function (d) {
    return d.sex === 'M' ? '#79b' : d.sex === 'F' ? '#b79' : '#888';
  }).call(drag(simulation));
  node.append('title').text(function (d) {
    return d.name;
  });
  var text = g.append('g').selectAll('text').data(nodes).enter().append('text').attr('x', 12).attr('y', '0.31em').text(function (d) {
    return d.name;
  }).attr('fill', 'white').style('font-size', '12px');
  simulation.on('tick', function () {
    link.attr('x1', function (d) {
      return d.source.x;
    }).attr('y1', function (d) {
      return d.source.y;
    }).attr('x2', function (d) {
      return d.target.x;
    }).attr('y2', function (d) {
      return d.target.y;
    });
    node.attr('cx', function (d) {
      return d.x;
    }).attr('cy', function (d) {
      return d.y;
    });
    text.attr('transform', function (d) {
      return "translate(".concat(d.x, ",").concat(d.y, ")");
    });
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
  var ind = data.individuals[id];
  var node = {
    name: getName(ind),
    children: []
  };
  if (ind && ind.fams) {
    var fam = data.families[ind.fams];
    if (fam) fam.chil.forEach(function (c) {
      return node.children.push(buildDescendantTree(c, data));
    });
  }
  return node;
}
function createDescendantTree(data, rootId) {
  var root = d3.hierarchy(buildDescendantTree(rootId, data));
  var svg = d3.select('#descendantViz');
  svg.selectAll('*').remove();
  var width = +svg.attr('width');
  var dx = 20,
    dy = width / 4;
  var tree = d3.tree().nodeSize([dx, dy]);
  var rootLayout = tree(root);
  var x0 = Infinity,
    x1 = -Infinity;
  rootLayout.each(function (d) {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });
  svg.attr('viewBox', [-dy / 3, x0 - dx, width, x1 - x0 + dx * 2]);
  var g = svg.append('g').attr('font-size', 10).attr('fill', 'white');
  svg.call(d3.zoom().on('zoom', function (e) {
    return g.attr('transform', e.transform);
  }));
  var link = g.append('g').selectAll('path').data(rootLayout.links()).enter().append('path').attr('fill', 'none').attr('stroke', '#555').attr('d', d3.linkHorizontal().x(function (d) {
    return d.y;
  }).y(function (d) {
    return d.x;
  }));
  var node = g.append('g').selectAll('g').data(rootLayout.descendants()).enter().append('g').attr('transform', function (d) {
    return "translate(".concat(d.y, ",").concat(d.x, ")");
  });
  node.append('circle').attr('r', 5).attr('fill', '#69b');
  node.append('title').text(function (d) {
    return d.data.name;
  });
  node.append('text').attr('dy', 3).attr('x', function (d) {
    return d.children ? -8 : 8;
  }).attr('text-anchor', function (d) {
    return d.children ? 'end' : 'start';
  }).text(function (d) {
    return d.data.name;
  });
}
function buildAncestorTree(id, data) {
  var ind = data.individuals[id];
  var node = {
    name: getName(ind),
    children: []
  };
  if (ind && ind.famc) {
    var fam = data.families[ind.famc];
    if (fam) {
      if (fam.husb) node.children.push(buildAncestorTree(fam.husb, data));
      if (fam.wife) node.children.push(buildAncestorTree(fam.wife, data));
    }
  }
  return node;
}
function createAncestorTree(data, rootId) {
  var root = d3.hierarchy(buildAncestorTree(rootId, data));
  var svg = d3.select('#ancestorViz');
  svg.selectAll('*').remove();
  var width = +svg.attr('width');
  var radius = width / 2;
  var tree = d3.tree().size([2 * Math.PI, radius - 40]);
  var rootLayout = tree(root);
  var g = svg.append('g').attr('transform', "translate(".concat(radius, ",").concat(radius, ")"));
  svg.call(d3.zoom().on('zoom', function (e) {
    return g.attr('transform', "translate(".concat(radius, ",").concat(radius, ") scale(").concat(e.transform.k, ")"));
  }));
  g.append('g').selectAll('path').data(rootLayout.links()).enter().append('path').attr('fill', 'none').attr('stroke', '#555').attr('d', d3.linkRadial().angle(function (d) {
    return d.x;
  }).radius(function (d) {
    return d.y;
  }));
  var node = g.append('g').selectAll('g').data(rootLayout.descendants()).enter().append('g').attr('transform', function (d) {
    return "rotate(".concat(d.x * 180 / Math.PI - 90, ") translate(").concat(d.y, ",0)");
  });
  node.append('circle').attr('r', 5).attr('fill', '#69b');
  node.append('title').text(function (d) {
    return d.data.name;
  });
  node.append('text').attr('dy', '0.31em').attr('x', function (d) {
    return d.x < Math.PI ? 8 : -8;
  }).attr('text-anchor', function (d) {
    return d.x < Math.PI ? 'start' : 'end';
  }).attr('transform', function (d) {
    return d.x >= Math.PI ? 'rotate(180)' : null;
  }).text(function (d) {
    return d.data.name;
  }).attr('fill', 'white');
}
function createBirthYearHistogram(data) {
  var years = Object.values(data.individuals).map(function (d) {
    return d.birthYear;
  }).filter(function (y) {
    return y;
  });
  if (years.length === 0) return;
  var bins = d3.histogram().thresholds(10)(years);
  var svg = d3.select('#birthYearViz');
  svg.selectAll('*').remove();
  var width = +svg.attr('width');
  var height = +svg.attr('height');
  var x = d3.scaleLinear().domain([d3.min(years), d3.max(years)]).range([40, width - 20]);
  var y = d3.scaleLinear().domain([0, d3.max(bins, function (b) {
    return b.length;
  })]).range([height - 20, 20]);
  var g = svg.append('g');
  g.append('g').attr('transform', "translate(0,".concat(height - 20, ")")).call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('d'))).attr('color', 'white');
  g.append('g').attr('transform', 'translate(40,0)').call(d3.axisLeft(y)).attr('color', 'white');
  g.selectAll('rect').data(bins).enter().append('rect').attr('x', function (d) {
    return x(d.x0);
  }).attr('y', function (d) {
    return y(d.length);
  }).attr('width', function (d) {
    return Math.max(0, x(d.x1) - x(d.x0) - 1);
  }).attr('height', function (d) {
    return y(0) - y(d.length);
  }).attr('fill', '#69b');
}
function createGenderPie(data) {
  var counts = {
    M: 0,
    F: 0,
    U: 0
  };
  Object.values(data.individuals).forEach(function (ind) {
    if (ind.sex === 'M') counts.M++;else if (ind.sex === 'F') counts.F++;else counts.U++;
  });
  var svg = d3.select('#genderViz');
  svg.selectAll('*').remove();
  var width = +svg.attr('width');
  var height = +svg.attr('height');
  var radius = Math.min(width, height) / 2 - 10;
  var g = svg.append('g').attr('transform', "translate(".concat(width / 2, ",").concat(height / 2, ")"));
  var pie = d3.pie().value(function (d) {
    return d[1];
  });
  var arc = d3.arc().outerRadius(radius).innerRadius(0);
  var dataArr = Object.entries(counts);
  var color = d3.scaleOrdinal().domain(['M', 'F', 'U']).range(['#79b', '#b79', '#888']);
  g.selectAll('path').data(pie(dataArr)).enter().append('path').attr('d', arc).attr('fill', function (d) {
    return color(d.data[0]);
  });
  g.selectAll('text').data(pie(dataArr)).enter().append('text').attr('transform', function (d) {
    return "translate(".concat(arc.centroid(d), ")");
  }).attr('text-anchor', 'middle').attr('fill', 'white').text(function (d) {
    return d.data[0] + ' ' + d.data[1];
  });
}
function createFamilySizeBar(data) {
  var sizes = Object.values(data.families).map(function (f) {
    return f.chil.length;
  });
  if (sizes.length === 0) return;
  var svg = d3.select('#familySizeViz');
  svg.selectAll('*').remove();
  var width = +svg.attr('width');
  var height = +svg.attr('height');
  var x = d3.scaleBand().domain(d3.range(sizes.length)).range([40, width - 20]).padding(0.1);
  var y = d3.scaleLinear().domain([0, d3.max(sizes)]).range([height - 20, 20]);
  var g = svg.append('g');
  g.append('g').attr('transform', "translate(0,".concat(height - 20, ")")).call(d3.axisBottom(x)).attr('color', 'white');
  g.append('g').attr('transform', 'translate(40,0)').call(d3.axisLeft(y)).attr('color', 'white');
  g.selectAll('rect').data(sizes).enter().append('rect').attr('x', function (d, i) {
    return x(i);
  }).attr('y', function (d) {
    return y(d);
  }).attr('width', x.bandwidth()).attr('height', function (d) {
    return y(0) - y(d);
  }).attr('fill', '#9b6');
}
function createGenerationChart(data, rootId) {
  var levels = {};
  function walk(id, depth) {
    if (!id || !data.individuals[id]) return;
    levels[depth] = (levels[depth] || 0) + 1;
    var ind = data.individuals[id];
    if (ind.fams) {
      var fam = data.families[ind.fams];
      if (fam) fam.chil.forEach(function (c) {
        return walk(c, depth + 1);
      });
    }
  }
  walk(rootId, 0);
  var entries = Object.entries(levels).sort(function (a, b) {
    return +a[0] - +b[0];
  });
  var svg = d3.select('#generationViz');
  svg.selectAll('*').remove();
  var width = +svg.attr('width');
  var height = +svg.attr('height');
  var x = d3.scaleBand().domain(entries.map(function (e) {
    return e[0];
  })).range([40, width - 20]).padding(0.1);
  var y = d3.scaleLinear().domain([0, d3.max(entries, function (e) {
    return e[1];
  })]).range([height - 20, 20]);
  var g = svg.append('g');
  g.append('g').attr('transform', "translate(0,".concat(height - 20, ")")).call(d3.axisBottom(x)).attr('color', 'white');
  g.append('g').attr('transform', 'translate(40,0)').call(d3.axisLeft(y)).attr('color', 'white');
  g.selectAll('rect').data(entries).enter().append('rect').attr('x', function (d) {
    return x(d[0]);
  }).attr('y', function (d) {
    return y(d[1]);
  }).attr('width', x.bandwidth()).attr('height', function (d) {
    return y(0) - y(d[1]);
  }).attr('fill', '#6b9');
}
function createAgeScatter(data, rootId) {
  var root = data.individuals[rootId];
  if (!root || root.birthYear == null) return;
  var rootYear = root.birthYear;
  var entries = Object.values(data.individuals).filter(function (d) {
    return d.birthYear != null;
  }).map(function (d) {
    return {
      id: d.id,
      name: getName(d),
      age: d.birthYear - rootYear
    };
  });
  var svg = d3.select('#ageScatterViz');
  svg.selectAll('*').remove();
  var width = +svg.attr('width');
  var height = +svg.attr('height');
  var x = d3.scaleLinear().domain(d3.extent(entries, function (e) {
    return e.age;
  })).range([40, width - 20]);
  var y = d3.scaleBand().domain(entries.map(function (e) {
    return e.name;
  })).range([20, height - 20]);
  var g = svg.append('g');
  g.append('g').attr('transform', "translate(0,".concat(height - 20, ")")).call(d3.axisBottom(x)).attr('color', 'white');
  g.append('g').attr('transform', 'translate(40,0)').call(d3.axisLeft(y)).attr('color', 'white');
  g.selectAll('circle').data(entries).enter().append('circle').attr('cx', function (d) {
    return x(d.age);
  }).attr('cy', function (d) {
    return y(d.name) + y.bandwidth() / 2;
  }).attr('r', 4).attr('fill', '#b69');
}
function generateInsights(data, rootId) {
  var totalInd = Object.keys(data.individuals).length;
  var totalFam = Object.keys(data.families).length;
  var years = Object.values(data.individuals).map(function (d) {
    return d.birthYear;
  }).filter(function (y) {
    return y;
  });
  var minYear = years.length ? d3.min(years) : 'N/A';
  var maxYear = years.length ? d3.max(years) : 'N/A';
  var avgChildren = Object.values(data.families).reduce(function (a, f) {
    return a + f.chil.length;
  }, 0) / Math.max(1, totalFam);
  var lines = ["Individuals: ".concat(totalInd), "Families: ".concat(totalFam), "Earliest Birth Year: ".concat(minYear), "Latest Birth Year: ".concat(maxYear), "Avg Children per Family: ".concat(avgChildren.toFixed(2))];
  document.getElementById('insights').textContent = lines.join('\n');
}

function createTextTree(data, rootId) {
  var root = buildDescendantTree(rootId, data);
  var lines = [];
  (function walk(node, depth) {
    lines.push(Array(depth * 2 + 1).join(' ') + node.name);
    (node.children || []).forEach(function(c){ walk(c, depth + 1); });
  })(root, 0);
  document.getElementById('textOutput').textContent = lines.join('\n');
}
