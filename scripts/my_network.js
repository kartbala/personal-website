// Simple D3 force-directed network

document.addEventListener('DOMContentLoaded', function() {
  const width = window.innerWidth;
  const height = window.innerHeight - 40;

  const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

  const nodes = [
    {id: 'You'},
    {id: 'Family'},
    {id: 'Friends'},
    {id: 'Work'},
    {id: 'Hobbies'},
    {id: 'Learning'}
  ];

  const links = [
    {source: 'You', target: 'Family'},
    {source: 'You', target: 'Friends'},
    {source: 'You', target: 'Work'},
    {source: 'You', target: 'Hobbies'},
    {source: 'You', target: 'Learning'}
  ];

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', 2);

  const node = svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.append('circle')
    .attr('r', 20)
    .attr('fill', '#1c64f2');

  node.append('text')
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .attr('dy', 5)
    .text(d => d.id);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});
