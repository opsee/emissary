import React, {PropTypes} from 'react';
import cx from 'classnames';

const Grid = React.createClass({
  propTypes: {
    fluid: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string
  },
  render(){
    return (
      <div className={cx(this.props.fluid ? 'container-fluid' : 'container', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
});

export default Grid;