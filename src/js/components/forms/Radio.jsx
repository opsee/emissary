import React, {PropTypes} from 'react';
React.initializeTouchEvents(true);

import {Padding} from '../layout';
import style from './radio.css';

export default React.createClass({
  propTypes: {
    on: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  },
  isActive() {
    return this.props.on ? 'active' : '';
  },
  handleTouch(e) {
    e.preventDefault();
    this.handleClick();
  },
  handleClick(e) {
    e.preventDefault();
    this.props.onChange.call(null, this.props.id, true);
  },
  render(){
    return (
      <div onClick={this.handleClick} onTouchEnd={this.handleTouch} style={{cursor: 'pointer'}}>
        <Padding b={1}>
          <button className={this.props.on ? style.radioActive : style.radio} type="button" onClick={this.handleClick} id={this.props.id}/>
        </Padding>
      </div>
    );
  }
});