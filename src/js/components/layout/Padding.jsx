import React, {PropTypes} from 'react';
import style from './padding.css';
import cx from 'classnames';

const availProps = ['t', 'b', 'tb', 'l', 'r', 'lr', 'a'];
let types = {};
availProps.forEach(string => {
  types[string] = PropTypes.number
});

var Padding = React.createClass({
  propTypes:types,
  getClass(){
    var arr = [];
    for(var prop in this.props){
      if(availProps.indexOf(prop) > -1){
        let num = this.props[prop];
        if(num === .5){
          num = 'half';
        }
        if(num === 1){
          num = '';
        }
        arr.push(style[`p${prop}${num}`]);
      }
    }
    if(!arr.length){
      arr.push(style.pa);
    }
    return cx(arr);
  },
  render(){
    return (
      <div className={this.getClass()}>
        {this.props.children}
      </div>
    )
  }
})

export default Padding;