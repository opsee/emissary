import d3 from 'd3';
import moment from 'moment';
import React from 'react'; // Not used directly but required in scope
import ReactFauxDOM from 'react-faux-dom';
import style from '../components/graph/graph.css';

/**
 * @param node - ReactFauxDOM node
 * @param {obj[]} data
 * @param {obj} opts
 * @param {int} opts.width
 * @param {int} opts.aspectRatio - calculate height with respect to width
 * @param {number} threshold
 */
export function render(data, opts) {
  if (!data.length) {
    return <div>no data</div>;
  }

  data.forEach(d => {
    d.time = new Date(d.timestamp);
    d.value = +d.value;
  });

  data.sort((a, b) => {
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    return 0; // a must be equal to b
  });

  const margin = {top: 20, right: 20, bottom: 100, left: 50};
  const width = opts.width - margin.left - margin.right;
  const height = (opts.aspectRatio * opts.width) - margin.top - margin.bottom;

  // Set up the x/y scales
  const x = d3.time.scale()
    .domain(d3.extent(data, d => d.time ))
    .range([0, width]);

  const y = d3.scale.linear()
    .domain([0, d3.max(data, d => d.value )])
    .range([height, 0]);

  // Set up the axes
  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(d => moment(d).fromNow());

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  // Create the line
  const line = d3.svg.line()
    .x(d => x(d.time))
    .y(d => y(d.value));

  const node = ReactFauxDOM.createElement('svg');
  const svg = d3.select(node)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g')
    .attr('class', style.xAxis)
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')
      .attr('class', style.xTick);

  svg.append('g')
    .attr('class', style.yAxis)
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Percent (%)');

  svg.append('path')
    .datum(data)
    .attr('class', style.line)
    .attr('d', line);

  // Append the threshold line
  svg.append('line')
    .attr('class', style.thresholdLine)
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(opts.threshold))
    .attr('y2', y(opts.threshold));

  return node.toReact();
}