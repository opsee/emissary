import React from 'react';
import Radium from 'radium';

const Base = React.createClass({
  getInitialState(){
    let width = this.props.width || 24;
    let height = this.props.height || 24;
    return {
      width:width,
      height:height,
      fill:this.props.fill || 'white',
      path:this.props.path || '',
      viewBox:this.props.viewBox || [0, 0, width, height].join(' '),
      style:this.props.style || {}
    }
  },
  render: function() {
    let style = {};
    return (
      <svg xmlns="http://www.w3.org/svg/2000"
        viewBox={this.state.viewBox}
        width={this.state.width}
        height={this.state.height}
        fill={this.state.fill}
        style={[style, this.state.style]}
        >
        <path d={this.state.path} />
      </svg>
    )
  }
});

export default Radium(Base);