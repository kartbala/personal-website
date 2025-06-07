// Static dataset for United States GDP.
// Replace this array with data loaded based on user input to make it dynamic.

const data = [
  { year: 1960, value: 541988586206.897 },
  { year: 1961, value: 561940310344.828 },
  { year: 1962, value: 603639413793.103 },
  { year: 1963, value: 637058551724.138 },
  { year: 1964, value: 684144620689.655 },
  { year: 1965, value: 741904862068.965 },
  { year: 1966, value: 813032758620.69 },
  { year: 1967, value: 859620034482.759 },
  { year: 1968, value: 940225000000 },
  { year: 1969, value: 1017438172413.79 },
  { year: 1970, value: 1073303000000 },
  { year: 1971, value: 1164850000000 },
  { year: 1972, value: 1279110000000 },
  { year: 1973, value: 1425376000000 },
  { year: 1974, value: 1545243000000 },
  { year: 1975, value: 1684904000000 },
  { year: 1976, value: 1873412000000 },
  { year: 1977, value: 2081826000000 },
  { year: 1978, value: 2351599000000 },
  { year: 1979, value: 2627333000000 },
  { year: 1980, value: 2857307000000 },
  { year: 1981, value: 3207041000000 },
  { year: 1982, value: 3343789000000 },
  { year: 1983, value: 3634038000000 },
  { year: 1984, value: 4037613000000 },
  { year: 1985, value: 4338979000000 },
  { year: 1986, value: 4579631000000 },
  { year: 1987, value: 4855215000000 },
  { year: 1988, value: 5236438000000 },
  { year: 1989, value: 5641580000000 },
  { year: 1990, value: 5963144000000 },
  { year: 1991, value: 6158129000000 },
  { year: 1992, value: 6520327000000 },
  { year: 1993, value: 6858559000000 },
  { year: 1994, value: 7287236000000 },
  { year: 1995, value: 7639749000000 },
  { year: 1996, value: 8073122000000 },
  { year: 1997, value: 8577552000000 },
  { year: 1998, value: 9062817000000 },
  { year: 1999, value: 9631172000000 },
  { year: 2000, value: 10250952000000 },
  { year: 2001, value: 10581929000000 },
  { year: 2002, value: 10929108000000 },
  { year: 2003, value: 11456450000000 },
  { year: 2004, value: 12217196000000 },
  { year: 2005, value: 13039197000000 },
  { year: 2006, value: 13815583000000 },
  { year: 2007, value: 14474228000000 },
  { year: 2008, value: 14769862000000 },
  { year: 2009, value: 14478067000000 },
  { year: 2010, value: 15048971000000 },
  { year: 2011, value: 15599732000000 },
  { year: 2012, value: 16253970000000 },
  { year: 2013, value: 16880683000000 },
  { year: 2014, value: 17608138000000 },
  { year: 2015, value: 18295019000000 },
  { year: 2016, value: 18804913000000 },
  { year: 2017, value: 19612102000000 },
  { year: 2018, value: 20656516000000 },
  { year: 2019, value: 21539982000000 },
  { year: 2020, value: 21354105000000 },
  { year: 2021, value: 23681171000000 },
  { year: 2022, value: 26006893000000 },
  { year: 2023, value: 27720709000000 }
];

const margin = { top: 20, right: 20, bottom: 40, left: 60 };
const svg = d3.select('#chart');
const width = +svg.attr('width');
const height = +svg.attr('height');
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const x = d3.scaleLinear()
  .domain(d3.extent(data, d => d.year))
  .range([0, innerWidth]);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([innerHeight, 0]);

const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

const area = d3.area()
  .defined(d => d.value != null)
  .x(d => x(d.year))
  .y0(innerHeight)
  .y1(d => y(d.value));

// clip path for text
svg.append('clipPath')
  .attr('id', 'text-clip')
  .append('path')
  .datum(data)
  .attr('transform', `translate(${margin.left},${margin.top})`)
  .attr('d', area);

// axes
const xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));
const yAxis = d3.axisLeft(y)
  .ticks(5)
  .tickFormat(d => `$${(d/1e12).toFixed(0)}T`);

g.append('g')
  .attr('class', 'y axis')
  .call(yAxis)
  .call(g => g.selectAll('.tick line')
    .attr('x2', innerWidth)
    .attr('stroke-dasharray', '4'));

g.append('g')
  .attr('class', 'x axis')
  .attr('transform', `translate(0,${innerHeight})`)
  .call(xAxis);

// line with white outline
const line = d3.line()
  .defined(d => d.value != null)
  .x(d => x(d.year))
  .y(d => y(d.value));

g.append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', 'white')
  .attr('stroke-width', 4)
  .attr('d', line);

g.append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', '#222')
  .attr('stroke-width', 2)
  .attr('d', line);

// big masked text
svg.append('text')
  .attr('class', 'country-name')
  .attr('x', width / 2)
  .attr('y', height / 2)
  .attr('clip-path', 'url(#text-clip)')
  .text('UNITED STATES');

svg.append('text')
  .attr('class', 'attribution')
  .attr('x', width - 10)
  .attr('y', height - 10)
  .attr('text-anchor', 'end')
  .text('Data from World Bank');

