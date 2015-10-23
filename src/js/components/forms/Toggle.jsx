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
    let c = {};
    return this.props.on ? style.toggleSwitchActive : style.toggleSwitch;
  },
  render(){
    return (
      <div className={this.getToggleClass()} onClick={this.onClick} onTouchEnd={this.handleTouch}>
      {
        // <div className="knob"></div>
      }
        <button className={style.knob} id={this.props.id}/>
      </div>
    );
  }
});