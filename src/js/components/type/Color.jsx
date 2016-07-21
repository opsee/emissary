import React, {PropTypes} from 'react';
import cx from 'classnames';

import style from './color.css';

const Color = React.createClass({
  propTypes: {
    children: PropTypes.node,
    c: PropTypes.string,
    scheme: PropTypes.string
  },
  getDefaultProps(){
    return {
      c: 'white'
    };
  },
  render(){
    return <span className={cx(style[this.props.c], style[this.props.scheme])}>{this.props.children}</span>;
  }
});

export default Color;