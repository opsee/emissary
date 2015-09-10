import React, {PropTypes} from 'react';
import _ from 'lodash';
React.initializeTouchEvents(true);

export default React.createClass({
  propTypes:{
    on:PropTypes.bool.isRequired
  },
  handleTouch(e){
    e.preventDefault();
    this.onClick();
  },
  onClick(){
    this.props.onChange.call(null, this.props.id, !this.props.on);
  },
  isActive(){
    return this.props.on ? 'active' : '';
  },
  render(){
    return <div className={`radio ${this.isActive()}`} onClick={this.onClick} onTouchEnd={this.handleTouch}></div>
  }
});