import React, {PropTypes} from 'react';
import style from './heading.css';
import {Padding} from '../layout';

const Hyphenate = React.createClass({
  propTypes: {
    children: PropTypes.node,
    level: PropTypes.oneOf([1, 2, 3, 4, 5]),
    style: PropTypes.object,
    noPadding: PropTypes.bool
  },
  getDefaultProps() {
    return {
      level: 1,
      style: {}
    };
  },
  getPadding(){
    let padding = this.props.level < 3 ? 2 : 1;
    if (this.props.noPadding){
      padding = 0;
    }
    return {
      // t: padding,
      b: padding
    };
  },
  render(){
    const string = `h${this.props.level}`;
    const props = {
      className: style[string],
      style: this.props.style
    };
    return (
      <Padding {...this.getPadding()}>
        {
          React.createElement(string, props, this.props.children)
        }
      </Padding>
    );
  }
});

export default Hyphenate;