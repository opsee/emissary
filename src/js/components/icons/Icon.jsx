import React, {PropTypes} from 'react';
import SVG from './SVG';
import paths from './paths';

export default React.createClass({
  propTypes:{
    name:PropTypes.string.isRequired
  },
  render(){
    const path = paths[this.props.name];
    if(path){
      return SVG(path);
    }else{
      return <span>Bad Icon Name.</span>
    }
  }
});