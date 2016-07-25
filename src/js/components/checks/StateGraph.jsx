import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import ReactFauxDOM from 'react-faux-dom';
import cx from 'classnames';
import {connect} from 'react-redux';
import _ from 'lodash';
import d3 from 'd3';
import moment from 'moment';
import gantt from '../../modules/gantt';
import style from './stateGraph.css';


d3.gantt = gantt;

const StateGraph = React.createClass({
  propTypes: {
    transitions: PropTypes.array.isRequired,
    current: PropTypes.string.isRequired,
    tickNumber: PropTypes.number
  },
  getDefaultProps() {
    return {
      transitions: [],
      tickNumber: 6
    };
  },
  getInitialState() {
    return {
      width: 0,
      debouncedWindowResize: _.debounce(this.onWindowResize, 50)
    };
  },
  componentDidMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.state.debouncedWindowResize);
  },
  // getData(){
  //   return _.map(this.props.transitions, t => {
  //     return _.assign(t, {
  //       time: new Date(t.occurred_at)
  //     })
  //   })
  // },
  getCoercedState(state){
    switch(state){
    case 'failing':
      return 'FAIL';
    case 'warning':
      return 'WARN'
    default:
      return 'OK';
    }
  },
  getData(filter){
    const start = moment().subtract({hours: 6}).valueOf();
    const end = Date.now();
    const diff = end - start;
    let {current} = this.props;
    current = this.getCoercedState(current);
    const first = _.head(this.props.transitions) || {to: current, from: current}
    const computedFirst = {to: first.from, from: first.from, occurred_at: start}
    const last = _.last(this.props.transitions) || {to: current, from: current}
    const computedLast = {to: last.to, from: last.to, occurred_at: end}
    let data = [computedFirst].concat(this.props.transitions).concat([computedLast]);
    data = _.chain(data)
    .sortBy(d => d.occurred_at)
    .map(d => _.mapValues(d, (value, key) => {
      if (key.match('^to$|^from$')){
        return (value || '').toLowerCase();
      }
      return value;
    }))
    .value();
    data = _.chain(data).map((d, i) => {
      const next = data[i + 1] || computedLast;
      let percent = (next.occurred_at - d.occurred_at) / diff;
      percent = parseFloat((percent * 100).toFixed(2));
      return _.assign(d, {percent});
    })
    .reject(d => filter && !d.percent)
    .value();
    return data;
  },
  getTicks(){
    const data = this.getData();
    const start = _.head(data).occurred_at;
    const end = _.last(data).occurred_at;
    const diff = end - start;
    const divisor = this.props.tickNumber;
    const unit = diff / divisor;
    return _.chain(_.rangeRight(divisor))
    .map(num => {
      const time = end - ((num + 1) * unit);
      const z = 'h';
      const tick = moment().diff(moment(time), z);
      return `-${tick}${z}`;
      const minAgo = now.diff(moment(timestamp), 'minutes');
      return moment(end - ((num + 1) * unit)).fromNow();
    })
    .value();
  },
  getMargin() {
    return {
      top: 25,
      right: 50,
      bottom: 50,
      left: 50
    };
  },
  getItemTitle(d){
    let status = d.to;
    switch (status){
    case 'ok':
      status = 'passing';
      break;
    case 'fail':
      status = 'failing';
      break;
    case 'fail_wait':
    case 'pass_wait':
      status = 'warning';
      break;
    default:
      break;
    }
    return `Check was ${status}`;
  },
  onWindowResize() {
    if (this.isMounted()){
      const elem = ReactDOM.findDOMNode(this);
      const width = _.clamp(elem.parentNode.offsetWidth, 0, Infinity);
      this.setState({ width });
    }
  },
  renderInner(){
    return (
      <div>
        <div className={cx(style.wrapper, style[scheme])}>
          {
            this.getData(true).map(d => {
              return (
                <div className={cx(style.item, style[d.to])} style={{width: `calc(${d.percent}% - 2px)`}} title={this.getItemTitle(d)}/>
              );
            })
          }
        </div>
        <div className={style.yaxis}>
          {this.getTicks().map(t => {
            return (
              <div style={{width: `${100 / this.props.tickNumber}%`}} className={cx(style.tick, style[scheme])}>
                {t}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  renderInnerDang(){
    const data = this.props.transitions || [];
    if (!data.length) {
      return null;
    }
    /* eslint-disable indent */
    const width = this.state.width;
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const height = 300;
    const margin = this.getMargin();

    // The maximum value for the y-scale should be the maximum of the threshold
    // or the highest data point. This lets the graph resize when the threshold
    // is well above the highest data point.
    // const yMax = Math.max(this.props.assertion.operand, d3.max(data, d => d.value)) || 1;
    // //similar for ymin
    // let yMin = Math.min(this.props.assertion.operand, d3.min(data, d => d.value));
    // yMin = yMin > 0 ? 0 : yMin;

    const yMax = 100;
    const yMin = 100;

    // Calculate the dimensions of the graph itself to properly scale the axes.
    const graphWidth = _.clamp(width - margin.left - margin.right, 0, Infinity);
    const graphHeight = _.clamp(height - margin.top - margin.bottom, 0, Infinity);

    // Set up the x/y scales. These functions map raw data point values to
    // positions on the graph.
    const x = d3.time.scale()
      .domain(d3.extent(data, d => d.time ))
      .range([0, graphWidth]);

    const y = d3.scale.linear()
      .domain([yMin, yMax])
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
      .attr('height', _.clamp(height - margin.bottom, 0, Infinity));

    const svg = outerSVG.append('g')
      .attr('width', width)
      .attr('height', _.clamp(height - margin.bottom - margin.top, 0, Infinity))
      .attr('transform', `translate(0, ${margin.top})`);

    // Set up the x-axis
    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(Math.max(width / 40, 5)) // horizontal tick every 20px
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
      .ticks(Math.max(graphHeight / 40, 5)) // vertical tick every 20px
      .tickSize(_.clamp(width - margin.right, 0, Infinity)) // for the guidelines to be full-width
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
        .attr('height', y(_.clamp(this.props.assertion.operand, 0, Infinity)));

    graphGroup.append('clipPath')
        .attr('id', 'clip-below')
      .append('rect')
        .attr('y', y(this.props.assertion.operand))
        .attr('width', graphWidth)
        .attr('height', _.clamp(graphHeight - y(this.props.assertion.operand), 0, Infinity));

    // Apply the clipping paths
    graphGroup.selectAll(style.line)
        .data(['Above', 'Below'])
      .enter().append('path')
        .attr('class', d => cx(style[this.props.assertion.relationship || 'none'], style.line + d))
        .attr('clip-path', d => 'url(#clip-' + d.toLowerCase() + ')')
        .datum(data)
        .attr('d', line);

    // Append the threshold line
    if (this.props.threshold){
      graphGroup.append('line')
        .attr('class', cx(style.thresholdLine, style[this.props.assertion.relationship || 'none']))
        .attr('x1', 0)
        .attr('x2', graphWidth)
        .attr('y1', y(this.props.assertion.operand))
        .attr('y2', y(this.props.assertion.operand));
    }

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

      tooltipGroup.selectAll('.js-tooltip-group')
        .data([currentDataPoint])
        .enter().append('title')
        .text(`This assertion is currently ${isCurrentPassing.toLowerCase()} with the most recent data point.`);

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
          .attr('transform', `translate(0, ${tooltipDimensions.height / 2}) rotate(-90)`);

      tooltipGroup.selectAll('text')
        .data([currentDataPoint])
        .enter().append('text')
        .attr('id', 'tooltipText')
        .attr('class', style.tooltipText)
        .attr('x', tooltipDimensions.width / 2)
        .attr('y', (tooltipDimensions.height / 2) + 5) // + half of font-size, roughly
        .text(() => {
          return isCurrentPassing === 'Passing' ? '✓' : '✕';
        });
    }
    return node.toReact();
  },
  render(){
    return (
      <div>
        {this.renderInner()}
      </div>
    )
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(StateGraph);