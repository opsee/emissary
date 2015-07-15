import React from 'react';

export default React.createClass({
  getInitialState() {
    return {
      on:false
    }
  },
  handleClick() {
    this.setState({
      on:!this.state.on
    })
  },
  render() {
    return (
      <div className={this.props.great ? 'foo' : 'moo'}>
        radial! {this.props.great}
        <div>
          <button onClick={this.handleClick}>{this.state.on ? 'ON' : 'OFF'}</button>
        </div>
      </div>
    );
  }
});