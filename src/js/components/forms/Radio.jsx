import React, {PropTypes} from 'react';
import _ from 'lodash';
React.initializeTouchEvents(true);

export default React.createClass({
  propTypes:{
    on:PropTypes.bool.isRequired,
    id:PropTypes.string.isRequired
  },
  handleTouch(e){
    e.preventDefault();
    this.onClick();
  },
  onClick(e){
    e.preventDefault();
    this.props.onChange.call(null, this.props.id, !this.props.on);
  },
  isActive(){
    return this.props.on ? 'active' : '';
  },
  render(){
    return (
      <div onClick={this.onClick} onTouchEnd={this.handleTouch} className="padding-tb-sm" style={{cursor:'pointer'}}>
        <button className={`radio ${this.isActive()}`} type="button" onClick={this.onClick} id={this.props.id}/>
      </div>
    )
  }
});