import React from 'react';
import Radium from 'radium';

const Base = React.createClass({
  getInitialState(){
    let width = this.props.size || 24;
    let height = this.props.size || 24;
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
    if(this.props.btn){
      style = {
        position:'absolute',
        left:'50%',
        top:'50%',
        margin:'-12px 0 0 -12px'
      }
    }else if(this.props.inline){
      style = {
        display:'inline-block',
        height:'1.3em',
        width:'1.3em',
        verticalAlign:'text-bottom'
      }
    }
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