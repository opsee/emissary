import React from 'react';

export default React.createClass({
  getInitialState() {
    return {
      on:false
    }
  },
  getTitle(){
    switch(this.props.item.status.state){
      case 'running':
      return this.props.item.status.silence.remaining ? 
      `This check is running, but is ` :
      `This check is running and has a health of %`;
      break;
      case 'unmonitored':
      return 'This check is currently unmonitored.';
      break;
      case 'stopped':
      return 'This check is stopped in AWS.';
      break;
    }
  },
  handleClick() {
    this.setState({
      on:!this.state.on
    })
  },
  render() {
    const text = 'foo';
    const status = this.props.item.status;
    return (
      <div className={'radial-graph '+status.state+(status.silence.remaining ? ' silenced' : '')} title={this.getTitle()}>
        <svg>
          <path className="loader"/>
        </svg>
        <div className="radial-graph-inner {{bool}}" ng-if="status.state == 'running'">{text}</div>
      <div className="pie-slice"></div>
    </div>
    );
  }
});