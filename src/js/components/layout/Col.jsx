import React, {PropTypes} from 'react';
import _ from 'lodash';
import cx from 'classnames';

const sizes = ['xs', 'sm', 'md', 'lg'];

const Col = React.createClass({
  propTypes: _.assign({
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object
  }, _.chain(sizes)
      .keyBy(a => a)
      .mapValues(() => PropTypes.number)
      .value()
  ),
  getDefaultProps() {
    return {
      style: {}
    };
  },
  getClass(){
    const arr = sizes.map(size => {
      return this.props[size] && `col-${size}-${this.props[size]}`;
    });
    return cx(arr, this.props.className);
  },
  render(){
    return (
      <div className={this.getClass()} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
});

export default Col;