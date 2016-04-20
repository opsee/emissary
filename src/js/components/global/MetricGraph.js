import _ from 'lodash';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactFauxDOM from 'react-faux-dom';
import cx from 'classnames';
import d3 from 'd3';
import moment from 'moment';
import style from './metricGraph.css';

export default React.createClass({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      unit: PropTypes.string,
      value: PropTypes.number.isRequired
    })).isRequired,

    metric: PropTypes.shape({
      name: PropTypes.string,
      units: PropTypes.string,
      description: PropTypes.string
    }).isRequired,

    relationship: PropTypes.oneOf(['lessThan', 'greaterThan']).isRequired,
    threshold: PropTypes.number
  },

  componentDidMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.state.debouncedWindowResize);
  },

  componentWillReceiveProps() {
    this.state.debouncedWindowResize();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.state.debouncedWindowResize);
  },

  getDefaultProps() {
    return {
      aspectRatio: 0.5,
      breakpoint: 700, // px
      data: [],
      metric: {},
      threshold: 0,
      showTooltip: true
    };
  },

  getInitialState() {
    return {
      width: 0,
      debouncedWindowResize: _.debounce(this.onWindowResize, 50)
    };
  },

  getBytes(bytes) {
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
  },

  getVerticalTick(d) {
    switch (this.props.metric.units) {
    case 'bytes':
      // TODO better byte rounding
      return this.getBytes(d);

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
  },

  getData() {
    return _.map(this.props.data, d => {
      return _.assign({}, d, {
        time: new Date(d.timestamp),
        value: +d.value
      });
    });
  },

  getMargin() {
    return {
      top: 25,
      right: 100,
      bottom: 50,
      left: 50
    };
  },

  getTooltipDimensions() {
    return {
      height: 35,
      width: 70
    };
  },

  getAssertionStatus(dataPoint) {
    // FIXME can this be done better with Slate?
    const value = Number(dataPoint.value);
    const threshold = Number(this.props.threshold);

    if (this.props.relationship === 'lessThan') {
      return value < threshold;
    } else if (this.props.relationship === 'greaterThan') {
      return value > threshold;
    }

    return null;
  },

  getPassFail(dataPoint) {
    const isPassing = this.getAssertionStatus(dataPoint);
    return isPassing ? 'Passing' : 'Failing';
  },

  isSmallScreen() {
    return this.state.width < this.props.breakpoint;
  },

  /*
   * On window resizes, explicitly set the width of the d3 svg.
   * (d3 graphs are unfortunately not responsive out of the box; luckily,
   * React state is a good fit for this.)
   */
  onWindowResize() {
    const elem = ReactDOM.findDOMNode(this);
    const width = elem.parentNode.offsetWidth;
    this.setState({ width });
  },

  renderPlaceholder() {
    return (
      <div>no data</div>
    );
  },

  render() {
    const data = this.getData();

    if (!data.length) {
      return this.renderPlaceholder();
    }

    // d3 indentation conventions are kinda wacky, so...
    /* eslint-disable indent */
    const width = this.state.width;
    const height = this.props.aspectRatio * width;
    const margin = this.getMargin();

    // The maximum value for the y-scale should be the maximum of the threshold
    // or the highest data point. This lets the graph resize when the threshold
    // is well above the highest data point.
    const yMax = Math.max(this.props.threshold, d3.max(data, d => d.value));

    // Calculate the dimensions of the graph itself to properly scale the axes.
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    // Set up the x/y scales. These functions map raw data point values to
    // positions on the graph.
    const x = d3.time.scale()
      .domain(d3.extent(data, d => d.time ))
      .range([0, graphWidth]);

    const y = d3.scale.linear()
      .domain([0, yMax])
      .range([graphHeight, 0]);

    // Start drawing the graph!
    const node = ReactFauxDOM.createElement('svg');

    // The main svg container. It fills the full width/height of the parent.
    const outerSVG = d3.select(node)
      .attr('width', width)
      .attr('height', height);

    // Background colour
    outerSVG.append('rect')
      .attr('class', style.background)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height - margin.bottom);

    const svg = outerSVG.append('g')
      .attr('width', width)
      .attr('height', height - margin.bottom - margin.top)
      .attr('transform', `translate(0, ${margin.top})`);

    // Set up the x-axis
    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(Math.max(width/40, 5)) // horizontal tick every 20px
      .tickFormat(timestamp => {
        const now = moment();
        const minAgo = now.diff(moment(timestamp), 'minutes');
        return `-${minAgo} min`;
      });

    // Draw the x-axis
    const xAxisGroup = svg.append('g')
      .attr('class', style.xAxis)
      .attr('transform', `translate(${margin.left}, ${graphHeight})`)
      .call(xAxis);

    // Configure the x-axis ticks
    xAxisGroup.selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')
      .attr('class', style.tick);

    // Set up the y-axis
    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('right')
      .ticks(Math.max(graphHeight/40, 5)) // vertical tick every 20px
      .tickSize(width - margin.right) // for the guidelines to be full-width
      .tickFormat(d => this.getVerticalTick(d));

    // Draw the y-axis
    const yAxisGroup = svg.append('g')
      .attr('class', style.yAxis)
      .call(yAxis);

    // Configure the y-axis ticks
    yAxisGroup.selectAll('text')
      .attr('class', style.tick)
      .attr('x', 4)
      .attr('dy', -4);

    // Colour the minor y-axes
    yAxisGroup.selectAll('g')
      .filter(d => d)
      .attr('class', style.yGuide);

    // Create a group to hold the graph
    const graphGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`);

    // Create the line
    const line = d3.svg.line()
      .interpolate('monotone')
      .x(d => x(d.time))
      .y(d => y(d.value));

    // The data line
    graphGroup.append('path')
      .datum(data)
      .attr('class', style.line)
      .attr('d', line);

    // Clipping paths to color the line above/below the threshold
    graphGroup.append('clipPath')
        .attr('id', 'clip-above')
      .append('rect')
        .attr('width', graphWidth)
        .attr('height', y(this.props.threshold));

    graphGroup.append('clipPath')
        .attr('id', 'clip-below')
      .append('rect')
        .attr('y', y(this.props.threshold))
        .attr('width', graphWidth)
        .attr('height', graphHeight - y(this.props.threshold));

    // Append the threshold line
    graphGroup.append('line')
      .attr('class', style.thresholdLine)
      .attr('x1', 0)
      .attr('x2', graphWidth)
      .attr('y1', y(this.props.threshold))
      .attr('y2', y(this.props.threshold));

    // Apply the clipping paths
    graphGroup.selectAll(style.line)
        .data(['Above', 'Below'])
      .enter().append('path')
        .attr('class', d => cx(style[this.props.relationship], style.line + d))
        .attr('clip-path', d => 'url(#clip-' + d.toLowerCase() + ')')
        .datum(data)
        .attr('d', line);

    // Append the current data point
    graphGroup.append('g')
      .selectAll('circle')
      .data([_.last(data)])
      .enter().append('circle')
      .attr('cx', d => x(d.time))
      .attr('cy', d => y(d.value))
      .attr('r', '0.5vmin')
      .attr('class', d => {
        let status = this.getPassFail(d);
        return style[`point${status}`];
      });

    if (this.props.showTooltip) {
      const currentDataPoint = _.last(data);
      const isCurrentPassing = this.getPassFail(currentDataPoint);
      const tooltipClass = style[`tooltip${isCurrentPassing}`];
      const tooltipDimensions = this.getTooltipDimensions();

      const tooltipGroup = graphGroup.selectAll('.js-tooltip-group')
        .data([currentDataPoint])
        .enter().append('g')
        .attr('class', 'js-tooltip-group')
        .attr('transform', d => {
          const dX = x(d.time) + 15; // + left-padding
          const dY = y(d.value) - (tooltipDimensions.height / 2); // vertically center
          return `translate(${dX}, ${dY})`;
        });

      tooltipGroup.selectAll('rect')
        .data([currentDataPoint])
        .enter().append('rect')
        .attr('class', tooltipClass)
        .attr('height', tooltipDimensions.height)
        .attr('width', tooltipDimensions.width);

      tooltipGroup.selectAll('path')
        .data([currentDataPoint])
        .enter().append('path')
          .attr('d', d3.svg.symbol().type('triangle-up'))
          .attr('class', tooltipClass)
          .attr('transform', `translate(0, ${tooltipDimensions.height / 2}) rotate(-90)`)

      tooltipGroup.selectAll('text')
        .data([currentDataPoint])
        .enter().append('text')
        .attr('id', 'tooltipText')
        .attr('class', style.tooltipText)
        .attr('x', tooltipDimensions.width / 2)
        .attr('y', (tooltipDimensions.height / 2) + 5) // + half of font-size, roughly
        .text(d => {
          return this.getAssertionStatus(d) ? 'PASS' : 'FAIL';
        });
    }

    return node.toReact();
  }
});