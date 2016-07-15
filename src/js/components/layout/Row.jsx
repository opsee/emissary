import React, {PropTypes} from 'react';
import cx from 'classnames';

const Row = React.createClass({
  propTypes: {
    children: PropTypes.node,
    className: PropTypes.string
  },
  render(){
    return (
      <div className={cx('row', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
});

export default Row;