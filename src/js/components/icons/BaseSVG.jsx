import React from 'react';
import Radium from 'radium';

const Base = React.createClass({
  getState(props){
    props = props || this.props;
    let width = props.width || 24;
    let height = props.height || 24;
    return {
      width:width,
      height:height,
      fill:props.fill || 'white',
      path:props.path || '',
      viewBox:props.viewBox || [0, 0, width, height].join(' '),
      style:props.style || {},
      className:props.className
    }
  },
  componentWillReceiveProps(newProps){
    this.setState(this.getState(newProps));
  },
  getInitialState(){
    return this.getState();
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
        className={this.state.className}
        >
        <path d={this.state.path} />
      </svg>
    )
  }
});

export default Radium(Base);