import { render } from '../../modules/lineGraph';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

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

  componentWillReceiveProps() {
    this.fitToParentSize();
  },

  componentWillUnmount() {
    window.addEventListener('resize', this.fitToParentSize);
  },

  getInitialState() {
    return {
      width: 0,
      aspectRatio: 0.5
    };
  },

  render() {
    return render(this.props.data, this.state);
  },

  fitToParentSize() {
    const elem = ReactDOM.findDOMNode(this);
    const width = elem.parentNode.offsetWidth;
    this.setState({ width });
  }
});