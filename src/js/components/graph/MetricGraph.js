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

  render() {
    console.log(this.props.data);
    return (
      <div>
        graph
      </div>
    );
  }
});