import d3 from 'd3';
import React, { PropTypes } from 'react';
import ReactFauxDOM from 'react-faux-dom';

export default React.createClass({
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      unit: PropTypes.string,
      value: PropTypes.number.isRequired
    })).isRequired
  },

  componentDidMount() {
    this.fitToParentSize();

    window.addEventListener('resize', this.fitToParentSize);
  },

  componentWillReceiveProps () {
    this.fitToParentSize();
  },

  componentWillUnmount() {
    window.addEventListener('resize', this.fitToParentSize);
  },

  getInitialState() {
    return {
      width: 0,
      height: 500
    };
  },

  fitToParentSize() {
    const elem = this.getDOMNode();
    const width = elem.parentNode.offsetWidth;
    this.setState({ width });
  },

  render() {
    const node = ReactFauxDOM.createElement('svg');

    const margin = {top: 20, right: 20, bottom: 30, left: 50}
    const width = this.state.width - margin.left - margin.right
    const height = this.state.height - margin.top - margin.bottom

    const x = d3.time.scale()
      .range([0, width]);

    const y = d3.scale.linear()
      .range([height, 0]);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    const svg = d3.select(node)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Price ($)');

    return node.toReact();
  }
});