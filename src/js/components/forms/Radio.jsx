import React, {PropTypes} from 'react';
React.initializeTouchEvents(true);
import {Padding} from '../layout';

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
        <Padding tb={0.5}>
          <button className={`radio ${this.isActive()}`} type="button" onClick={this.handleClick} id={this.props.id}/>
        </Padding>
      </div>
    );
  }
});