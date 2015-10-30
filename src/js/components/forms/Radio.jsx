import React, {PropTypes} from 'react';
React.initializeTouchEvents(true);

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
    this.props.onChange.call(null, this.props.id, !this.props.on);
  },
  render(){
    return (
      <div onClick={this.handleClick} onTouchEnd={this.handleTouch} className="padding-tb-sm" style={{cursor: 'pointer'}}>
        <button className={`radio ${this.isActive()}`} type="button" onClick={this.handleClick} id={this.props.id}/>
      </div>
    );
  }
});