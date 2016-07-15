import React, {PropTypes} from 'react';
import _ from 'lodash';
import style from './padding.css';
import cx from 'classnames';

const avail = ['t', 'b', 'tb', 'l', 'r', 'lr', 'a'];

const Padding = React.createClass({
  propTypes: _.assign({
    inline: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object
  }, _.chain(avail)
      .keyBy(a => a)
      .mapValues(() => PropTypes.number)
      .value()
  ),
  getClass(){
    let arr = [];
    for (const prop in this.props){
      if (avail.indexOf(prop) > -1){
        let num = this.props[prop];
        if (num === 0.5){
          num = 'half';
        }
        if (num === 1){
          num = '';
        }
        arr.push(style[`p${prop}${num}`]);
      }
    }
    if (!arr.length){
      arr.push(style.pa);
    }
    arr.push(this.props.className);
    return cx(arr);
  },
  render(){
    if (this.props.inline){
      return (
        <span className={this.getClass()} style={this.props.style}>
          {this.props.children}
        </span>
      );
    }
    return (
      <div className={this.getClass()} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
});

export default Padding;