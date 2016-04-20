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

  getVerticalTick(d, units) {
    switch (units) {
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
    return { top: 20, right: 100, bottom: 50, left: 50 };
  },

  // FIXME can this be done better with Slate?
  getAssertionStatus(dataPoint) {
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

  render() {
    // d3 indentation conventions are kinda wacky, so...
    /* eslint-disable indent */
    const data = this.getData();

    if (!data.length) {
      return <div>no data</div>;
    }

    const margin = this.getMargin();
    const width = this.state.width - margin.left - margin.right;
    const height = (0.5 * this.state.width) - margin.top - margin.bottom;

    const yMax = Math.max(this.props.threshold, d3.max(data, d => d.value));

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
      .ticks(Math.max(width/40, 5)) // horizontal tick every 20px
      .tickFormat(timestamp => {
        const now = moment();
        const minAgo = now.diff(moment(timestamp), 'minutes');
        return `-${minAgo} min`;
      });

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(Math.max(height/40, 5)) // horizontal tick every 20px
      .tickSize(-width, 0, 0) // for the guidelines to be full-width
      .tickFormat(d => this.getVerticalTick(d, this.props.metric.units));

    // Create the line
    const line = d3.svg.line()
      .interpolate('monotone')
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
      .attr('class', style.tick);

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

    // Configure the y-axis ticks
    yAxisGroup.selectAll('text')
      .attr('class', style.tick);

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
        .attr('height', y(this.props.threshold));

    svg.append('clipPath')
        .attr('id', 'clip-below')
      .append('rect')
        .attr('y', y(this.props.threshold))
        .attr('width', width)
        .attr('height', height - y(this.props.threshold));

    // Append the threshold line
    svg.append('line')
      .attr('class', style.thresholdLine)
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(this.props.threshold))
      .attr('y2', y(this.props.threshold));

    svg.selectAll(style.line)
        .data(['Above', 'Below'])
      .enter().append('path')
        .attr('class', d => cx(style[this.props.relationship], style.line + d))
        .attr('clip-path', d => 'url(#clip-' + d.toLowerCase() + ')')
        .datum(data)
        .attr('d', line);

        // Append the data points
    svg.append('g')
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
      const tooltipDimensions = { height: 35, width: 70 };

      const tooltipGroup = svg.selectAll('.js-tooltip-group')
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