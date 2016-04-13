import cx from 'classnames';
import d3 from 'd3';
import moment from 'moment';
import React from 'react'; // Not used directly but required in scope
import ReactFauxDOM from 'react-faux-dom';
import style from '../components/graph/graph.css';

function formatBytes(bytes) {
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  let val = bytes;

  do {
    val /= thresh;
    ++u;
  } while (Math.abs(val) >= thresh && u < units.length - 1);

  return `${val.toFixed(1)} ${units[u]}`;
}

function formatVerticalTick(d, units) {
  switch (units) {
  case 'bytes':
    // TODO better byte rounding
    return formatBytes(d);

  case 'bytes/second':
    return `${d} B/s`;

  case 'count/second':
    return `${d} /s`;

  case 'percent':
    return `${d} %`;

  case 'seconds':
    return `${d} s`;

  default:
    return d;
  }
}

/**
 * @param node - ReactFauxDOM node
 * @param {obj[]} data
 * @param {obj} opts
 * @param {int} opts.width
 * @param {int} opts.aspectRatio - calculate height with respect to width
 * @param {number} threshold
 */
export function render(data, opts) {
  /*eslint-disable indent*/

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

  const margin = {top: 20, right: 20, bottom: 100, left: 100};
  const width = opts.width - margin.left - margin.right;
  const height = (opts.aspectRatio * opts.width) - margin.top - margin.bottom;

  const yMax = Math.max(opts.threshold, d3.max(data, d => d.value));

  // Set up the x/y scales
  const x = d3.time.scale()
    .domain(d3.extent(data, d => d.time ))
    .range([0, width]);

  const y = d3.scale.linear()
    .domain([0, yMax])
    .range([height, 0]);

  // Set up the axes
  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(d => moment(d).fromNow());

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickSize(-width, 0, 0) // for the guidelines to be full-width
    .tickFormat(d => formatVerticalTick(d, opts.metric.units));

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

  // Draw the x-axis
  const xAxisGroup = svg.append('g')
    .attr('class', style.xAxis)
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  // Configure the x-axis ticks
  xAxisGroup.selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)')
    .attr('class', style.xTick);

  // Background colour
  svg.append('rect')
    .attr('class', style.background)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height);

  // Draw the y-axis
  const yAxisGroup = svg.append('g')
    .attr('class', style.yAxis)
    .call(yAxis);

  // Configure the x-axis ticks
  yAxisGroup.selectAll('text')
    .attr('class', style.yTick);

  // Colour the minor y-axes
  yAxisGroup.selectAll('g')
    .filter(d => d)
    .attr('class', style.yGuide);

  // The data line
  svg.append('path')
    .datum(data)
    .attr('class', style.line)
    .attr('d', line);

  // Clipping paths to color the line above/below the threshold
  svg.append('clipPath')
      .attr('id', 'clip-above')
    .append('rect')
      .attr('width', width)
      .attr('height', y(opts.threshold));

  svg.append('clipPath')
      .attr('id', 'clip-below')
    .append('rect')
      .attr('y', y(opts.threshold))
      .attr('width', width)
      .attr('height', height - y(opts.threshold));

  // Append the threshold line
  svg.append('line')
    .attr('class', style.thresholdLine)
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(opts.threshold))
    .attr('y2', y(opts.threshold));

  svg.selectAll(style.line)
      .data(['Above', 'Below'])
    .enter().append('path')
      .attr('class', d => cx(style[opts.relationship], style.line + d))
      .attr('clip-path', d => 'url(#clip-' + d.toLowerCase() + ')')
      .datum(data)
      .attr('d', line);
  /*eslint-enable indent*/

  const jsx = node.toReact();
  return jsx;
}