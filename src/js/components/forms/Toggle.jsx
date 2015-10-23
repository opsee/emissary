import React, {PropTypes} from 'react';
import _ from 'lodash';
React.initializeTouchEvents(true);
import style from './toggle.css';

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
  getToggleClass(){
    return this.props.on ? style.toggleSwitchActive : style.toggleSwitch;
  },
  getKnobClass(){
    return this.props.on ? style.toggleKnobActive : style.toggleKnob;
  },
  render(){
    return (
      <div className={this.getToggleClass()} onClick={this.onClick} onTouchEnd={this.handleTouch}>
        <button className={this.getKnobClass()} id={this.props.id}/>
      </div>
    );
  }
});