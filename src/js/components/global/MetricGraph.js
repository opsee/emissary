import _ from 'lodash';
import { render } from '../../modules/lineGraph';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

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

    editable: PropTypes.bool.isRequired,
  },

  componentDidMount() {
    this.fitToParentSize();

    window.addEventListener('resize', this.fitToParentSize);
  },

  componentWillReceiveProps() {
    this.fitToParentSize();
  },

  componentWillUnmount() {
    window.addEventListener('resize', this.fitToParentSize);
  },

  getDefaultProps() {
    return {
      data: [],
      metric: {},
      threshold: 1.0 // FIXME remove
    };
  },

  getInitialState() {
    return {
      width: 0,
      aspectRatio: 0.5
    };
  },

  render() {
    console.log(this.props);
    const opts = _.assign({}, this.state, this.props);
    return render(this.props.data, opts);
  },

  fitToParentSize() {
    const elem = ReactDOM.findDOMNode(this);
    const width = elem.parentNode.offsetWidth;
    this.setState({ width });
  }
});